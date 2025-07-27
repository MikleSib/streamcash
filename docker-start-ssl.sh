#!/bin/bash

echo "🔒 Запуск СтримКэш РФ с HTTPS..."

# Остановка существующих контейнеров
echo "⏹️  Остановка существующих контейнеров..."
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.ssl.yml down

# Проверка наличия SSL сертификатов
if [ ! -f "/etc/letsencrypt/live/xn--h1aefoeg0czb.xn--p1ai/fullchain.pem" ]; then
    echo "❌ SSL сертификаты не найдены!"
    echo "Выполните сначала:"
    echo "  apt install certbot python3-certbot-nginx -y"
    echo "  certbot certonly --standalone -d стримкэш.рф -d xn--h1aefoeg0czb.xn--p1ai"
    exit 1
fi

# Запуск с HTTPS
echo "🔧 Запуск с HTTPS..."
docker-compose -f docker-compose.ssl.yml up --build -d

echo ""
echo "✅ Приложение запущено с HTTPS!"
echo ""
echo "🌐 Сайт: https://стримкэш.рф"
echo "🔧 API: https://стримкэш.рф/api"
echo "📚 Документация: https://стримкэш.рф/docs"
echo ""
echo "📋 Полезные команды:"
echo "  - Просмотр логов: docker-compose -f docker-compose.ssl.yml logs -f"
echo "  - Остановка: docker-compose -f docker-compose.ssl.yml down"
echo "  - Перезапуск: docker-compose -f docker-compose.ssl.yml restart"
echo ""
echo "🔍 Контейнеры:"
docker-compose -f docker-compose.ssl.yml ps 