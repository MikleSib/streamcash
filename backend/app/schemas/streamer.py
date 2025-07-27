from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class StreamerBase(BaseModel):
    display_name: str
    stream_title: Optional[str] = None
    stream_description: Optional[str] = None
    donation_goal: float = 0.0
    min_donation_amount: float = 10.0
    max_donation_amount: float = 10000.0
    donation_url: Optional[str] = None

class StreamerCreate(StreamerBase):
    user_id: int

class StreamerUpdate(BaseModel):
    display_name: Optional[str] = None
    stream_title: Optional[str] = None
    stream_description: Optional[str] = None
    donation_goal: Optional[float] = None
    min_donation_amount: Optional[float] = None
    max_donation_amount: Optional[float] = None
    widget_settings: Optional[str] = None
    alert_settings: Optional[str] = None
    payment_settings: Optional[str] = None

class StreamerInDBBase(StreamerBase):
    id: int
    user_id: int
    current_donations: float
    widget_settings: Optional[str]
    alert_settings: Optional[str]
    payment_settings: Optional[str]
    is_verified: bool
    is_featured: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Streamer(StreamerInDBBase):
    pass

class StreamerWithUser(Streamer):
    username: Optional[str] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None 