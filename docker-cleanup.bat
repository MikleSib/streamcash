@echo off
chcp 65001 >nul

echo 🧹 Очистка Docker ресурсов...

:: Остановка всех контейнеров
echo Остановка контейнеров...
docker-compose down >nul 2>&1
docker-compose -f docker-compose.dev.yml down >nul 2>&1
docker-compose -f docker-compose.prod.yml down >nul 2>&1

:: Удаление контейнеров
echo Удаление контейнеров...
for /f "tokens=*" %%i in ('docker ps -a -q --filter "name=donationalerts" 2^>nul') do docker rm -f %%i >nul 2>&1

:: Удаление образов
echo Удаление образов...
for /f "tokens=*" %%i in ('docker images -q --filter "reference=*donationalerts*" 2^>nul') do docker rmi -f %%i >nul 2>&1

:: Удаление неиспользуемых ресурсов
echo Очистка неиспользуемых ресурсов...
docker system prune -f >nul

echo ✅ Очистка завершена!

:: Показать оставшиеся ресурсы
echo.
echo 📊 Оставшиеся Docker ресурсы:
echo Контейнеры:
docker ps -a --filter "name=donationalerts"
echo Образы:
docker images --filter "reference=*donationalerts*"
echo Volumes:
docker volume ls --filter "name=donationalerts"

pause 