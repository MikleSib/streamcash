import asyncio
import json
import logging
from typing import Dict, Any, Callable, Optional
import aio_pika
from aio_pika import Message, DeliveryMode
from aio_pika.abc import AbstractRobustConnection, AbstractRobustChannel, AbstractRobustQueue

logger = logging.getLogger(__name__)

class RabbitMQClient:
    def __init__(self, rabbitmq_url: str):
        self.rabbitmq_url = rabbitmq_url
        self.connection: Optional[AbstractRobustConnection] = None
        self.channel: Optional[AbstractRobustChannel] = None
        self.queues: Dict[str, AbstractRobustQueue] = {}
        
    async def connect(self) -> None:
        """Подключение к RabbitMQ с автоматическим переподключением"""
        try:
            self.connection = await aio_pika.connect_robust(
                self.rabbitmq_url,
                heartbeat=30,
                blocked_connection_timeout=300,
                connection_attempts=5,
                retry_delay=5
            )
            self.channel = await self.connection.channel()
            await self.channel.set_qos(prefetch_count=10)
            logger.info("✅ Подключились к RabbitMQ")
        except Exception as e:
            logger.error(f"❌ Ошибка подключения к RabbitMQ: {e}")
            raise

    async def disconnect(self) -> None:
        """Отключение от RabbitMQ"""
        if self.connection and not self.connection.is_closed:
            await self.connection.close()
            logger.info("👋 Отключились от RabbitMQ")

    async def declare_queue(
        self, 
        queue_name: str, 
        durable: bool = True,
        auto_delete: bool = False
    ) -> AbstractRobustQueue:
        """Объявление очереди"""
        if not self.channel:
            raise RuntimeError("Канал RabbitMQ не инициализирован")
            
        queue = await self.channel.declare_queue(
            queue_name,
            durable=durable,
            auto_delete=auto_delete
        )
        self.queues[queue_name] = queue
        logger.info(f"📋 Объявлена очередь: {queue_name}")
        return queue

    async def declare_exchange(
        self, 
        exchange_name: str, 
        exchange_type: str = "topic"
    ) -> None:
        """Объявление exchange"""
        if not self.channel:
            raise RuntimeError("Канал RabbitMQ не инициализирован")
            
        await self.channel.declare_exchange(
            exchange_name,
            type=exchange_type,
            durable=True
        )
        logger.info(f"🔄 Объявлен exchange: {exchange_name}")

    async def bind_queue_to_exchange(
        self, 
        queue_name: str, 
        exchange_name: str, 
        routing_key: str
    ) -> None:
        """Привязка очереди к exchange"""
        if queue_name not in self.queues:
            await self.declare_queue(queue_name)
            
        await self.queues[queue_name].bind(exchange_name, routing_key)
        logger.info(f"🔗 Привязали очередь {queue_name} к exchange {exchange_name} с ключом {routing_key}")

    async def publish_message(
        self,
        exchange_name: str,
        routing_key: str,
        message_data: Dict[str, Any],
        delivery_mode: DeliveryMode = DeliveryMode.PERSISTENT
    ) -> None:
        """Публикация сообщения"""
        if not self.channel:
            raise RuntimeError("Канал RabbitMQ не инициализирован")

        message_body = json.dumps(message_data, ensure_ascii=False, default=str)
        message = Message(
            message_body.encode(),
            delivery_mode=delivery_mode,
            content_type="application/json",
            content_encoding="utf-8"
        )

        await self.channel.default_exchange.publish(
            message, routing_key=routing_key
        ) if exchange_name == "" else await self.channel.get_exchange(exchange_name).publish(
            message, routing_key=routing_key
        )
        
        logger.info(f"📤 Отправлено сообщение в {exchange_name or 'default'}:{routing_key}")

    async def consume_messages(
        self,
        queue_name: str,
        callback: Callable[[Dict[str, Any]], None],
        auto_ack: bool = False
    ) -> None:
        """Подписка на сообщения из очереди"""
        if queue_name not in self.queues:
            await self.declare_queue(queue_name)

        async def message_handler(message: aio_pika.IncomingMessage):
            async with message.process(ignore_processed=True):
                try:
                    message_data = json.loads(message.body.decode())
                    logger.info(f"📨 Получено сообщение из {queue_name}: {message_data}")
                    
                    await callback(message_data)
                    
                    if not auto_ack:
                        message.ack()
                        
                except json.JSONDecodeError as e:
                    logger.error(f"❌ Ошибка декодирования JSON: {e}")
                    message.nack(requeue=False)
                except Exception as e:
                    logger.error(f"❌ Ошибка обработки сообщения: {e}")
                    message.nack(requeue=True)

        await self.queues[queue_name].consume(message_handler, no_ack=auto_ack)
        logger.info(f"👂 Начали слушать очередь: {queue_name}")

class EventPublisher:
    """Высокоуровневый класс для публикации событий"""
    
    def __init__(self, rabbitmq_client: RabbitMQClient):
        self.client = rabbitmq_client
        self.exchange_name = "streamcash.events"
    
    async def init(self):
        """Инициализация exchange и очередей"""
        await self.client.declare_exchange(self.exchange_name, "topic")
        
        # Очереди для каждого сервиса
        queues_config = {
            "donations.events": ["donation.*"],
            "payments.events": ["payment.*"],
            "notifications.events": ["notification.*", "donation.completed"],
            "streamer.events": ["donation.completed"]
        }
        
        for queue_name, routing_keys in queues_config.items():
            await self.client.declare_queue(queue_name)
            for routing_key in routing_keys:
                await self.client.bind_queue_to_exchange(
                    queue_name, self.exchange_name, routing_key
                )
    
    async def publish_event(self, event_type: str, data: Dict[str, Any]):
        """Публикация события"""
        event_data = {
            "event_type": event_type,
            "timestamp": str(asyncio.get_event_loop().time()),
            "data": data
        }
        
        await self.client.publish_message(
            self.exchange_name,
            event_type,
            event_data
        )