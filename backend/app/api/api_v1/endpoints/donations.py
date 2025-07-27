from typing import Any, List, Optional
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc, and_, or_

from app import crud, models, schemas
from app.core import deps
from app.services.payment_service import PaymentService
from app.services.websocket_service import notify_new_donation

router = APIRouter()

@router.post("/", response_model=schemas.Donation)
async def create_donation(
    *,
    db: Session = Depends(deps.get_db),
    donation_in: schemas.DonationCreate,
) -> Any:
    donation = crud.donation.create(db=db, obj_in=donation_in)
    
    payment_service = PaymentService()
    try:
        payment_data = await payment_service.create_payment(
            amount=donation.amount,
            description=f"Донат для {donation.recipient.username if hasattr(donation, 'recipient') else 'стримера'}",
            payment_method=donation.payment_method
        )
        
        donation = crud.donation.update(
            db=db,
            db_obj=donation,
            obj_in={
                "payment_id": payment_data["id"],
                "payment_url": payment_data["confirmation_url"]
            }
        )
        
    except Exception as e:
        crud.donation.remove(db=db, id=donation.id)
        raise HTTPException(status_code=400, detail=f"Payment creation failed: {str(e)}")
    
    return donation

@router.get("/", response_model=List[schemas.DonationWithDetails])
def get_donations(
    *,
    db: Session = Depends(deps.get_db),
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
    """
    Получить список донатов с фильтрами и пагинацией
    """
    query = db.query(models.Donation)
    
    # Фильтры
    filters = []
    
    if recipient_id is not None:
        filters.append(models.Donation.recipient_id == recipient_id)
    
    if donor_id is not None:
        filters.append(models.Donation.donor_id == donor_id)
    
    if min_amount is not None:
        filters.append(models.Donation.amount >= min_amount)
    
    if max_amount is not None:
        filters.append(models.Donation.amount <= max_amount)
        
    if date_from is not None:
        filters.append(models.Donation.created_at >= date_from)
        
    if date_to is not None:
        filters.append(models.Donation.created_at <= date_to)
        
    if status is not None:
        filters.append(models.Donation.status == status)
        
    if is_anonymous is not None:
        filters.append(models.Donation.is_anonymous == is_anonymous)
    
    # Применяем фильтры
    if filters:
        query = query.filter(and_(*filters))
    
    # Сортировка
    order_column = getattr(models.Donation, order_by, models.Donation.created_at)
    if order_direction.lower() == "desc":
        query = query.order_by(desc(order_column))
    else:
        query = query.order_by(asc(order_column))
    
    # Пагинация
    donations = query.offset(skip).limit(limit).all()
    
    return donations

@router.get("/my", response_model=List[schemas.DonationWithDetails])
def get_my_donations(
    *,
    db: Session = Depends(deps.get_db),
    as_donor: bool = Query(False, description="Получить донаты, которые я отправил"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Получить мои донаты (отправленные или полученные)
    """
    if as_donor:
        # Донаты, которые отправил пользователь
        donations = (
            db.query(models.Donation)
            .filter(models.Donation.donor_id == current_user.id)
            .order_by(desc(models.Donation.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )
    else:
        # Донаты, которые получил пользователь
        donations = (
            db.query(models.Donation)
            .filter(models.Donation.recipient_id == current_user.id)
            .order_by(desc(models.Donation.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    return donations

@router.get("/stats/{user_id}", response_model=schemas.DonationStats)
def get_donation_stats(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    stats = crud.donation.get_stats_by_user_id(db=db, user_id=user_id)
    return stats

@router.get("/{donation_id}", response_model=schemas.DonationWithDetails)
def get_donation(
    *,
    db: Session = Depends(deps.get_db),
    donation_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    donation = crud.donation.get(db=db, id=donation_id)
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    
    # Проверяем права доступа
    if donation.recipient_id != current_user.id and donation.donor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return donation 