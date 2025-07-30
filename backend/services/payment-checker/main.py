import asyncio
import logging
import sys
import os
import time
import hashlib
import httpx
from contextlib import asynccontextmanager

sys.path.append('/app/shared')
sys.path.append('/app')

from shared.rabbitmq import RabbitMQClient
from shared.events import EventType
from shared.database import SessionLocal
from app import crud
from app.core.config import settings
from app.models.donation import DonationStatus, PaymentMethod, Donation

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")
CHECK_INTERVAL = int(os.getenv("PAYMENT_CHECK_INTERVAL", "10"))

class PaymentCheckerService:
    def __init__(self):
        self.rabbitmq_client = RabbitMQClient(RABBITMQ_URL)
        self.running = False
    
    async def start(self):
        """Запуск сервиса"""
        await self.rabbitmq_client.connect()
        self.running = True
        logger.info("🔍 Payment Checker Service запущен")
        
        # Запускаем основной цикл проверки
        asyncio.create_task(self.payment_check_loop())
    
    async def stop(self):
        """Остановка сервиса"""
        self.running = False
        await self.rabbitmq_client.disconnect()
        logger.info("👋 Payment Checker Service остановлен")
    
    async def payment_check_loop(self):
        """Основной цикл проверки платежей"""
        while self.running:
            try:
                start_time = time.time()
                
                updated_count = await self.process_pending_payments()
                
                execution_time = time.time() - start_time
                logger.info(f"⏱️ Цикл выполнен за {execution_time:.2f} сек. Обновлено: {updated_count}")
                
                await asyncio.sleep(CHECK_INTERVAL)
                
            except Exception as e:
                logger.error(f"❌ Ошибка в цикле проверки: {e}")
                await asyncio.sleep(CHECK_INTERVAL)
    
    async def process_pending_payments(self):
        """Обработка всех PENDING платежей"""
        db = SessionLocal()
        updated_count = 0
        
        try:
            # Получаем все PENDING платежи T-Bank
            pending_donations = db.query(Donation).filter(
                Donation.status == DonationStatus.PENDING,
                Donation.payment_method == PaymentMethod.TBANK,
                Donation.payment_id.is_not(None)
            ).all()
            
            if not pending_donations:
                return 0
            
            logger.info(f"📊 Найдено {len(pending_donations)} PENDING платежей для проверки")
            
            for donation in pending_donations:
                try:
                    # Проверяем статус через T-Bank API
                    result = await self.check_tbank_payment_status(donation.payment_id)
                    
                    if result and result.get("success"):
                        payment_status = result.get("status")
                        
                        # Обновляем статус если платеж завершен
                        if payment_status in ["CONFIRMED", "AUTHORIZED"]:
                            logger.info(f"✅ Платеж {donation.payment_id} завершен")
                            
                            # Обновляем статус доната
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
                            
                            # Отправляем событие о завершении платежа
                            await self.rabbitmq_client.publish_message(
                                "",
                                "donations.events",
                                {
                                    "event_type": EventType.PAYMENT_COMPLETED,
                                    "data": {
                                        "donation_id": donation.id,
                                        "payment_id": donation.payment_id,
                                        "status": "COMPLETED"
                                    }
                                }
                            )
                        
                        elif payment_status in ["CANCELLED", "REVERSED", "REFUNDED"]:
                            logger.info(f"❌ Платеж {donation.payment_id} отменен")
                            donation.status = DonationStatus.FAILED
                            db.commit()
                            updated_count += 1
                
                except Exception as e:
                    logger.error(f"❌ Ошибка при обработке donation {donation.id}: {e}")
                    continue
            
            return updated_count
            
        except Exception as e:
            logger.error(f"❌ Общая ошибка при обработке платежей: {e}")
            return 0
        finally:
            db.close()
    
    async def check_tbank_payment_status(self, payment_id: str):
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
                "User-Agent": "StreamCash/2.0"
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
                
                logger.error(f"T-Bank API вернул статус {response.status_code}")
                return {"success": False, "error": f"API returned {response.status_code}"}
                
        except Exception as e:
            logger.error(f"Ошибка проверки T-Bank статуса для payment_id {payment_id}: {e}")
            return {"success": False, "error": str(e)}

async def main():
    """Главная функция сервиса"""
    service = PaymentCheckerService()
    
    try:
        await service.start()
        
        # Держим сервис запущенным
        while service.running:
            await asyncio.sleep(1)
            
    except KeyboardInterrupt:
        logger.info("🛑 Получен сигнал остановки")
    except Exception as e:
        logger.error(f"❌ Критическая ошибка: {e}")
    finally:
        await service.stop()

if __name__ == "__main__":
    asyncio.run(main())