from typing import Any, List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import asyncio
import uuid

import sys
sys.path.append('/app')

from app import models, schemas
from app.core import deps
from shared.events import EventType, DonationCreatedEvent
from shared.database import get_db

router = APIRouter()
api_gateway = None

def setup_dependencies(gateway):
    global api_gateway
    api_gateway = gateway

@router.post("/", response_model=schemas.Donation)
async def create_donation(
    *,
    db: Session = Depends(get_db),
    donation_in: schemas.DonationCreate,
) -> Any:
    """Создание нового доната через микросервис donations"""
    
    # Отправляем событие создания доната в микросервис
    correlation_id = str(uuid.uuid4())
    
    event_data = DonationCreatedEvent(
        donation_id=0,  # Будет установлен в микросервисе
        donor_name=donation_in.donor_name,
        recipient_id=donation_in.recipient_id,
        streamer_id=donation_in.streamer_id,
        amount=donation_in.amount,
        message=donation_in.message,
        payment_method=donation_in.payment_method.value,
        is_anonymous=donation_in.is_anonymous
    ).dict()
    
    await api_gateway.event_publisher.publish_event(
        EventType.DONATION_CREATED,
        event_data
    )
    
    # В реальной архитектуре здесь был бы асинхронный ответ
    # Для упрощения возвращаем mock объект
    return {
        "id": 999,
        "correlation_id": correlation_id,
        "status": "processing",
        "message": "Донат обрабатывается микросервисом"
    }

@router.get("/", response_model=List[schemas.DonationWithDetails])
async def get_donations(
    *,
    db: Session = Depends(get_db),
    recipient_id: Optional[int] = Query(None, description="ID получателя"),
    donor_id: Optional[int] = Query(None, description="ID донатора"),
    min_amount: Optional[float] = Query(None, description="Минимальная сумма"),
    max_amount: Optional[float] = Query(None, description="Максимальная сумма"),
    date_from: Optional[datetime] = Query(None, description="Дата начала периода"),
    date_to: Optional[datetime] = Query(None, description="Дата окончания периода"),
    status: Optional[str] = Query(None, description="Статус донатов"),
    is_anonymous: Optional[bool] = Query(None, description="Только анонимные/не анонимные"),
    skip: int = Query(0, ge=0, description="Количество пропущенных записей"),
    limit: int = Query(100, ge=1, le=1000, description="Максимальное количество записей"),
    order_by: str = Query("created_at", description="Поле для сортировки"),
    order_direction: str = Query("desc", description="Направление сортировки (asc/desc)"),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Получение списка донатов через микросервис donations"""
    
    # Временно используем прямой доступ к БД, 
    # в полной архитектуре это был бы запрос к микросервису
    from app import crud
    from sqlalchemy import desc, asc, and_, or_
    
    query = db.query(models.Donation)
    
    if recipient_id:
        query = query.filter(models.Donation.recipient_id == recipient_id)
    
    if donor_id:
        query = query.filter(models.Donation.donor_id == donor_id)
    
    if min_amount:
        query = query.filter(models.Donation.amount >= min_amount)
    
    if max_amount:
        query = query.filter(models.Donation.amount <= max_amount)
    
    if date_from:
        query = query.filter(models.Donation.created_at >= date_from)
    
    if date_to:
        query = query.filter(models.Donation.created_at <= date_to)
    
    if status:
        query = query.filter(models.Donation.status == status)
    
    if is_anonymous is not None:
        query = query.filter(models.Donation.is_anonymous == is_anonymous)
    
    # Сортировка
    if hasattr(models.Donation, order_by):
        order_attr = getattr(models.Donation, order_by)
        if order_direction.lower() == "desc":
            query = query.order_by(desc(order_attr))
        else:
            query = query.order_by(asc(order_attr))
    
    donations = query.offset(skip).limit(limit).all()
    return donations

@router.get("/{donation_id}", response_model=schemas.DonationWithDetails)
async def get_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Получение доната по ID"""
    from app import crud
    
    donation = crud.donation.get(db, id=donation_id)
    if not donation:
        raise HTTPException(status_code=404, detail="Донат не найден")
    
    return donation