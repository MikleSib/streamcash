#!/bin/bash

echo "🚀 Запуск почтового сервиса для стримкэш.рф"
echo "=========================================="

# Проверяем, существуют ли SSL сертификаты
if [ ! -f "/etc/letsencrypt/live/xn--h1aefoeg0czb.xn--p1ai/fullchain.pem" ]; then
    echo "⚠️  SSL сертификаты не найдены!"
    echo "   Убедитесь, что у вас есть SSL сертификат для стримкэш.рф"
    echo "   Путь: /etc/letsencrypt/live/xn--h1aefoeg0czb.xn--p1ai/"
    echo ""
fi

# Выбор режима запуска
echo "Выберите режим запуска:"
echo "1) Разработка (MailHog)"
echo "2) Продакшен (Poste.io)"
echo ""
read -p "Введите номер (1 или 2): " choice

case $choice in
    1)
        echo "📧 Запускаем MailHog для разработки..."
        docker-compose --profile dev up -d mailhog
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ MailHog успешно запущен!"
            echo "🌐 Веб-интерфейс: http://localhost:8025"
            echo "📬 SMTP: localhost:1025"
            echo ""
            echo "Настройте переменные окружения:"
            echo "EMAIL_HOST=localhost"
            echo "EMAIL_PORT=1025"
            echo "EMAIL_USE_TLS=False"
        else
            echo "❌ Ошибка при запуске MailHog"
        fi
        ;;
    2)
        echo "📬 Запускаем Poste.io для продакшена..."
        
        # Проверяем, существует ли сеть
        docker network inspect streamcash_network >/dev/null 2>&1
        if [ $? -ne 0 ]; then
            echo "📶 Создаём Docker сеть..."
            docker network create streamcash_network
        fi
        
        docker-compose --profile production up -d mail
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Poste.io успешно запущен!"
            echo "🌐 Админка (HTTP): http://your-server:8090"
            echo "🔒 Админка (HTTPS): https://mail.стримкэш.рф:8443"
            echo "📬 SMTP: mail.стримкэш.рф:587"
            echo ""
            echo "📋 Следующие шаги:"
            echo "1. Откройте админ-панель"
            echo "2. Создайте администратора"
            echo "3. Настройте домен стримкэш.рф"
            echo "4. Создайте почтовый ящик noreply@стримкэш.рф"
            echo ""
            echo "🔧 Настройте переменные окружения:"
            echo "EMAIL_HOST=mail.стримкэш.рф"
            echo "EMAIL_PORT=587"
            echo "EMAIL_HOST_USER=noreply@стримкэш.рф"
            echo "EMAIL_USE_TLS=True"
        else
            echo "❌ Ошибка при запуске Poste.io"
        fi
        ;;
    *)
        echo "❌ Некорректный выбор"
        exit 1
        ;;
esac

echo ""
echo "📖 Подробная документация: EMAIL-SETUP.md"
echo "🔧 Настройки переменных: mail-config.env"