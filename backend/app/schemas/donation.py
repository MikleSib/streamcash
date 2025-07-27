from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.donation import DonationStatus, PaymentMethod

class DonationBase(BaseModel):
    amount: float
    message: Optional[str] = None
    donor_name: Optional[str] = None
    donor_email: Optional[EmailStr] = None
    is_anonymous: bool = False
    is_public: bool = True

class DonationCreate(DonationBase):
    recipient_id: int
    payment_method: PaymentMethod

class DonationUpdate(BaseModel):
    message: Optional[str] = None
    is_public: Optional[bool] = None

class DonationInDBBase(DonationBase):
    id: int
    donor_id: Optional[int]
    recipient_id: int
    streamer_id: int
    payment_method: PaymentMethod
    payment_id: Optional[str]
    payment_url: Optional[str]
    status: DonationStatus
    is_alert_shown: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Donation(DonationInDBBase):
    pass

class DonationWithDetails(Donation):
    recipient_username: Optional[str] = None
    donor_username: Optional[str] = None

class DonationStats(BaseModel):
    total_amount: float
    total_count: int
    today_amount: float
    today_count: int
    this_month_amount: float
    this_month_count: int 