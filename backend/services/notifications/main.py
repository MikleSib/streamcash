import asyncio
import logging
import sys
import os
import json
from contextlib import asynccontextmanager

sys.path.append('/app/shared')
sys.path.append('/app')

from shared.rabbitmq import RabbitMQClient
from shared.events import EventType
from shared.database import SessionLocal
from app import crud
from app.services.websocket_service import notify_new_donation

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")

class NotificationsService:
    def __init__(self):
        self.rabbitmq_client = RabbitMQClient(RABBITMQ_URL)
        self.running = False
    
    async def start(self):
        """Запуск сервиса"""
        await self.rabbitmq_client.connect()
        
        # Объявляем очереди
        await self.rabbitmq_client.declare_queue("notifications.events")
        
        # Подписываемся на события
        await self.rabbitmq_client.consume_messages(
            "notifications.events",
            self.handle_event
        )
        
        self.running = True
        logger.info("🔔 Notifications Service запущен")
    
    async def stop(self):
        """Остановка сервиса"""
        self.running = False
        await self.rabbitmq_client.disconnect()
        logger.info("👋 Notifications Service остановлен")
    
    async def handle_event(self, event_data: dict):
        """Обработка входящих событий"""
        event_type = event_data.get("event_type")
        data = event_data.get("data", {})
        
        logger.info(f"📨 Получено событие: {event_type}")
        
        try:
            if event_type == EventType.NOTIFICATION_SEND:
                await self.handle_notification_send(data)
            else:
                logger.warning(f"⚠️ Неизвестный тип события: {event_type}")
        
        except Exception as e:
            logger.error(f"❌ Ошибка обработки события {event_type}: {e}")
    
    async def handle_notification_send(self, data: dict):
        """Отправка уведомления стримеру"""
        db = SessionLocal()
        try:
            streamer_id = data.get("streamer_id")
            notification_type = data.get("notification_type")
            notification_data = data.get("data", {})
            
            if notification_type == "donation":
                # Отправляем WebSocket уведомление о донате
                await notify_new_donation(notification_data, streamer_id, db)
                logger.info(f"✅ Отправлено уведомление стримеру {streamer_id}")
                
                # Помечаем донат как показанный (если есть donation_id)
                donation_id = data.get("donation_id")
                if donation_id:
                    donation = crud.donation.get(db, id=donation_id)
                    if donation:
                        crud.donation.update(
                            db, 
                            db_obj=donation, 
                            obj_in={"is_alert_shown": True}
                        )
            
        except Exception as e:
            logger.error(f"❌ Ошибка отправки уведомления: {e}")
        finally:
            db.close()

async def main():
    """Главная функция сервиса"""
    service = NotificationsService()
    
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