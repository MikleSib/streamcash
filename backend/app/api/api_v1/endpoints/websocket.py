from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session

from app import crud
from app.core import deps
from app.services.websocket_service import manager

router = APIRouter()

@router.websocket("/ws/{streamer_id}")
async def websocket_endpoint(websocket: WebSocket, streamer_id: int):
    await manager.connect(websocket, streamer_id)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, streamer_id) 