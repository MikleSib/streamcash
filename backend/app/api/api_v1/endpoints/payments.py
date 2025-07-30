from typing import Any
import httpx
import logging

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

# Настройка логгера
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class PaymentInitRequest(BaseModel):
    amount: float
    order_id: str
    payment_method: str
    description: str = "Донат"
    streamer_id: int

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
            "NotificationURL": f"{settings.API_URL}/api/v1/payments/webhook/tbank",
            "SuccessURL": f"{settings.FRONTEND_URL}/donate/success?orderId={order_id}&amount={request.amount}",
            "FailURL": f"{settings.FRONTEND_URL}/donate/failed?orderId={order_id}&amount={request.amount}"
        }
        
        # Генерируем токен для подписи согласно документации T-Bank
        # Создаем словарь параметров (только те, которые не пустые)
        token_params = {
            "Amount": payment_data['Amount'],
            "Description": payment_data['Description'], 
            "FailURL": payment_data['FailURL'],
            "Language": payment_data['Language'],
            "NotificationURL": payment_data['NotificationURL'],
            "OrderId": payment_data['OrderId'],
            "SuccessURL": payment_data['SuccessURL'],
            "TerminalKey": payment_data['TerminalKey']
        }
        
        # Добавляем Password (секретный ключ) для генерации токена
        token_params["Password"] = settings.TBANK_SECRET_KEY
        
        # Сортируем параметры по алфавиту (по ключам)
        sorted_keys = sorted(token_params.keys())
        
        # Выводим отсортированные параметры для отладки
        print("🔍 Отсортированные параметры для токена:")
        for key in sorted_keys:
            value = str(token_params[key])
            print(f"   {key}: {value}")
        
        # Конкатенируем значения в алфавитном порядке ключей
        token_string = ''.join([str(token_params[key]) for key in sorted_keys])
        print(f"🔑 Строка для генерации токена: {token_string}")
        
        # Генерируем SHA-256 хэш
        token = hashlib.sha256(token_string.encode('utf-8')).hexdigest()
        print(f"🔑 Сгенерированный токен: {token}")
        
        # Удаляем Password из данных запроса (он не должен передаваться в API)
        payment_data['Token'] = token
        
        print(f"T-Bank payment data: {payment_data}")
        
        # Отправляем запрос к T-Bank API (боевая среда)
        url = "https://securepay.tinkoff.ru/v2/Init"
        
        # Заголовки согласно документации
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "StreamCash/1.0"
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            print(f"🌐 Отправляем запрос на URL: {url}")
            print(f"📤 Данные запроса: {payment_data}")
            print(f"📤 Заголовки: {headers}")
            
            # Проверим доступность хоста
            try:
                test_response = await client.get("https://securepay.tinkoff.ru/", timeout=10.0)
                print(f"🔍 Тестовый запрос к хосту: статус {test_response.status_code}")
            except Exception as e:
                print(f"❌ Хост недоступен: {e}")
            
            # Попробуем разные способы отправки
            try:
                # Способ 1: JSON в теле запроса
                response = await client.post(url, json=payment_data, headers=headers)
            except Exception as e:
                print(f"❌ Ошибка при отправке JSON: {e}")
                # Способ 2: Данные как строка JSON
                import json
                headers["Content-Type"] = "application/json"
                response = await client.post(url, data=json.dumps(payment_data), headers=headers)
            
            print(f"📥 Статус ответа: {response.status_code}")
            print(f"📥 Заголовки ответа: {dict(response.headers)}")
            print(f"📥 Текст ответа: {response.text}")
            
            if response.status_code != 200:
                raise HTTPException(status_code=400, detail=f"T-Bank API returned status {response.status_code}: {response.text}")
            
            try:
                result = response.json()
                print(f"T-Bank API response: {result}")
            except Exception as e:
                print(f"❌ Ошибка парсинга JSON: {e}")
                print(f"❌ Текст ответа: {response.text}")
                raise HTTPException(status_code=400, detail=f"Invalid JSON response from T-Bank: {response.text}")
            
            if result.get("Success"):
                # Создаем запись доната в базе данных
                payment_id = result.get("PaymentId", order_id)
                
                # Создаем запись доната с данными из запроса
                from app.schemas.donation import DonationCreate
                
                # Найдем streamer по ID, чтобы получить recipient_id (user_id)
                streamer = crud.streamer.get(db, id=request.streamer_id)
                if not streamer:
                    raise HTTPException(status_code=404, detail="Streamer not found")
                
                donation_create = DonationCreate(
                    amount=request.amount,
                    donor_name="Аноним",  # Будет обновлено после успешного платежа
                    message="",
                    is_anonymous=True,
                    recipient_id=streamer.user_id,
                    payment_method=PaymentMethod.TBANK
                )
                
                print(f"💾 Создаем запись доната: {donation_create}")
                donation = crud.donation.create(db, obj_in=donation_create)
                
                # Обновляем донат с payment_id и статусом
                donation = crud.donation.update(
                    db, 
                    db_obj=donation, 
                    obj_in={
                        "payment_id": payment_id,
                        "status": DonationStatus.PENDING
                    }
                )
                print(f"✅ Донат создан с ID: {donation.id}")
                
                return {
                    "success": True,
                    "payment_id": payment_id,
                    "payment_url": result.get("PaymentURL"),
                    "order_id": order_id,
                    "amount": request.amount,
                    "donation_id": donation.id,
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

@router.api_route("/webhook/tbank", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])
async def tbank_webhook(
    request: Request,
    db: Session = Depends(deps.get_db),
) -> Any:
    print(f"🔔 Получен запрос на T-Bank webhook!")
    print(f"📍 URL: {request.url}")
    print(f"📍 Method: {request.method}")
    print(f"📍 Headers: {dict(request.headers)}")
    print(f"📍 Client: {request.client}")
    
    # Если это GET запрос - возвращаем статус (для проверки доступности)
    if request.method == "GET":
        print("✅ GET запрос на webhook - возвращаем статус OK")
        return {"status": "ok", "message": "T-Bank webhook endpoint is accessible", "method": "GET"}
    
    # Если это OPTIONS запрос - возвращаем CORS заголовки
    if request.method == "OPTIONS":
        print("✅ OPTIONS запрос на webhook - возвращаем CORS заголовки")
        return {"status": "ok", "message": "CORS preflight", "method": "OPTIONS"}
    
    try:
        payload = await request.json()
        print(f"📩 T-Bank webhook payload: {payload}")
    except Exception as e:
        print(f"❌ Ошибка парсинга JSON: {e}")
        body = await request.body()
        print(f"📩 Raw body: {body}")
        return {"status": "error", "message": "Invalid JSON"}
    
    # Согласно документации Т-банка, статусы приходят в поле Status
    status = payload.get("Status")
    payment_id = payload.get("PaymentId")
    order_id = payload.get("OrderId")
    
    print(f"📊 Статус: {status}, PaymentId: {payment_id}, OrderId: {order_id}")
    
    if not payment_id:
        print(f"❌ Отсутствует PaymentId в webhook")
        return {"status": "error", "message": "No PaymentId provided"}
    
    donation = crud.donation.get_by_payment_id(db, payment_id=payment_id)
    if not donation:
        print(f"❌ Донат не найден для payment_id: {payment_id}")
        print(f"🔍 Попробуем найти по order_id: {order_id}")
        # Попробуем найти по order_id как резервный вариант
        if order_id:
            all_donations = crud.donation.get_multi(db)
            print(f"🔍 Всего донатов в базе: {len(all_donations)}")
            for d in all_donations:
                print(f"   Донат ID: {d.id}, payment_id: {d.payment_id}")
        return {"status": "error", "message": f"Donation not found for payment_id: {payment_id}"}
    
    # Проверяем токен уведомления (если требуется)
    notification_token = payload.get("Token")
    if notification_token:
        print(f"🔐 Получен токен уведомления: {notification_token}")
        # TODO: Добавить проверку токена согласно документации T-Bank
    
    # Статусы согласно документации Т-банка
    # Для тестовых платежей и некоторых реальных может приходить статус NEW
    if status in ["CONFIRMED", "NEW"]:
        print(f"✅ Обрабатываем успешный платеж со статусом: {status}")
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
            
            print(f"Sending notification for donation: {donation.id} to streamer: {streamer.id}")
            await notify_new_donation({
                "donor_name": donation.donor_name if not donation.is_anonymous else None,
                "amount": donation.amount,
                "message": donation.message or "",
                "is_anonymous": donation.is_anonymous
            }, streamer.id, db)
            
            print(f"✅ Уведомление отправлено успешно")
    
    elif status in ["CANCELLED", "REVERSED", "REFUNDED", "PARTIAL_REFUNDED"]:
        print(f"❌ Обрабатываем неуспешный платеж со статусом: {status}")
        donation = crud.donation.update(
            db, 
            db_obj=donation, 
            obj_in={"status": DonationStatus.FAILED}
        )
    
    else:
        print(f"ℹ️ Получен статус {status}, обновляем донат")
        # Для других статусов просто логируем
    
    # Возвращаем ответ согласно документации T-Bank
    print(f"✅ Webhook обработан успешно, возвращаем OK")
    return {"OK": True}

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