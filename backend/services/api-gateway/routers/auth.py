from fastapi import APIRouter
from typing import Any

import sys
sys.path.append('/app')

from app.api.api_v1.endpoints.auth import router as original_auth_router

router = APIRouter()
api_gateway = None

def setup_dependencies(gateway):
    global api_gateway
    api_gateway = gateway

# Наследуем все роуты из оригинального auth роутера
router.routes = original_auth_router.routes.copy()