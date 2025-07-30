from celery import Celery
from app.core.config import settings

celery_app = Celery("streamcash")

import os

# Определяем URL Redis в зависимости от окружения
redis_host = os.getenv("REDIS_HOST", "localhost")
redis_port = os.getenv("REDIS_PORT", "6379")
redis_url = f"redis://{redis_host}:{redis_port}/0"

celery_app.conf.broker_url = redis_url
celery_app.conf.result_backend = redis_url

celery_app.conf.task_routes = {
    "app.worker.check_pending_payments": "main-queue",
}

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

celery_app.conf.beat_schedule = {
    "check-pending-payments": {
        "task": "app.worker.check_pending_payments",
        "schedule": 10.0,  # каждые 10 секунд
    },
}