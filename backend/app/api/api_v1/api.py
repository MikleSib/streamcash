from fastapi import APIRouter

from app.api.api_v1.endpoints import auth, users, donations, streamers, payments, websocket, alerts

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(streamers.router, prefix="/streamers", tags=["streamers"])
api_router.include_router(donations.router, prefix="/donations", tags=["donations"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])
api_router.include_router(websocket.router, prefix="/ws", tags=["websocket"]) 