import asyncio
import logging
import sys
import os
from contextlib import asynccontextmanager

sys.path.append('/app/shared')
sys.path.append('/app')

from shared.rabbitmq import RabbitMQClient
from shared.events import EventType
from shared.database import SessionLocal
from app import crud
from app.services.payment_service import PaymentService
from app.models.donation import PaymentMethod

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")

class PaymentsService:
    def __init__(self):
        self.rabbitmq_client = RabbitMQClient(RABBITMQ_URL)
        self.payment_service = PaymentService()
        self.running = False
    
    async def start(self):
        """Запуск сервиса"""
        await self.rabbitmq_client.connect()
        
        # Объявляем очереди
        await self.rabbitmq_client.declare_queue("payments.events")
        
        # Подписываемся на события
        await self.rabbitmq_client.consume_messages(
            "payments.events",
            self.handle_event
        )
        
        self.running = True
        logger.info("💳 Payments Service запущен")
    
    async def stop(self):
        """Остановка сервиса"""
        self.running = False
        await self.rabbitmq_client.disconnect()
        logger.info("👋 Payments Service остановлен")
    
    async def handle_event(self, event_data: dict):
        """Обработка входящих событий"""
        event_type = event_data.get("event_type")
        data = event_data.get("data", {})
        
        logger.info(f"📨 Получено событие: {event_type}")
        
        try:
            if event_type == EventType.PAYMENT_CREATED:
                await self.handle_payment_created(data)
            else:
                logger.warning(f"⚠️ Неизвестный тип события: {event_type}")
        
        except Exception as e:
            logger.error(f"❌ Ошибка обработки события {event_type}: {e}")
    
    async def handle_payment_created(self, data: dict):
        """Обработка создания платежа"""
        db = SessionLocal()
        try:
            donation_id = data.get("donation_id")
            amount = data.get("amount")
            payment_method_str = data.get("payment_method")
            description = data.get("description", "Донат")
            
            # Определяем метод платежа
            payment_method = PaymentMethod(payment_method_str)
            
            # Создаем платеж через PaymentService
            payment_data = await self.payment_service.create_payment(
                amount=amount,
                description=description,
                payment_method=payment_method
            )
            
            # Обновляем донат с данными платежа
            donation = crud.donation.get(db, id=donation_id)
            if donation:
                updated_donation = crud.donation.update(
                    db,
                    db_obj=donation,
                    obj_in={
                        "payment_id": payment_data["id"],
                        "payment_url": payment_data["confirmation_url"]
                    }
                )
                
                logger.info(f"✅ Создан платеж {payment_data['id']} для доната {donation_id}")
            
        except Exception as e:
            logger.error(f"❌ Ошибка создания платежа: {e}")
            
            # Помечаем донат как неудачный
            if donation_id:
                try:
                    donation = crud.donation.get(db, id=donation_id)
                    if donation:
                        crud.donation.update(
                            db,
                            db_obj=donation,
                            obj_in={"status": "FAILED"}
                        )
                except:
                    pass
                    
        finally:
            db.close()

async def main():
    """Главная функция сервиса"""
    service = PaymentsService()
    
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