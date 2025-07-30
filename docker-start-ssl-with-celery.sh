#!/bin/bash

echo "Запуск StreamCash SSL с автоматической проверкой платежей..."
echo

echo "Остановка предыдущих контейнеров..."
docker-compose -f docker-compose.ssl.yml down

echo
echo "Сборка и запуск всех сервисов..."
echo "- PostgreSQL база данных"
echo "- Redis для очередей"
echo "- Backend API"
echo "- Frontend"
echo "- Nginx с SSL"
echo "- Celery Worker (проверка платежей каждые 10 секунд)"
echo "- Celery Beat (планировщик задач)"

docker-compose -f docker-compose.ssl.yml up -d --build

echo
echo "Ожидание запуска всех сервисов..."
sleep 15

echo
echo "Проверка статуса сервисов:"
docker-compose -f docker-compose.ssl.yml ps

echo
echo "✅ Система запущена!"
echo "🌐 Сайт: https://стримкэш.рф"
echo "📊 API: https://стримкэш.рф/api/v1"
echo "🔄 Проверка платежей: каждые 10 секунд автоматически"
echo
echo "Логи Celery Worker: docker-compose -f docker-compose.ssl.yml logs -f celery-worker"
echo "Логи Celery Beat: docker-compose -f docker-compose.ssl.yml logs -f celery-beat"
echo "Все логи: docker-compose -f docker-compose.ssl.yml logs -f"