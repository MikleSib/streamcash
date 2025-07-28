import json
from typing import List, Dict, Optional
from fastapi import WebSocket
from sqlalchemy.orm import Session
import asyncio

from app import crud

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, streamer_id: int):
        await websocket.accept()
        if streamer_id not in self.active_connections:
            self.active_connections[streamer_id] = []
        self.active_connections[streamer_id].append(websocket)
        print(f"WebSocket connected for streamer {streamer_id}. Total connections: {len(self.active_connections[streamer_id])}")

    def disconnect(self, websocket: WebSocket, streamer_id: int):
        print(f"Disconnecting WebSocket for streamer_id: {streamer_id}")
        if streamer_id in self.active_connections:
            if websocket in self.active_connections[streamer_id]:
                self.active_connections[streamer_id].remove(websocket)
                print(f"WebSocket removed from streamer {streamer_id}")
            if not self.active_connections[streamer_id]:
                del self.active_connections[streamer_id]
                print(f"All connections removed for streamer {streamer_id}")
        else:
            print(f"No active connections found for streamer {streamer_id}")

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast_to_streamer(self, message: str, streamer_id: int):
        print(f"Broadcasting to streamer {streamer_id}: {message}")
        print(f"Active connections for streamer {streamer_id}: {len(self.active_connections.get(streamer_id, []))}")
        
        if streamer_id in self.active_connections:
            disconnected = []
            for connection in self.active_connections[streamer_id]:
                try:
                    await connection.send_text(message)
                    print(f"Message sent successfully to connection")
                except Exception as e:
                    print(f"Failed to send message: {e}")
                    disconnected.append(connection)
            
            for connection in disconnected:
                self.disconnect(connection, streamer_id)
        else:
            print(f"No active connections for streamer {streamer_id}")

manager = ConnectionManager()

async def notify_new_donation(donation_data: dict, streamer_id: int, db: Session):
    """Отправить уведомление о новом донате с подходящим тиром алерта"""
    
    print(f"WebSocket notification: streamer_id={streamer_id}, donation_data={donation_data}")
    
    # Получаем стримера
    streamer = crud.streamer.get(db, id=streamer_id)
    if not streamer:
        print(f"Streamer not found: streamer_id={streamer_id}")
        return
    
    # Получаем подходящий тир для суммы доната
    amount = float(donation_data.get("amount", 0))
    tier = crud.alert_settings.get_tier_for_amount(
        db=db, 
        user_id=streamer.user_id, 
        amount=amount
    )
    
    # Формируем сообщение
    message_data = {
        "type": "donation",
        "donation": {
            "donor_name": donation_data.get("donor_name"),
            "amount": donation_data.get("amount"),
            "message": donation_data.get("message", ""),
            "currency": "₽",
            "is_anonymous": donation_data.get("is_anonymous", False)
        }
    }
    
    # Добавляем информацию о тире, если он найден
    if tier:
        message_data["tier"] = tier
        print(f"Sending tier with elements: {tier.get('id')} - elements: {bool(tier.get('elements'))}")
        
        # Форматируем текст сообщения согласно шаблону тира
        if tier.get("text_template"):
            formatted_text = tier["text_template"].format(
                donor_name=donation_data.get("donor_name", "Аноним"),
                amount=donation_data.get("amount", 0),
                message=donation_data.get("message", "")
            )
            message_data["donation"]["formatted_text"] = formatted_text
    
    message = json.dumps(message_data)
    await manager.broadcast_to_streamer(message, streamer_id)

async def notify_settings_update(settings, streamer_id: int):
    """Отправить обновленные настройки алертов в виджет"""
    
    print(f"Sending settings update to streamer {streamer_id}")
    
    # Формируем сообщение с обновленными настройками
    message_data = {
        "type": "settings_update",
        "settings": {
            "enabled": settings.alerts_enabled,
            "tiers": settings.tiers or []
        }
    }
    
    message = json.dumps(message_data)
    await manager.broadcast_to_streamer(message, streamer_id)

async def notify_new_donation_with_tier(donation_data: dict, tier_data: dict, streamer_id: int):
    """Отправить уведомление о новом донате с конкретным тиром (для предпросмотра)"""
    
    print(f"WebSocket notification with tier: streamer_id={streamer_id}, donation_data={donation_data}")
    
    # Формируем сообщение
    message_data = {
        "type": "donation",
        "donation": {
            "donor_name": donation_data.get("donor_name"),
            "amount": donation_data.get("amount"),
            "message": donation_data.get("message", ""),
            "currency": "₽",
            "is_anonymous": donation_data.get("is_anonymous", False)
        },
        "tier": tier_data  # Используем переданный тир напрямую
    }
    
    print(f"Sending tier with elements: {tier_data.get('id')} - elements: {bool(tier_data.get('elements'))}")
    
    message = json.dumps(message_data)
    await manager.broadcast_to_streamer(message, streamer_id)