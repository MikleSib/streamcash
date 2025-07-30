from typing import Any, Dict, Optional, Union
from datetime import datetime, timedelta
import random
import string

from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def get_by_username(self, db: Session, *, username: str) -> Optional[User]:
        return db.query(User).filter(User.username == username).first()

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        db_obj = User(
            email=obj_in.email,
            username=obj_in.username,
            hashed_password=get_password_hash(obj_in.password),
            full_name=obj_in.full_name,
            is_active=obj_in.is_active,
            is_streamer=obj_in.is_streamer,
            avatar_url=obj_in.avatar_url,
            bio=obj_in.bio,
            email_verified=False,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: User, obj_in: Union[UserUpdate, Dict[str, Any]]
    ) -> User:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def authenticate(self, db: Session, *, email: str, password: str) -> Optional[User]:
        user = self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def is_active(self, user: User) -> bool:
        return user.is_active

    def is_superuser(self, user: User) -> bool:
        return user.is_superuser

    def generate_verification_code(self) -> str:
        """Генерирует 6-значный код подтверждения"""
        return ''.join(random.choices(string.digits, k=6))

    def set_verification_code(self, db: Session, *, user: User) -> str:
        """Устанавливает код подтверждения для пользователя"""
        verification_code = self.generate_verification_code()
        expires_at = datetime.utcnow() + timedelta(minutes=10)
        
        user.email_verification_code = verification_code
        user.email_verification_expires = expires_at
        
        db.commit()
        db.refresh(user)
        
        return verification_code

    def verify_email_code(self, db: Session, *, email: str, code: str) -> bool:
        """Проверяет код подтверждения email"""
        user = self.get_by_email(db, email=email)
        if not user:
            return False
        
        if not user.email_verification_code:
            return False
        
        if user.email_verification_expires < datetime.utcnow():
            return False
        
        if user.email_verification_code != code:
            return False
        
        user.email_verified = True
        user.email_verification_code = None
        user.email_verification_expires = None
        
        db.commit()
        db.refresh(user)
        
        return True

    def is_email_verified(self, user: User) -> bool:
        """Проверяет, подтвержден ли email пользователя"""
        return user.email_verified

user = CRUDUser(User) 