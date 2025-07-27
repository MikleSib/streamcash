from typing import Optional
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.streamer import Streamer
from app.schemas.streamer import StreamerCreate, StreamerUpdate

class CRUDStreamer(CRUDBase[Streamer, StreamerCreate, StreamerUpdate]):
    def get_by_user_id(self, db: Session, *, user_id: int) -> Optional[Streamer]:
        return db.query(self.model).filter(self.model.user_id == user_id).first()

    def get_by_donation_url(self, db: Session, *, donation_url: str) -> Optional[Streamer]:
        return db.query(self.model).filter(self.model.donation_url == donation_url).first()

    def get_featured(self, db: Session, *, skip: int = 0, limit: int = 10):
        return (
            db.query(self.model)
            .filter(self.model.is_featured == True)
            .filter(self.model.is_verified == True)
            .order_by(self.model.current_donations.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

streamer = CRUDStreamer(Streamer) 