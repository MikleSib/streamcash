from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
import logging

import sys
sys.path.append('/app')

from app import models
from app.core import deps
from shared.database import get_db

router = APIRouter()
api_gateway = None
logger = logging.getLogger(__name__)

def setup_dependencies(gateway):
    global api_gateway
    api_gateway = gateway

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, streamer_id: int):
        await websocket.accept()
        if streamer_id not in self.active_connections:
            self.active_connections[streamer_id] = []
        self.active_connections[streamer_id].append(websocket)
        logger.info(f"WebSocket подключен для стримера {streamer_id}")

    def disconnect(self, websocket: WebSocket, streamer_id: int):
        if streamer_id in self.active_connections:
            self.active_connections[streamer_id].remove(websocket)
            if not self.active_connections[streamer_id]:
                del self.active_connections[streamer_id]
        logger.info(f"WebSocket отключен для стримера {streamer_id}")

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast_to_streamer(self, message: str, streamer_id: int):
        if streamer_id in self.active_connections:
            for connection in self.active_connections[streamer_id]:
                try:
                    await connection.send_text(message)
                except:
                    pass

manager = ConnectionManager()

@router.websocket("/streamer/{streamer_id}")
async def websocket_endpoint(
    websocket: WebSocket, 
    streamer_id: int,
    db: Session = Depends(get_db)
):
    """WebSocket подключение для стримера"""
    await manager.connect(websocket, streamer_id)
    try:
        while True:
            data = await websocket.receive_text()
            logger.info(f"Получено сообщение от стримера {streamer_id}: {data}")
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, streamer_id)
        logger.info(f"Стример {streamer_id} отключился")

@router.get("/connections")
async def get_connections():
    """Информация о подключениях (для отладки)"""
    return {
        "active_connections": {
            streamer_id: len(connections) 
            for streamer_id, connections in manager.active_connections.items()
        }
    }