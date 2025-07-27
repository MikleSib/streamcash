from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session

from app import crud
from app.core import deps
from app.services.websocket_service import manager

router = APIRouter()

@router.websocket("/ws/{streamer_id}")
async def websocket_endpoint(websocket: WebSocket, streamer_id: int):
    print(f"WebSocket connection attempt for streamer_id: {streamer_id}")
    print(f"WebSocket headers: {websocket.headers}")
    print(f"WebSocket query params: {websocket.query_params}")
    
    try:
        await manager.connect(websocket, streamer_id)
        print(f"WebSocket connected successfully for streamer_id: {streamer_id}")
        
        while True:
            data = await websocket.receive_text()
            print(f"Received WebSocket data from streamer {streamer_id}: {data}")
    except WebSocketDisconnect:
        print(f"WebSocket disconnected for streamer_id: {streamer_id}")
        manager.disconnect(websocket, streamer_id)
    except Exception as e:
        print(f"WebSocket error for streamer_id {streamer_id}: {e}")
        manager.disconnect(websocket, streamer_id) 