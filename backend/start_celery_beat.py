#!/usr/bin/env python3
"""
Скрипт для запуска Celery beat (планировщик)
Запуск: python start_celery_beat.py
"""

import os
import sys
from celery import Celery

# Добавляем путь к приложению
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.celery_app import celery_app

if __name__ == "__main__":
    # Запускаем beat планировщик
    celery_app.control.purge()  # Очищаем очередь при запуске
    celery_app.start([
        "beat",
        "--loglevel=info",
        "--scheduler=celery.beat:PersistentScheduler"
    ])