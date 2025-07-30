# СтримКэш РФ - Микросервисная архитектура

## 🏗️ Архитектура

Система разделена на следующие микросервисы для обеспечения отказоустойчивости и масштабируемости:

### Компоненты системы

1. **API Gateway** (`api-gateway`) - Центральная точка входа для всех запросов от фронтенда
2. **Donations Service** (`donations-service`) - Управление донатами (создание, обновление, получение)
3. **Payments Service** (`payments-service`) - Создание и обработка платежей через различные платежные системы
4. **Notifications Service** (`notifications-service`) - WebSocket уведомления стримерам
5. **Payment Checker Service** (`payment-checker-service`) - Проверка статусов платежей в T-Bank

### Инфраструктура

- **PostgreSQL** - основная база данных
- **Redis** - кэширование
- **RabbitMQ** - асинхронный обмен сообщениями между микросервисами
- **Nginx** - reverse proxy с SSL

## 🔄 Поток данных

```
Frontend → API Gateway → RabbitMQ → Микросервисы
                           ↓
                    PostgreSQL + Redis
```

### События в RabbitMQ

- `donation.created` - создан новый донат
- `payment.created` - создан платеж  
- `payment.completed` - платеж завершен
- `notification.send` - отправить уведомление
- `streamer.stats.update` - обновить статистику стримера

## 🚀 Запуск системы

```bash
# Запуск всей системы
docker-compose -f docker-compose.ssl.yml up -d

# Проверка статуса сервисов
docker-compose -f docker-compose.ssl.yml ps

# Логи конкретного сервиса
docker-compose -f docker-compose.ssl.yml logs donations-service
```

## 📊 Мониторинг

- **RabbitMQ Management**: http://localhost:15672 (streamcash / streamcash_dev_2024)
- **API Gateway**: http://localhost:8000/health
- **Frontend**: http://localhost:3000

## 🔧 Отказоустойчивость

- **Healthchecks** для всех сервисов
- **Автоматическое переподключение** к RabbitMQ и PostgreSQL  
- **Retry логика** при обработке сообщений
- **Graceful shutdown** для всех сервисов

## 📁 Структура проекта

```
backend/
├── shared/                    # Общие компоненты
│   ├── rabbitmq.py           # RabbitMQ клиент
│   ├── events.py             # События и схемы
│   └── database.py           # Настройки БД
├── services/                 # Микросервисы
│   ├── api-gateway/          # API Gateway
│   ├── donations/            # Donations Service
│   ├── payments/             # Payments Service
│   ├── notifications/        # Notifications Service
│   └── payment-checker/      # Payment Checker Service
└── app/                      # Оригинальный код (shared models, etc.)
```

## 🔄 Миграция с монолита

Система сохраняет совместимость с фронтендом - все API endpoints остаются теми же, но теперь обрабатываются через микросервисы.

## ⚡ Производительность

- **Асинхронная обработка** через RabbitMQ
- **Горизонтальное масштабирование** микросервисов
- **Разделение ответственности** между сервисами
- **Кэширование** в Redis

## 🛡️ Безопасность

- **Изолированная сеть** Docker для всех сервисов
- **Health checks** для мониторинга состояния
- **Переменные окружения** для чувствительных данных
- **SSL termination** в Nginx