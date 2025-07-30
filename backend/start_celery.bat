@echo off
echo Запуск Redis сервера...
start "Redis" redis-server

echo Ожидание запуска Redis...
timeout /t 3

echo Запуск Celery Worker...
start "Celery Worker" python start_celery_worker.py

echo Ожидание запуска Worker...
timeout /t 5

echo Запуск Celery Beat (планировщик)...
start "Celery Beat" python start_celery_beat.py

echo Все сервисы запущены!
echo Celery Worker проверяет PENDING платежи каждые 10 секунд
pause