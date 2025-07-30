import asyncio
import logging
from typing import List
from celery import Celery
from sqlalchemy.orm import Session

from app.celery_app import celery_app
from app.core.database import SessionLocal
from app import crud
from app.models.donation import DonationStatus, PaymentMethod, Donation
from app.api.api_v1.endpoints.payments import check_tbank_payment_status
from app.core import deps

logger = logging.getLogger(__name__)

@celery_app.task
def check_pending_payments():
    """
    Периодическая задача для проверки статусов PENDING платежей
    """
    logger.info("🔍 Запуск проверки PENDING платежей (каждые 10 секунд)")
    
    db = SessionLocal()
    try:
        # Получаем все PENDING платежи
        pending_donations = db.query(Donation).filter(
            Donation.status == DonationStatus.PENDING,
            Donation.payment_method == PaymentMethod.TBANK,
            Donation.payment_id.is_not(None)
        ).all()
        
        logger.info(f"📊 Найдено {len(pending_donations)} PENDING платежей для проверки")
        
        checked_count = 0
        updated_count = 0
        
        for donation in pending_donations:
            try:
                logger.info(f"🔍 Проверяем donation ID: {donation.id}, payment_id: {donation.payment_id}")
                
                # Проверяем статус через T-Bank API
                result = asyncio.run(check_tbank_payment_by_payment_id(donation.payment_id, db))
                
                if result and result.get("success"):
                    payment_status = result.get("status")
                    logger.info(f"💳 Получен статус: {payment_status} для donation {donation.id}")
                    
                    # Обновляем статус если платеж завершен
                    if payment_status in ["CONFIRMED", "AUTHORIZED"]:
                        logger.info(f"✅ Обновляем donation {donation.id} на COMPLETED")
                        donation.status = DonationStatus.COMPLETED
                        db.commit()
                        updated_count += 1
                        
                        # Обновляем статистику стримера
                        if donation.streamer_id:
                            streamer = crud.streamer.get(db, id=donation.streamer_id)
                            if streamer:
                                new_total = streamer.current_donations + donation.amount
                                crud.streamer.update(
                                    db, 
                                    db_obj=streamer, 
                                    obj_in={"current_donations": new_total}
                                )
                        
                        # Отправляем уведомление через WebSocket
                        try:
                            from app.services.websocket_service import notify_new_donation
                            asyncio.run(notify_new_donation({
                                "donor_name": donation.donor_name if not donation.is_anonymous else None,
                                "amount": donation.amount,
                                "message": donation.message or "",
                                "is_anonymous": donation.is_anonymous
                            }, donation.streamer_id, db))
                        except Exception as ws_error:
                            logger.error(f"❌ Ошибка отправки WebSocket уведомления: {ws_error}")
                    
                    elif payment_status in ["CANCELLED", "REVERSED", "REFUNDED"]:
                        logger.info(f"❌ Обновляем donation {donation.id} на FAILED")
                        donation.status = DonationStatus.FAILED
                        db.commit()
                        updated_count += 1
                
                checked_count += 1
                
            except Exception as e:
                logger.error(f"❌ Ошибка при проверке donation {donation.id}: {str(e)}")
                continue
        
        logger.info(f"✅ Проверка завершена. Проверено: {checked_count}, Обновлено: {updated_count}")
        return {
            "checked": checked_count,
            "updated": updated_count,
            "total_pending": len(pending_donations)
        }
        
    except Exception as e:
        logger.error(f"❌ Общая ошибка при проверке платежей: {str(e)}")
        return {"error": str(e)}
    finally:
        db.close()

async def check_tbank_payment_by_payment_id(payment_id: str, db: Session):
    """
    Проверка статуса T-Bank платежа по payment_id
    """
    import hashlib
    import httpx
    from app.core.config import settings
    
    try:
        # Подготавливаем данные для запроса GetState
        request_data = {
            "TerminalKey": settings.TBANK_TERMINAL,
            "PaymentId": payment_id
        }
        
        # Генерируем токен
        token_params = {
            "PaymentId": payment_id,
            "TerminalKey": settings.TBANK_TERMINAL,
            "Password": settings.TBANK_SECRET_KEY
        }
        
        sorted_keys = sorted(token_params.keys())
        token_string = ''.join([str(token_params[key]) for key in sorted_keys])
        token = hashlib.sha256(token_string.encode('utf-8')).hexdigest()
        
        request_data['Token'] = token
        
        # Отправляем запрос к T-Bank API
        url = "https://securepay.tinkoff.ru/v2/GetState"
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "StreamCash/1.0"
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=request_data, headers=headers)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("Success"):
                    return {
                        "success": True,
                        "status": result.get("Status"),
                        "payment_id": result.get("PaymentId")
                    }
            
            return {"success": False, "error": f"API returned {response.status_code}"}
            
    except Exception as e:
        logger.error(f"❌ Ошибка проверки T-Bank статуса: {str(e)}")
        return {"success": False, "error": str(e)}