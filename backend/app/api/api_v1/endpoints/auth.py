from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.core import deps
from app.core import security
from app.core.config import settings
from app.core.security import get_password_hash
from app.services.email_service import email_service

router = APIRouter()

@router.post("/login", response_model=schemas.Token)
async def login_access_token(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    user = crud.user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not crud.user.is_active(user):
        raise HTTPException(status_code=400, detail="Inactive user")
    elif not crud.user.is_email_verified(user):
        # Если email не подтвержден, отправляем новый код
        verification_code = crud.user.set_verification_code(db, user=user)
        try:
            await email_service.send_verification_code(
                user_email=user.email,
                username=user.username,
                verification_code=verification_code
            )
        except Exception as e:
            print(f"Failed to send verification email: {e}")
        
        raise HTTPException(
            status_code=400, 
            detail="Email not verified. New verification code sent to your email."
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/register", response_model=schemas.User)
async def register(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
) -> Any:
    user = crud.user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = crud.user.get_by_username(db, username=user_in.username)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    user = crud.user.create(db, obj_in=user_in)
    
    # Генерируем код подтверждения
    verification_code = crud.user.set_verification_code(db, user=user)
    
    # Отправляем код подтверждения
    try:
        await email_service.send_verification_code(
            user_email=user.email,
            username=user.username,
            verification_code=verification_code
        )
    except Exception as e:
        print(f"Failed to send verification email: {e}")
    
    # Создаем дефолтные настройки алертов для нового пользователя
    crud.alert_settings.create_default_for_new_user(db, user_id=user.id)
    
    return user

@router.post("/verify-email", response_model=dict)
async def verify_email(
    *,
    db: Session = Depends(deps.get_db),
    verification_data: schemas.EmailVerificationCode,
) -> Any:
    success = crud.user.verify_email_code(
        db, email=verification_data.email, code=verification_data.code
    )
    
    if not success:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired verification code."
        )
    
    return {"message": "Email verified successfully"}

@router.post("/resend-verification", response_model=dict)
async def resend_verification(
    *,
    db: Session = Depends(deps.get_db),
    email_request: schemas.EmailVerificationRequest,
) -> Any:
    user = crud.user.get_by_email(db, email=email_request.email)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )
    
    if user.email_verified:
        raise HTTPException(
            status_code=400,
            detail="Email already verified."
        )
    
    # Генерируем новый код подтверждения
    verification_code = crud.user.set_verification_code(db, user=user)
    
    # Отправляем новый код подтверждения
    try:
        await email_service.send_verification_code(
            user_email=user.email,
            username=user.username,
            verification_code=verification_code
        )
    except Exception as e:
        print(f"Failed to send verification email: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to send verification email."
        )
    
    return {"message": "Verification code sent successfully"}

@router.post("/test-token", response_model=schemas.User)
def test_token(current_user: models.User = Depends(deps.get_current_user)) -> Any:
    return current_user 