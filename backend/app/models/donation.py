from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Float, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base

class DonationStatus(enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"

class PaymentMethod(enum.Enum):
    TEST = "test"
    YOOKASSA = "yookassa"
    SBERBANK = "sberbank"
    TINKOFF = "tinkoff"
    CARD = "card"

class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)
    donor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    streamer_id = Column(Integer, ForeignKey("streamers.id"), nullable=False)
    
    amount = Column(Float, nullable=False)
    message = Column(Text)
    donor_name = Column(String)
    donor_email = Column(String)
    
    payment_method = Column(Enum(PaymentMethod), nullable=False)
    payment_id = Column(String, unique=True)
    payment_url = Column(String)
    
    status = Column(Enum(DonationStatus), default=DonationStatus.PENDING)
    
    is_anonymous = Column(Boolean, default=False)
    is_public = Column(Boolean, default=True)
    is_alert_shown = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    donor = relationship("User", back_populates="sent_donations", foreign_keys=[donor_id])
    recipient = relationship("User", back_populates="received_donations", foreign_keys=[recipient_id])
    recipient_streamer = relationship("Streamer", back_populates="donations") 