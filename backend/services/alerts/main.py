from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import sys
import os

sys.path.append('/app')
sys.path.append('/app/shared')

from app.api.api_v1.endpoints.alerts import router as alerts_router
from app.api.api_v1.endpoints.websocket import router as websocket_router
from app.core.database import engine
from app.models import user, donation, streamer, alert_settings

app = FastAPI(
    title="СтримКэш РФ - Alerts Service",
    description="Сервис для управления алертами",
    version="1.0.0",
    openapi_url=None,
    docs_url=None,
    redoc_url=None
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="/app/static"), name="static")

# Подключаем роутеры
app.include_router(alerts_router, prefix="/api/v1/alerts", tags=["alerts"])
app.include_router(websocket_router, prefix="/api/v1", tags=["websocket"])

@app.get("/")
async def root():
    return {"message": "СтримКэш РФ Alerts Service", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 