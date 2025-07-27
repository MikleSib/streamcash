from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base

class Streamer(Base):
    __tablename__ = "streamers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    display_name = Column(String, nullable=False)
    stream_title = Column(String)
    stream_description = Column(Text)
    donation_goal = Column(Float, default=0.0)
    current_donations = Column(Float, default=0.0)
    min_donation_amount = Column(Float, default=10.0)
    max_donation_amount = Column(Float, default=10000.0)
    donation_url = Column(String, unique=True)
    widget_settings = Column(Text)
    alert_settings = Column(Text)
    payment_settings = Column(Text)
    is_verified = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User", back_populates="streamer_profile")
    donations = relationship("Donation", back_populates="recipient_streamer") 