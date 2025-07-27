from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    is_streamer = Column(Boolean, default=False)
    avatar_url = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    # Связи
    streamer_profile = relationship("Streamer", back_populates="user", uselist=False)
    sent_donations = relationship("Donation", foreign_keys="Donation.donor_id", back_populates="donor")
    received_donations = relationship("Donation", foreign_keys="Donation.recipient_id", back_populates="recipient")
    alert_settings = relationship("AlertSettings", back_populates="user", uselist=False) 