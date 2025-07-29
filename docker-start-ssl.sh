#!/bin/bash

# Экспорт переменных окружения для SSL версии
export POSTGRES_DB=streamcash_dev
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=streamcash_dev_2024
export SECRET_KEY=streamcash-dev-secret-key-super-long-and-secure-2024
export DEBUG=true
export ENVIRONMENT=development
export YOOKASSA_SHOP_ID=test_shop_id
export YOOKASSA_SECRET_KEY=test_secret_key
export SBERBANK_USERNAME=
export SBERBANK_PASSWORD=
export TINKOFF_TERMINAL_KEY=
export TINKOFF_SECRET_KEY=
export TBANK_TERMINAL=1753782171950DEMO
export TBANK_PASSWORD=Hs%8cNP6W&hv%3!^
export FRONTEND_URL=https://стримкэш.рф
export API_URL=https://стримкэш.рф
export API_V1_STR=/api/v1
export NEXT_PUBLIC_API_URL=https://стримкэш.рф/api

echo "Запуск SSL версии StreamCash..."
echo "Переменные окружения установлены"

# Остановка существующих контейнеров
docker-compose -f docker-compose.ssl.yml down

# Удаление старых образов (опционально)
# docker-compose -f docker-compose.ssl.yml down --rmi all

# Запуск контейнеров
docker-compose -f docker-compose.ssl.yml up -d

echo "SSL версия запущена!"
echo "Frontend: https://стримкэш.рф"
echo "Backend API: https://стримкэш.рф/api"
echo ""
echo "Логи backend:"
docker-compose -f docker-compose.ssl.yml logs -f backend 