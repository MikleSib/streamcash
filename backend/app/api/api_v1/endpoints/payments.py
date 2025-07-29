from typing import Any
import httpx

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app import crud
from app.core import deps
from app.core.config import settings
from app.models.donation import DonationStatus, PaymentMethod
from app.services.payment_service import PaymentService
from app.services.websocket_service import notify_new_donation
from pydantic import BaseModel

router = APIRouter()

class PaymentInitRequest(BaseModel):
    amount: float
    order_id: str
    payment_method: str
    description: str = "Донат"

@router.post("/init")
async def init_payment(
    request: PaymentInitRequest,
    db: Session = Depends(deps.get_db),
) -> Any:
    try:
        payment_service = PaymentService()
        
        # Определяем метод платежа
        payment_method = PaymentMethod.TBANK if request.payment_method == 'tbank' else PaymentMethod.TEST
        
        # Создаем платеж
        payment_data = await payment_service.create_payment(
            amount=request.amount,
            description=request.description,
            payment_method=payment_method
        )
        
        return {
            "success": True,
            "payment_url": payment_data["confirmation_url"],
            "payment_id": payment_data["id"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/tbank/init")
async def init_tbank_payment(
    request: PaymentInitRequest,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Создание платежа T-Bank с генерацией токена
    """
    print(f"🔍 Получен запрос на создание T-Bank платежа: {request}")
    print(f"🔍 Переменные окружения:")
    print(f"   TBANK_TERMINAL: {settings.TBANK_TERMINAL}")
    print(f"   TBANK_SECRET_KEY: {settings.TBANK_SECRET_KEY}")
    print(f"   TBANK_PASSWORD: {settings.TBANK_PASSWORD}")
    
    try:
        import hashlib
        import time
        import uuid
        
        # Проверяем обязательные поля
        if not request.amount or request.amount <= 0:
            raise HTTPException(status_code=400, detail="Сумма должна быть больше 0")
        
        if not settings.TBANK_TERMINAL:
            raise HTTPException(status_code=400, detail="T-Bank terminal не настроен")
        
        if not settings.TBANK_SECRET_KEY:
            raise HTTPException(status_code=400, detail="T-Bank secret key не настроен")
        
        # Генерируем уникальный ID заказа
        order_id = request.order_id or f"order_{int(time.time() * 1000)}_{uuid.uuid4().hex[:8]}"
        
        print(f"🔧 Настройки T-Bank: Terminal={settings.TBANK_TERMINAL}, SecretKey={settings.TBANK_SECRET_KEY}")
        print(f"🔧 Длина SecretKey: {len(settings.TBANK_SECRET_KEY) if settings.TBANK_SECRET_KEY else 0}")
        
        # Подготавливаем данные для создания платежа
        payment_data = {
            "TerminalKey": settings.TBANK_TERMINAL,
            "Amount": int(request.amount * 100),  # T-Bank ожидает сумму в копейках
            "OrderId": order_id,
            "Description": request.description,
            "Language": "ru",
            "SuccessURL": f"{settings.FRONTEND_URL}/donate/success?orderId={order_id}&amount={request.amount}",
            "FailURL": f"{settings.FRONTEND_URL}/donate/failed?orderId={order_id}&amount={request.amount}",
            "NotificationURL": f"{settings.API_URL}/api/v1/payments/webhook/tbank",
            "DATA": {
                "connection_type": "API"
            }
        }
        
        # Генерируем токен для подписи
        # Генерируем токен для подписи согласно документации T-Bank
        # Создаем массив пар ключ-значение
        token_params = [
            {"Amount": str(payment_data['Amount'])},
            {"Description": payment_data['Description']},
            {"OrderId": payment_data['OrderId']},
            {"Password": settings.TBANK_PASSWORD},
            {"TerminalKey": payment_data['TerminalKey']}
        ]
        
        # Сортируем по алфавиту по ключу
        token_params.sort(key=lambda x: list(x.keys())[0])
        
        # Выводим отсортированные параметры для отладки
        print("🔍 Отсортированные параметры для токена:")
        for param in token_params:
            key = list(param.keys())[0]
            value = list(param.values())[0]
            print(f"   {key}: {value}")
        
        # Конкатенируем только значения
        token_string = ''.join([list(param.values())[0] for param in token_params])
        print(f"🔑 Строка для генерации токена: {token_string}")
        token = hashlib.sha256(token_string.encode('utf-8')).hexdigest()
        print(f"🔑 Сгенерированный токен: {token}")
        payment_data["Token"] = token
        
        print(f"T-Bank payment data: {payment_data}")
        
        # Отправляем запрос к T-Bank API
        url = "https://securepay.tinkoff.ru/v2/"
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payment_data)
            result = response.json()
            
            print(f"T-Bank API response: {result}")
            
            if result.get("Success"):
                return {
                    "success": True,
                    "payment_id": result.get("PaymentId", order_id),
                    "payment_url": result.get("PaymentURL"),
                    "order_id": order_id,
                    "amount": request.amount,
                    "token": token
                }
            else:
                error_msg = f"T-Bank payment creation failed: {result}"
                print(error_msg)
                raise HTTPException(status_code=400, detail=error_msg)
                
    except Exception as e:
        print(f"T-Bank API error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.options("/webhook/test")
async def test_webhook_options():
    return {"status": "ok"}

@router.post("/webhook/yookassa")
async def yookassa_webhook(
    request: Request,
    db: Session = Depends(deps.get_db),
) -> Any:
    payload = await request.json()
    payment_service = PaymentService()
    
    if payload.get("event") == "payment.succeeded":
        payment_id = payload["object"]["id"]
        donation = crud.donation.get_by_payment_id(db, payment_id=payment_id)
        
        if donation:
            donation = crud.donation.update(
                db, 
                db_obj=donation, 
                obj_in={"status": DonationStatus.COMPLETED}
            )
            
            streamer = crud.streamer.get(db, id=donation.streamer_id)
            if streamer:
                new_total = streamer.current_donations + donation.amount
                crud.streamer.update(
                    db, 
                    db_obj=streamer, 
                    obj_in={"current_donations": new_total}
                )
                
                await notify_new_donation({
                    "donor_name": donation.donor_name if not donation.is_anonymous else None,
                    "amount": donation.amount,
                    "message": donation.message or "",
                    "is_anonymous": donation.is_anonymous
                }, streamer.id, db)
    
    return {"status": "ok"}

@router.post("/webhook/tinkoff")
async def tinkoff_webhook(
    request: Request,
    db: Session = Depends(deps.get_db),
) -> Any:
    payload = await request.json()
    
    if payload.get("Status") == "CONFIRMED":
        payment_id = payload["PaymentId"]
        donation = crud.donation.get_by_payment_id(db, payment_id=payment_id)
        
        if donation:
            donation = crud.donation.update(
                db, 
                db_obj=donation, 
                obj_in={"status": DonationStatus.COMPLETED}
            )
            
            streamer = crud.streamer.get(db, id=donation.streamer_id)
            if streamer:
                new_total = streamer.current_donations + donation.amount
                crud.streamer.update(
                    db, 
                    db_obj=streamer, 
                    obj_in={"current_donations": new_total}
                )
                
                await notify_new_donation({
                    "donor_name": donation.donor_name if not donation.is_anonymous else None,
                    "amount": donation.amount,
                    "message": donation.message or "",
                    "is_anonymous": donation.is_anonymous
                }, streamer.id, db)
    
        return {"status": "ok"}

@router.post("/webhook/tbank")
async def tbank_webhook(
    request: Request,
    db: Session = Depends(deps.get_db),
) -> Any:
    payload = await request.json()
    print(f"T-Bank webhook payload: {payload}")
    
    # Согласно документации Т-банка, статусы приходят в поле Status
    status = payload.get("Status")
    payment_id = payload.get("PaymentId")
    
    if not payment_id:
        return {"status": "error", "message": "No PaymentId provided"}
    
    donation = crud.donation.get_by_payment_id(db, payment_id=payment_id)
    if not donation:
        return {"status": "error", "message": "Donation not found"}
    
    # Статусы согласно документации Т-банка
    if status == "CONFIRMED":
        donation = crud.donation.update(
            db, 
            db_obj=donation, 
            obj_in={"status": DonationStatus.COMPLETED}
        )
        
        streamer = crud.streamer.get(db, id=donation.streamer_id)
        if streamer:
            new_total = streamer.current_donations + donation.amount
            crud.streamer.update(
                db, 
                db_obj=streamer, 
                obj_in={"current_donations": new_total}
            )
            
            await notify_new_donation({
                "donor_name": donation.donor_name if not donation.is_anonymous else None,
                "amount": donation.amount,
                "message": donation.message or "",
                "is_anonymous": donation.is_anonymous
            }, streamer.id, db)
    
    elif status in ["CANCELLED", "REVERSED", "REFUNDED", "PARTIAL_REFUNDED"]:
        donation = crud.donation.update(
            db, 
            db_obj=donation, 
            obj_in={"status": DonationStatus.FAILED}
        )
    
    return {"status": "ok"}

@router.post("/webhook/test")
async def test_webhook(
    request: Request,
    db: Session = Depends(deps.get_db),
) -> Any:
    print(f"Test webhook called with request: {request}")
    payload = await request.json()
    print(f"Test webhook payload: {payload}")
    
    if payload.get("status") == "succeeded":
        payment_id = payload["payment_id"]
        donation = crud.donation.get_by_payment_id(db, payment_id=payment_id)
        
        if donation:
            donation = crud.donation.update(
                db, 
                db_obj=donation, 
                obj_in={"status": DonationStatus.COMPLETED}
            )
            
            streamer = crud.streamer.get(db, id=donation.streamer_id)
            if streamer:
                new_total = streamer.current_donations + donation.amount
                crud.streamer.update(
                    db, 
                    db_obj=streamer, 
                    obj_in={"current_donations": new_total}
                )
                
                await notify_new_donation({
                    "donor_name": donation.donor_name if not donation.is_anonymous else None,
                    "amount": donation.amount,
                    "message": donation.message or "",
                    "is_anonymous": donation.is_anonymous
                }, streamer.id, db)
    
    return {"status": "ok"}

@router.get("/status/{payment_id}")
async def check_payment_status(
    payment_id: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    donation = crud.donation.get_by_payment_id(db, payment_id=payment_id)
    if not donation:
        raise HTTPException(status_code=404, detail="Payment not found")

    payment_service = PaymentService()
    status = await payment_service.check_payment_status(payment_id)

    return {
        "payment_id": payment_id,
        "status": status,
        "donation_id": donation.id
    } 