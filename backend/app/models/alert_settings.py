from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base

class AlertSettings(Base):
    __tablename__ = "alert_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Основные настройки
    alerts_enabled = Column(Boolean, default=True)
    
    # Новое поле для хранения тиров алертов в JSON формате
    tiers = Column(JSON, nullable=True)
    
    # Общие настройки
    show_anonymous = Column(Boolean, default=True)
    banned_words = Column(Text, nullable=True)
    min_display_time = Column(Integer, default=2)
    max_display_time = Column(Integer, default=15)
    
    # Старые поля (для обратной совместимости)
    min_amount_for_alert = Column(Float, default=10.0)
    sound_enabled = Column(Boolean, default=True)
    sound_volume = Column(Float, default=0.5)
    sound_file_url = Column(String, nullable=True)
    visual_enabled = Column(Boolean, default=True)
    alert_duration = Column(Integer, default=5)
    text_color = Column(String, default="#FFFFFF")
    background_color = Column(String, default="#1F2937")
    font_size = Column(Integer, default=24)
    donation_text_template = Column(Text, default="{donor_name} задонатил {amount}! Сообщение: {message}")
    anonymous_text_template = Column(Text, default="Анонимный донат {amount}! Сообщение: {message}")
    
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    # Связи
    user = relationship("User", back_populates="alert_settings") 