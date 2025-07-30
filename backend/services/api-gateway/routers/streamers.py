from fastapi import APIRouter
from typing import Any

import sys
sys.path.append('/app')

from app.api.api_v1.endpoints.streamers import router as original_streamers_router

router = APIRouter()
api_gateway = None

def setup_dependencies(gateway):
    global api_gateway
    api_gateway = gateway

# Наследуем все роуты из оригинального streamers роутера
router.routes = original_streamers_router.routes.copy()