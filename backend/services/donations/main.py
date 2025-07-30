import asyncio
import logging
import sys
import os
from contextlib import asynccontextmanager

sys.path.append('/app/shared')
sys.path.append('/app')

from shared.rabbitmq import RabbitMQClient
from shared.events import EventType, DonationCreatedEvent, DonationCompletedEvent
from shared.database import SessionLocal
from app import crud, models
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")

class DonationsService:
    def __init__(self):
        self.rabbitmq_client = RabbitMQClient(RABBITMQ_URL)
        self.running = False
    
    async def start(self):
        """Запуск сервиса"""
        await self.rabbitmq_client.connect()
        
        # Объявляем очереди
        await self.rabbitmq_client.declare_queue("donations.events")
        
        # Подписываемся на события
        await self.rabbitmq_client.consume_messages(
            "donations.events",
            self.handle_event
        )
        
        self.running = True
        logger.info("🎯 Donations Service запущен")
    
    async def stop(self):
        """Остановка сервиса"""
        self.running = False
        await self.rabbitmq_client.disconnect()
        logger.info("👋 Donations Service остановлен")
    
    async def handle_event(self, event_data: dict):
        """Обработка входящих событий"""
        event_type = event_data.get("event_type")
        data = event_data.get("data", {})
        
        logger.info(f"📨 Получено событие: {event_type}")
        
        try:
            if event_type == EventType.DONATION_CREATED:
                await self.handle_donation_created(data)
            elif event_type == EventType.PAYMENT_COMPLETED:
                await self.handle_payment_completed(data)
            else:
                logger.warning(f"⚠️ Неизвестный тип события: {event_type}")
        
        except Exception as e:
            logger.error(f"❌ Ошибка обработки события {event_type}: {e}")
    
    async def handle_donation_created(self, data: dict):
        """Обработка создания доната"""
        db = SessionLocal()
        try:
            # Создаем донат в базе данных
            donation_data = {
                "donor_name": data.get("donor_name"),
                "recipient_id": data.get("recipient_id"),
                "streamer_id": data.get("streamer_id"),
                "amount": data.get("amount"),
                "message": data.get("message"),
                "payment_method": data.get("payment_method"),
                "is_anonymous": data.get("is_anonymous", False),
                "status": "PENDING"
            }
            
            donation = crud.donation.create(db, obj_in=donation_data)
            logger.info(f"✅ Создан донат ID: {donation.id}")
            
            # Отправляем событие для создания платежа
            await self.rabbitmq_client.publish_message(
                "",
                "payments.events",
                {
                    "event_type": EventType.PAYMENT_CREATED,
                    "data": {
                        "donation_id": donation.id,
                        "amount": donation.amount,
                        "payment_method": donation.payment_method.value,
                        "description": f"Донат для стримера"
                    }
                }
            )
            
        except Exception as e:
            logger.error(f"❌ Ошибка создания доната: {e}")
        finally:
            db.close()
    
    async def handle_payment_completed(self, data: dict):
        """Обработка завершения платежа"""
        db = SessionLocal()
        try:
            donation_id = data.get("donation_id")
            if not donation_id:
                return
            
            # Обновляем статус доната
            donation = crud.donation.get(db, id=donation_id)
            if donation:
                updated_donation = crud.donation.update(
                    db, 
                    db_obj=donation, 
                    obj_in={"status": "COMPLETED"}
                )
                
                logger.info(f"✅ Донат {donation_id} помечен как завершенный")
                
                # Отправляем событие для уведомления
                await self.rabbitmq_client.publish_message(
                    "",
                    "notifications.events",
                    {
                        "event_type": EventType.NOTIFICATION_SEND,
                        "data": {
                            "streamer_id": updated_donation.streamer_id,
                            "notification_type": "donation",
                            "data": {
                                "donor_name": updated_donation.donor_name if not updated_donation.is_anonymous else None,
                                "amount": updated_donation.amount,
                                "message": updated_donation.message or "",
                                "is_anonymous": updated_donation.is_anonymous
                            }
                        }
                    }
                )
                
                # Отправляем событие для обновления статистики стримера
                await self.rabbitmq_client.publish_message(
                    "",
                    "streamer.events",
                    {
                        "event_type": EventType.STREAMER_STATS_UPDATE,
                        "data": {
                            "streamer_id": updated_donation.streamer_id,
                            "amount": updated_donation.amount,
                            "action": "add"
                        }
                    }
                )
        
        except Exception as e:
            logger.error(f"❌ Ошибка обработки завершения платежа: {e}")
        finally:
            db.close()

async def main():
    """Главная функция сервиса"""
    service = DonationsService()
    
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