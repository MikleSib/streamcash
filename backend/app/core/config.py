from pydantic_settings import BaseSettings
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/donation_alerts_ru")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    YOOKASSA_SHOP_ID: Optional[str] = os.getenv("YOOKASSA_SHOP_ID")
    YOOKASSA_SECRET_KEY: Optional[str] = os.getenv("YOOKASSA_SECRET_KEY")
    
    SBERBANK_USERNAME: Optional[str] = os.getenv("SBERBANK_USERNAME")
    SBERBANK_PASSWORD: Optional[str] = os.getenv("SBERBANK_PASSWORD")
    
    TINKOFF_TERMINAL_KEY: Optional[str] = os.getenv("TINKOFF_TERMINAL_KEY")
    TINKOFF_SECRET_KEY: Optional[str] = os.getenv("TINKOFF_SECRET_KEY")
    
    TBANK_TERMINAL: Optional[str] = os.getenv("TBANK_TERMINAL", "1753782172001")
    TBANK_PASSWORD: Optional[str] = os.getenv("TBANK_PASSWORD", "KqU8ItCGM#s&Cqn*")
    TBANK_SECRET_KEY: Optional[str] = os.getenv("TBANK_SECRET_KEY", "KqU8ItCGM#s&Cqn*")
    TBANK_MERCHANT_ID: Optional[str] = os.getenv("TBANK_MERCHANT_ID", "200000001669463")
    TBANK_TERMINAL_ID: Optional[str] = os.getenv("TBANK_TERMINAL_ID", "25786674")
    TBANK_RECEIPT_ENABLED: bool = os.getenv("TBANK_RECEIPT_ENABLED", "False").lower() == "true"
    
    EMAIL_HOST: str = os.getenv("EMAIL_HOST", "mail.стримкэш.рф")
    EMAIL_PORT: int = int(os.getenv("EMAIL_PORT", "587"))
    EMAIL_HOST_USER: str = os.getenv("EMAIL_HOST_USER", "no-reply@стрикэш.рф")
    EMAIL_HOST_PASSWORD: str = os.getenv("EMAIL_HOST_PASSWORD", "UfjuQqDoCk")
    EMAIL_USE_TLS: bool = os.getenv("EMAIL_USE_TLS", "True").lower() == "true"
    
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    API_URL: str = os.getenv("API_URL", "http://localhost:8000")
    
    UPLOAD_DIR: str = "static/uploads"
    
    class Config:
        case_sensitive = True

settings = Settings() 