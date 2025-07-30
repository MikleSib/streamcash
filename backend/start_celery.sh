#!/bin/bash

echo "Запуск Redis сервера..."
redis-server &
REDIS_PID=$!

echo "Ожидание запуска Redis..."
sleep 3

echo "Запуск Celery Worker..."
python start_celery_worker.py &
WORKER_PID=$!

echo "Ожидание запуска Worker..."
sleep 5

echo "Запуск Celery Beat (планировщик)..."
python start_celery_beat.py &
BEAT_PID=$!

echo "Все сервисы запущены!"
echo "Celery Worker проверяет PENDING платежи каждые 10 секунд"
echo "PIDs: Redis=$REDIS_PID, Worker=$WORKER_PID, Beat=$BEAT_PID"

# Ожидание сигнала завершения
trap "kill $REDIS_PID $WORKER_PID $BEAT_PID" EXIT
wait