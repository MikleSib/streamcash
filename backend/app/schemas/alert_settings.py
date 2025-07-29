from pydantic import BaseModel, validator
from typing import Optional, List, Any, Dict, Union
from datetime import datetime

class AlertElement(BaseModel):
    id: str
    type: str  # 'text', 'image', 'background'
    x: float  # позиция в процентах
    y: float  # позиция в процентах
    width: Optional[float] = None  # ширина в пикселях или процентах
    height: Optional[float] = None  # высота в пикселях или процентах
    visible: bool = True
    zIndex: int = 0
    
    # Контент
    content: Optional[str] = None
    imageUrl: Optional[str] = None
    fontSize: Optional[int] = None
    color: Optional[str] = None
    backgroundColor: Optional[str] = None
    borderRadius: Optional[int] = None
    padding: Optional[int] = None

class AlertTier(BaseModel):
    id: str
    name: str
    min_amount: int
    max_amount: Optional[int] = None
    
    # Звук
    sound_enabled: bool = True
    sound_file_url: Optional[str] = None
    sound_volume: float = 0.5
    sound_start_time: float = 0.0  # Время начала в секундах
    sound_end_time: Optional[float] = None  # Время окончания в секундах (None = до конца файла)
    
    # Визуальное оформление
    visual_enabled: bool = True
    alert_duration: int = 5
    text_color: str = "#FFFFFF"
    background_color: str = "#1F2937"
    font_size: int = 24
    
    # Анимация/GIF - теперь поддерживает до 10 гифок
    animation_enabled: bool = False
    animation_type: str = "none"  # none, gif, confetti, fireworks, hearts, sparkles
    gif_urls: List[str] = []  # До 10 гиф анимаций
    
    # Старое поле для обратной совместимости
    gif_url: Optional[str] = None
    
    # Текст
    text_template: str = "{donor_name} донатит {amount}₽! {message}"
    
    # Дополнительные эффекты
    screen_shake: bool = False
    highlight_color: Optional[str] = None
    
    icon: str = "Gift"
    color: str = "purple"
    
    # Элементы макета
    elements: Optional[List[AlertElement]] = None
    
    @validator('gif_urls')
    def validate_gif_urls(cls, v):
        if len(v) > 10:
            raise ValueError('Максимум 10 гиф анимаций на уровень')
        return v
    
    def get_random_gif_url(self) -> Optional[str]:
        """Получить случайную гиф из списка"""
        if self.gif_urls:
            import random
            return random.choice(self.gif_urls)
        return self.gif_url  # Fallback для обратной совместимости

class AlertSettingsBase(BaseModel):
    alerts_enabled: bool = True
    tiers: Optional[List[AlertTier]] = None
    
    # Общие настройки
    show_anonymous: bool = True
    banned_words: Optional[str] = None
    min_display_time: int = 2
    max_display_time: int = 15
    
    # Старые поля для обратной совместимости
    min_amount_for_alert: Optional[float] = 10.0
    sound_enabled: Optional[bool] = True
    sound_volume: Optional[float] = 0.5
    sound_file_url: Optional[str] = None
    visual_enabled: Optional[bool] = True
    alert_duration: Optional[int] = 5
    text_color: Optional[str] = "#FFFFFF"
    background_color: Optional[str] = "#1F2937"
    font_size: Optional[int] = 24
    donation_text_template: Optional[str] = "{donor_name} задонатил {amount}! Сообщение: {message}"
    anonymous_text_template: Optional[str] = "Анонимный донат {amount}! Сообщение: {message}"

class AlertSettingsCreate(AlertSettingsBase):
    pass

class AlertSettingsUpdate(BaseModel):
    alerts_enabled: Optional[bool] = None
    tiers: Optional[List[AlertTier]] = None
    show_anonymous: Optional[bool] = None
    banned_words: Optional[str] = None
    min_display_time: Optional[int] = None
    max_display_time: Optional[int] = None
    
    # Старые поля
    min_amount_for_alert: Optional[float] = None
    sound_enabled: Optional[bool] = None
    sound_volume: Optional[float] = None
    sound_file_url: Optional[str] = None
    visual_enabled: Optional[bool] = None
    alert_duration: Optional[int] = None
    text_color: Optional[str] = None
    background_color: Optional[str] = None
    font_size: Optional[int] = None
    donation_text_template: Optional[str] = None
    anonymous_text_template: Optional[str] = None

class AlertSettingsInDBBase(AlertSettingsBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AlertSettings(AlertSettingsInDBBase):
    pass

class AlertSettingsInDB(AlertSettingsInDBBase):
    pass 