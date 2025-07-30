#!/usr/bin/env python3
"""
Скрипт для запуска Celery worker
Запуск: python start_celery_worker.py
"""

import os
import sys
from celery import Celery

# Добавляем путь к приложению
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.celery_app import celery_app

if __name__ == "__main__":
    # Запускаем worker
    celery_app.worker_main([
        "worker",
        "--loglevel=info",
        "--concurrency=1",
        "--pool=solo"  # Для Windows совместимости
    ])