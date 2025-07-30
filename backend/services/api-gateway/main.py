from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import asyncio
import sys
import os

sys.path.append('/app/shared')
sys.path.append('/app')

from shared.rabbitmq import RabbitMQClient, EventPublisher
from shared.events import EventType
from app.core.config import settings
from app.core.deps import get_current_active_user
from routers import donations, payments, auth, websocket, streamers, users

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")

class APIGateway:
    def __init__(self):
        self.rabbitmq_client = RabbitMQClient(RABBITMQ_URL)
        self.event_publisher = EventPublisher(self.rabbitmq_client)
    
    async def startup(self):
        """Инициализация подключений при запуске"""
        await self.rabbitmq_client.connect()
        await self.event_publisher.init()
    
    async def shutdown(self):
        """Закрытие подключений при завершении"""
        await self.rabbitmq_client.disconnect()

api_gateway = APIGateway()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Запуск
    await api_gateway.startup()
    yield
    # Завершение
    await api_gateway.shutdown()

app = FastAPI(
    title="СтримКэш РФ - API Gateway",
    description="Центральный API для платформы приёма донатов",
    version="2.0.0",
    openapi_url=None,
    docs_url=None,
    redoc_url=None,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="/app/static"), name="static")

# Внедряем зависимости в роутеры
donations.setup_dependencies(api_gateway)
payments.setup_dependencies(api_gateway) 
auth.setup_dependencies(api_gateway)
websocket.setup_dependencies(api_gateway)
streamers.setup_dependencies(api_gateway)
users.setup_dependencies(api_gateway)

# Подключаем роутеры
app.include_router(donations.router, prefix="/api/v1/donations", tags=["donations"])
app.include_router(payments.router, prefix="/api/v1/payments", tags=["payments"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(websocket.router, prefix="/api/v1/ws", tags=["websocket"])
app.include_router(streamers.router, prefix="/api/v1/streamers", tags=["streamers"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])

@app.get("/")
async def root():
    return {"message": "СтримКэш РФ API Gateway", "version": "2.0.0"}

@app.get("/health")
async def health():
    return {
        "status": "healthy", 
        "services": {
            "rabbitmq": "connected" if api_gateway.rabbitmq_client.connection else "disconnected"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )