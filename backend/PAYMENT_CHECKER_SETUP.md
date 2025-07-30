# Настройка автоматической проверки статусов платежей

## Проблема
Webhook'и от T-Bank могут не доходить или теряться, из-за чего платежи остаются в статусе PENDING даже после успешной оплаты.

## Решение
Добавлена система автоматической проверки статусов PENDING платежей каждые 10 секунд через Celery.

## Установка и запуск

### 1. Убедитесь что Redis запущен
```bash
# Windows
redis-server

# Linux/Mac
sudo systemctl start redis
# или
redis-server
```

### 2. Запуск системы проверки

#### Автоматический запуск (Windows):
```bash
cd backend
start_celery.bat
```

#### Автоматический запуск (Linux/Mac):
```bash
cd backend
chmod +x start_celery.sh
./start_celery.sh
```

#### Ручной запуск:
```bash
cd backend

# Terminal 1: Celery Worker
python start_celery_worker.py

# Terminal 2: Celery Beat (планировщик)
python start_celery_beat.py
```

### 3. Проверка работы

#### Через API:
```bash
# Посмотреть PENDING платежи
curl http://localhost:8000/api/v1/payments/pending-payments

# Запустить проверку вручную
curl -X POST http://localhost:8000/api/v1/payments/check-pending

# Проверить конкретный платеж
curl http://localhost:8000/api/v1/payments/tbank/check/ORDER_ID
```

#### Через логи:
В консоли Celery Worker будут видны логи проверки:
```
🔍 Запуск проверки PENDING платежей
📊 Найдено X PENDING платежей для проверки
✅ Проверка завершена. Проверено: X, Обновлено: Y
```

## Как это работает

1. **Celery Beat** каждые 10 секунд запускает задачу `check_pending_payments`
2. **Celery Worker** выполняет задачу:
   - Находит все PENDING платежи T-Bank с payment_id
   - Для каждого вызывает T-Bank API GetState
   - Обновляет статус если платеж завершен
   - Отправляет WebSocket уведомления
   - Обновляет статистику стримера

3. **Автоматическое обновление**:
   - CONFIRMED/AUTHORIZED → COMPLETED
   - CANCELLED/REVERSED/REFUNDED → FAILED

## Ручная проверка

Если нужно проверить конкретный платеж сразу:

```python
# В коде
from app.worker import check_pending_payments
result = check_pending_payments()
```

```bash
# Через API
curl -X POST http://localhost:8000/api/v1/payments/check-pending
```

## Мониторинг

Логи показывают:
- Сколько платежей проверено
- Сколько обновлено
- Ошибки при проверке конкретных платежей

## Остановка

```bash
# Остановить все процессы Celery
pkill -f celery

# Или закрыть окна терминалов с Worker и Beat
```

## Настройка частоты проверки

В файле `backend/app/celery_app.py` измените:
```python
celery_app.conf.beat_schedule = {
    "check-pending-payments": {
        "task": "app.worker.check_pending_payments",
        "schedule": 10.0,  # секунды (10 = каждые 10 секунд)
    },
}
```

## Troubleshooting

### Redis не запущен
```
Ошибка: Redis connection failed
Решение: Запустить redis-server
```

### Celery worker не видит задачи
```
Решение: Перезапустить worker и beat одновременно
```

### Задачи не выполняются
```
Проверить логи worker'а на ошибки
Убедиться что beat запущен
Проверить подключение к Redis
```