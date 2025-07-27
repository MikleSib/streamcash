from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
import json

from app.crud.base import CRUDBase
from app.models.alert_settings import AlertSettings
from app.schemas.alert_settings import AlertSettingsCreate, AlertSettingsUpdate, AlertTier

def create_default_tier() -> Dict[str, Any]:
    """Создать базовый тир алерта для нового пользователя"""
    return {
        "id": "default",
        "name": "Базовый алерт",
        "min_amount": 1,
        "max_amount": None,
        "sound_enabled": True,
        "sound_volume": 0.5,
        "visual_enabled": True,
        "alert_duration": 5,
        "text_color": "#FFFFFF",
        "background_color": "#7C3AED",
        "font_size": 24,
        "animation_enabled": True,
        "animation_type": "sparkles",
        "text_template": "🎉 {donor_name} донатит {amount}₽! {message}",
        "screen_shake": False,
        "icon": "Star",
        "color": "purple"
    }

class CRUDAlertSettings(CRUDBase[AlertSettings, AlertSettingsCreate, AlertSettingsUpdate]):
    def get_by_user_id(self, db: Session, *, user_id: int) -> Optional[AlertSettings]:
        return db.query(AlertSettings).filter(AlertSettings.user_id == user_id).first()

    def create_for_user(self, db: Session, *, obj_in: AlertSettingsCreate, user_id: int) -> AlertSettings:
        obj_data = obj_in.dict()
        
        # Если тиры не указаны, создаем базовый
        if not obj_data.get("tiers"):
            obj_data["tiers"] = [create_default_tier()]
            
        db_obj = AlertSettings(
            user_id=user_id,
            **obj_data
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def create_default_for_new_user(self, db: Session, *, user_id: int) -> AlertSettings:
        """Создать дефолтные настройки алертов для нового пользователя"""
        default_settings = AlertSettingsCreate(
            alerts_enabled=True,
            tiers=[create_default_tier()],
            show_anonymous=True,
            min_display_time=2,
            max_display_time=15
        )
        return self.create_for_user(db, obj_in=default_settings, user_id=user_id)

    def update_by_user_id(
        self, db: Session, *, user_id: int, obj_in: AlertSettingsUpdate
    ) -> Optional[AlertSettings]:
        db_obj = self.get_by_user_id(db, user_id=user_id)
        if db_obj:
            update_data = obj_in.dict(exclude_unset=True)
            
            # Обрабатываем тиры как JSON
            if "tiers" in update_data and update_data["tiers"]:
                # Конвертируем Pydantic модели в словари
                if isinstance(update_data["tiers"][0], AlertTier):
                    update_data["tiers"] = [tier.dict() for tier in update_data["tiers"]]
                    
            return super().update(db, db_obj=db_obj, obj_in=update_data)
        return None

    def get_or_create_for_user(self, db: Session, *, user_id: int) -> AlertSettings:
        """Получить настройки алертов или создать с дефолтными значениями"""
        settings = self.get_by_user_id(db, user_id=user_id)
        if not settings:
            settings = self.create_default_for_new_user(db, user_id=user_id)
        elif not settings.tiers:
            # Если настройки существуют, но тиры не настроены, добавляем базовый
            settings.tiers = [create_default_tier()]
            db.commit()
            db.refresh(settings)
        return settings
    
    def get_tier_for_amount(self, db: Session, *, user_id: int, amount: float) -> Optional[Dict[str, Any]]:
        """Получить подходящий тир для суммы доната"""
        settings = self.get_by_user_id(db, user_id=user_id)
        if not settings or not settings.tiers:
            return None
            
        # Ищем подходящий тир
        for tier in settings.tiers:
            min_amount = tier.get("min_amount", 0)
            max_amount = tier.get("max_amount")
            
            if amount >= min_amount:
                if max_amount is None or amount <= max_amount:
                    return tier
                    
        # Если не найден подходящий тир, возвращаем последний (самый высокий)
        return settings.tiers[-1] if settings.tiers else None

alert_settings = CRUDAlertSettings(AlertSettings) 