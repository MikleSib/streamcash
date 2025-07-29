@echo off
chcp 65001 >nul

echo Запуск SSL версии StreamCash...

REM Экспорт переменных окружения для SSL версии
set POSTGRES_DB=streamcash_dev
set POSTGRES_USER=postgres
set POSTGRES_PASSWORD=streamcash_dev_2024
set SECRET_KEY=streamcash-dev-secret-key-super-long-and-secure-2024
set DEBUG=true
set ENVIRONMENT=development
set YOOKASSA_SHOP_ID=test_shop_id
set YOOKASSA_SECRET_KEY=test_secret_key
set SBERBANK_USERNAME=
set SBERBANK_PASSWORD=
set TINKOFF_TERMINAL_KEY=
set TINKOFF_SECRET_KEY=
set TBANK_TERMINAL=1753782171950DEMO
set TBANK_PASSWORD=Hs%%8cNP6W^&hv%%3!^
set FRONTEND_URL=https://стримкэш.рф
set API_URL=https://стримкэш.рф/api
set NEXT_PUBLIC_API_URL=https://стримкэш.рф/api

echo Переменные окружения установлены

REM Остановка существующих контейнеров
docker-compose -f docker-compose.ssl.yml down

REM Запуск контейнеров
docker-compose -f docker-compose.ssl.yml up -d

echo SSL версия запущена!
echo Frontend: https://стримкэш.рф
echo Backend API: https://стримкэш.рф/api
echo.
echo Логи backend:
docker-compose -f docker-compose.ssl.yml logs -f backend

pause 