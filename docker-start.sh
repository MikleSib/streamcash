#!/bin/bash

# Скрипт для запуска DonationAlerts РФ

set -e

echo "🚀 Запуск DonationAlerts РФ..."

# Проверяем наличие .env файла
if [ ! -f .env ]; then
    echo "📝 Создаю .env файл из .env.example..."
    cp .env.example .env
    echo "⚠️  Не забудьте настроить переменные окружения в файле .env"
fi

# Выбор режима запуска
echo "Выберите режим запуска:"
echo "1) Продакшн (docker-compose.yml)"
echo "2) Разработка (docker-compose.dev.yml)"
read -p "Введите номер (1 или 2): " choice

case $choice in
    1)
        echo "🔧 Запуск в продакшн режиме..."
        docker-compose down
        docker-compose up --build -d
        echo "✅ Приложение запущено!"
        echo "🌐 Фронтенд: http://localhost:3000"
        echo "🔧 API: http://localhost:8000"
        echo "📚 Документация: http://localhost:8000/docs"
        ;;
    2)
        echo "🔧 Запуск в режиме разработки..."
        docker-compose -f docker-compose.dev.yml down
        docker-compose -f docker-compose.dev.yml up --build
        ;;
    *)
        echo "❌ Неверный выбор. Выберите 1 или 2."
        exit 1
        ;;
esac

echo "📋 Полезные команды:"
echo "  - Остановить: docker-compose down"
echo "  - Посмотреть логи: docker-compose logs -f"
echo "  - Перезапустить: docker-compose restart" 