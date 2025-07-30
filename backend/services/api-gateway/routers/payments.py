from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import uuid

import sys
sys.path.append('/app')

from app import models
from app.core import deps
from app.models.donation import PaymentMethod
from shared.events import EventType, PaymentCreatedEvent
from shared.database import get_db

router = APIRouter()
api_gateway = None

def setup_dependencies(gateway):
    global api_gateway
    api_gateway = gateway

class PaymentInitRequest(BaseModel):
    amount: float
    order_id: str
    payment_method: str
    description: str = "Донат"
    streamer_id: int

@router.post("/init")
async def init_payment(
    request: PaymentInitRequest,
    db: Session = Depends(get_db),
) -> Any:
    """Инициализация платежа через микросервис payments"""
    
    correlation_id = str(uuid.uuid4())
    
    # Определяем метод платежа
    payment_method = PaymentMethod.TBANK if request.payment_method == 'tbank' else PaymentMethod.TEST
    
    # Отправляем событие создания платежа
    event_data = PaymentCreatedEvent(
        payment_id=correlation_id,
        donation_id=0,  # Будет установлен в микросервисе
        amount=request.amount,
        payment_method=payment_method.value,
        payment_url=""
    ).dict()
    
    await api_gateway.event_publisher.publish_event(
        EventType.PAYMENT_CREATED,
        event_data
    )
    
    return {
        "success": True,
        "payment_id": correlation_id,
        "status": "processing",
        "message": "Платеж обрабатывается микросервисом"
    }

@router.post("/tbank/init")
async def init_tbank_payment(
    request: PaymentInitRequest,
    db: Session = Depends(get_db),
) -> Any:
    """Создание платежа T-Bank через микросервис"""
    
    correlation_id = str(uuid.uuid4())
    
    event_data = PaymentCreatedEvent(
        payment_id=correlation_id,
        donation_id=0,
        amount=request.amount,
        payment_method=PaymentMethod.TBANK.value,
        payment_url=""
    ).dict()
    
    await api_gateway.event_publisher.publish_event(
        EventType.PAYMENT_CREATED,
        event_data
    )
    
    return {
        "success": True,
        "payment_id": correlation_id,
        "status": "processing",
        "message": "T-Bank платеж обрабатывается микросервисом"
    }