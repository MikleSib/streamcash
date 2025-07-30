#!/usr/bin/env python3
"""
Простой скрипт для автоматической проверки статусов PENDING платежей
Запускается в цикле каждые 10 секунд
"""

import asyncio
import time
import logging
import hashlib
import httpx
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Импорты приложения
import sys
import os
sys.path.append('/app')

from app.core.config import settings
from app.core.database import SessionLocal
from app.models.donation import DonationStatus, PaymentMethod, Donation
from app import crud

async def check_tbank_payment_status(payment_id: str):
    """Проверка статуса платежа в T-Bank"""
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
            
            logger.error(f"T-Bank API вернул статус {response.status_code}: {response.text}")
            return {"success": False, "error": f"API returned {response.status_code}"}
            
    except Exception as e:
        logger.error(f"Ошибка проверки T-Bank статуса для payment_id {payment_id}: {str(e)}")
        return {"success": False, "error": str(e)}

async def process_pending_payments():
    """Обработка всех PENDING платежей"""
    db = SessionLocal()
    try:
        # Получаем все PENDING платежи T-Bank
        pending_donations = db.query(Donation).filter(
            Donation.status == DonationStatus.PENDING,
            Donation.payment_method == PaymentMethod.TBANK,
            Donation.payment_id.is_not(None)
        ).all()
        
        if not pending_donations:
            logger.info("📊 PENDING платежей не найдено")
            return 0
        
        logger.info(f"📊 Найдено {len(pending_donations)} PENDING платежей для проверки")
        
        updated_count = 0
        
        for donation in pending_donations:
            try:
                logger.info(f"🔍 Проверяем donation ID: {donation.id}, payment_id: {donation.payment_id}")
                
                # Проверяем статус через T-Bank API
                result = await check_tbank_payment_status(donation.payment_id)
                
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
                                logger.info(f"📊 Обновлена статистика стримера {streamer.id}: +{donation.amount} руб")
                        
                        # Отправляем WebSocket уведомление
                        try:
                            from app.services.websocket_service import notify_new_donation
                            await notify_new_donation({
                                "donor_name": donation.donor_name if not donation.is_anonymous else None,
                                "amount": donation.amount,
                                "message": donation.message or "",
                                "is_anonymous": donation.is_anonymous
                            }, donation.streamer_id, db)
                            logger.info(f"🔔 Отправлено WebSocket уведомление для donation {donation.id}")
                        except Exception as ws_error:
                            logger.error(f"❌ Ошибка отправки WebSocket уведомления: {ws_error}")
                    
                    elif payment_status in ["CANCELLED", "REVERSED", "REFUNDED"]:
                        logger.info(f"❌ Обновляем donation {donation.id} на FAILED")
                        donation.status = DonationStatus.FAILED
                        db.commit()
                        updated_count += 1
                    
                    else:
                        logger.info(f"ℹ️ Статус {payment_status} для donation {donation.id} - пока оставляем PENDING")
                
                else:
                    logger.warning(f"⚠️ Не удалось проверить статус donation {donation.id}: {result.get('error')}")
                
            except Exception as e:
                logger.error(f"❌ Ошибка при обработке donation {donation.id}: {str(e)}")
                continue
        
        if updated_count > 0:
            logger.info(f"✅ Обработка завершена. Обновлено: {updated_count} из {len(pending_donations)}")
        else:
            logger.info(f"✅ Обработка завершена. Все {len(pending_donations)} платежей остались в статусе PENDING")
        
        return updated_count
        
    except Exception as e:
        logger.error(f"❌ Общая ошибка при обработке платежей: {str(e)}")
        return 0
    finally:
        db.close()

def check_database_connection():
    """Проверка подключения к базе данных"""
    try:
        from sqlalchemy import text
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        logger.info("✅ Подключение к базе данных успешно")
        return True
    except Exception as e:
        logger.error(f"❌ Ошибка подключения к базе данных: {str(e)}")
        return False

def check_settings():
    """Проверка настроек T-Bank"""
    missing = []
    if not settings.TBANK_TERMINAL:
        missing.append("TBANK_TERMINAL")
    if not settings.TBANK_SECRET_KEY:
        missing.append("TBANK_SECRET_KEY")
    
    if missing:
        logger.error(f"❌ Отсутствуют настройки: {', '.join(missing)}")
        return False
    
    logger.info("✅ Настройки T-Bank корректны")
    return True

async def main():
    """Главный цикл проверки платежей"""
    logger.info("🚀 Запускается автоматическая проверка платежей T-Bank")
    
    # Проверяем настройки
    if not check_settings():
        logger.error("❌ Проверьте переменные окружения и перезапустите")
        return
    
    # Ждем подключения к базе данных
    logger.info("⏳ Ожидание подключения к базе данных...")
    while not check_database_connection():
        logger.info("⏳ База данных недоступна, ждем 5 секунд...")
        time.sleep(5)
    
    logger.info("🔄 Начинается цикл проверки каждые 10 секунд...")
    
    # Основной цикл
    while True:
        try:
            start_time = time.time()
            
            # Проверяем и обновляем платежи
            updated = await process_pending_payments()
            
            # Показываем время выполнения
            execution_time = time.time() - start_time
            logger.info(f"⏱️ Цикл выполнен за {execution_time:.2f} сек. Следующая проверка через 10 сек.")
            
            # Ждем 10 секунд до следующей проверки
            await asyncio.sleep(10)
            
        except KeyboardInterrupt:
            logger.info("🛑 Получен сигнал остановки")
            break
        except Exception as e:
            logger.error(f"❌ Неожиданная ошибка в главном цикле: {str(e)}")
            logger.info("⏳ Ждем 10 секунд перед продолжением...")
            await asyncio.sleep(10)
    
    logger.info("👋 Автоматическая проверка платежей остановлена")

if __name__ == "__main__":
    asyncio.run(main())