#!/bin/bash

# Скрипт для очистки Docker ресурсов DonationAlerts РФ

echo "🧹 Очистка Docker ресурсов..."

# Остановка всех контейнеров
echo "Остановка контейнеров..."
docker-compose down
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.prod.yml down

# Удаление контейнеров
echo "Удаление контейнеров..."
docker rm -f $(docker ps -a -q --filter "name=donationalerts") 2>/dev/null || true

# Удаление образов
echo "Удаление образов..."
docker rmi -f $(docker images -q --filter "reference=*donationalerts*") 2>/dev/null || true

# Удаление неиспользуемых ресурсов
echo "Очистка неиспользуемых ресурсов..."
docker system prune -f

# Удаление volumes (опционально - раскомментируйте если нужно)
# echo "⚠️ ВНИМАНИЕ: Удаление volumes приведёт к потере данных БД!"
# read -p "Удалить volumes с данными? (y/N): " choice
# if [[ "$choice" =~ ^[Yy]$ ]]; then
#     docker volume rm $(docker volume ls -q --filter "name=donationalerts") 2>/dev/null || true
#     echo "Volumes удалены"
# fi

echo "✅ Очистка завершена!"

# Показать оставшиеся ресурсы
echo "📊 Оставшиеся Docker ресурсы:"
echo "Контейнеры:"
docker ps -a --filter "name=donationalerts"
echo "Образы:"
docker images --filter "reference=*donationalerts*"
echo "Volumes:"
docker volume ls --filter "name=donationalerts" 