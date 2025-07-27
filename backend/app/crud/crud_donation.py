from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_, func, extract
from datetime import datetime, date
from fastapi import HTTPException

from app.crud.base import CRUDBase
from app.models.donation import Donation, DonationStatus
from app.models.streamer import Streamer
from app.schemas.donation import DonationCreate, DonationUpdate

class CRUDDonation(CRUDBase[Donation, DonationCreate, DonationUpdate]):
    def create(self, db: Session, *, obj_in: DonationCreate) -> Donation:
        streamer = db.query(Streamer).filter(Streamer.user_id == obj_in.recipient_id).first()
        if not streamer:
            raise HTTPException(status_code=404, detail="Streamer not found")
        
        obj_in_data = obj_in.dict()
        obj_in_data["streamer_id"] = streamer.id
        
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    def get_by_recipient(
        self, 
        db: Session, 
        *, 
        recipient_id: int, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[Donation]:
        return (
            db.query(self.model)
            .filter(self.model.recipient_id == recipient_id)
            .filter(self.model.status == DonationStatus.COMPLETED)
            .filter(self.model.is_public == True)
            .order_by(self.model.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_donor(
        self, 
        db: Session, 
        *, 
        donor_id: int, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[Donation]:
        return (
            db.query(self.model)
            .filter(self.model.donor_id == donor_id)
            .order_by(self.model.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_stats_by_user_id(self, db: Session, *, user_id: int) -> dict:
        return self.get_stats(db, recipient_id=user_id)

    def get_stats(self, db: Session, *, recipient_id: int) -> dict:
        today = date.today()
        
        total_query = (
            db.query(
                func.coalesce(func.sum(self.model.amount), 0).label("total_amount"),
                func.count(self.model.id).label("total_count")
            )
            .filter(self.model.recipient_id == recipient_id)
            .filter(self.model.status == DonationStatus.COMPLETED)
        ).first()

        today_query = (
            db.query(
                func.coalesce(func.sum(self.model.amount), 0).label("today_amount"),
                func.count(self.model.id).label("today_count")
            )
            .filter(self.model.recipient_id == recipient_id)
            .filter(self.model.status == DonationStatus.COMPLETED)
            .filter(func.date(self.model.created_at) == today)
        ).first()

        month_query = (
            db.query(
                func.coalesce(func.sum(self.model.amount), 0).label("month_amount"),
                func.count(self.model.id).label("month_count")
            )
            .filter(self.model.recipient_id == recipient_id)
            .filter(self.model.status == DonationStatus.COMPLETED)
            .filter(extract('year', self.model.created_at) == today.year)
            .filter(extract('month', self.model.created_at) == today.month)
        ).first()

        return {
            "total_amount": float(total_query.total_amount),
            "total_count": total_query.total_count,
            "today_amount": float(today_query.today_amount),
            "today_count": today_query.today_count,
            "this_month_amount": float(month_query.month_amount),
            "this_month_count": month_query.month_count,
        }

    def get_by_payment_id(self, db: Session, *, payment_id: str) -> Optional[Donation]:
        return db.query(self.model).filter(self.model.payment_id == payment_id).first()

donation = CRUDDonation(Donation) 