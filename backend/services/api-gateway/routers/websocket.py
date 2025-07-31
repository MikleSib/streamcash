from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
import logging
import httpx
import os

router = APIRouter()
api_gateway = None
logger = logging.getLogger(__name__)

# URL основного бэкенда для WebSocket
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8001")

def setup_dependencies(gateway):
    global api_gateway
    api_gateway = gateway

@router.websocket("/ws/{streamer_id}")
async def websocket_endpoint(websocket: WebSocket, streamer_id: int):
    """WebSocket подключение для стримера - прокси к основному бэкенду"""
    logger.info(f"WebSocket connection attempt for streamer_id: {streamer_id}")
    
    try:
        # Принимаем WebSocket соединение
        await websocket.accept()
        logger.info(f"WebSocket accepted for streamer_id: {streamer_id}")
        
        # Подключаемся к основному бэкенду
        backend_ws_url = f"{BACKEND_URL.replace('http', 'ws')}/api/v1/ws/{streamer_id}"
        logger.info(f"Connecting to backend WebSocket: {backend_ws_url}")
        
        async with httpx.AsyncClient() as client:
            # Создаем WebSocket соединение с бэкендом
            async with client.websocket_connect(backend_ws_url) as backend_websocket:
                logger.info(f"Connected to backend WebSocket for streamer_id: {streamer_id}")
                
                # Проксируем сообщения между клиентом и бэкендом
                while True:
                    try:
                        # Получаем сообщение от клиента
                        client_message = await websocket.receive_text()
                        logger.info(f"Received from client: {client_message}")
                        
                        # Отправляем в бэкенд
                        await backend_websocket.send_text(client_message)
                        
                        # Получаем ответ от бэкенда
                        backend_message = await backend_websocket.receive_text()
                        logger.info(f"Received from backend: {backend_message}")
                        
                        # Отправляем клиенту
                        await websocket.send_text(backend_message)
                        
                    except WebSocketDisconnect:
                        logger.info(f"Client disconnected for streamer_id: {streamer_id}")
                        break
                    except Exception as e:
                        logger.error(f"WebSocket error for streamer_id {streamer_id}: {e}")
                        break
                        
    except Exception as e:
        logger.error(f"Failed to establish WebSocket connection for streamer_id {streamer_id}: {e}")
        try:
            await websocket.close()
        except:
            pass

@router.get("/connections")
async def get_connections():
    """Информация о подключениях (для отладки)"""
    return {
        "message": "WebSocket connections are proxied to backend",
        "backend_url": BACKEND_URL
    }