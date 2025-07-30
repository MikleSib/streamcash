from enum import Enum
from typing import Dict, Any, Optional
from pydantic import BaseModel
from datetime import datetime

class EventType(str, Enum):
    # События донатов
    DONATION_CREATED = "donation.created"
    DONATION_UPDATED = "donation.updated"
    DONATION_COMPLETED = "donation.completed"
    DONATION_FAILED = "donation.failed"
    
    # События платежей
    PAYMENT_CREATED = "payment.created"
    PAYMENT_COMPLETED = "payment.completed"
    PAYMENT_FAILED = "payment.failed"
    
    # События уведомлений
    NOTIFICATION_SEND = "notification.send"
    NOTIFICATION_SENT = "notification.sent"
    NOTIFICATION_FAILED = "notification.failed"
    
    # События стримеров
    STREAMER_STATS_UPDATE = "streamer.stats.update"

class BaseEvent(BaseModel):
    event_type: EventType
    timestamp: datetime
    service_name: str
    correlation_id: Optional[str] = None
    data: Dict[str, Any]

class DonationCreatedEvent(BaseModel):
    donation_id: int
    donor_name: Optional[str]
    recipient_id: int
    streamer_id: int
    amount: float
    message: Optional[str]
    payment_method: str
    is_anonymous: bool = False

class DonationCompletedEvent(BaseModel):
    donation_id: int
    donor_name: Optional[str]
    streamer_id: int
    amount: float
    message: Optional[str]
    is_anonymous: bool = False

class PaymentCreatedEvent(BaseModel):
    payment_id: str
    donation_id: int
    amount: float
    payment_method: str
    payment_url: str

class PaymentCompletedEvent(BaseModel):
    payment_id: str
    donation_id: int
    status: str

class NotificationSendEvent(BaseModel):
    streamer_id: int
    notification_type: str
    data: Dict[str, Any]

class StreamerStatsUpdateEvent(BaseModel):
    streamer_id: int
    amount: float
    action: str  # "add" или "subtract" 

def create_event(event_type: EventType, service_name: str, data: Dict[str, Any], correlation_id: Optional[str] = None) -> BaseEvent:
    """Создание события"""
    return BaseEvent(
        event_type=event_type,
        timestamp=datetime.utcnow(),
        service_name=service_name,
        correlation_id=correlation_id,
        data=data
    )