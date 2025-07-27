@echo off
echo 🚀 Запуск СтримКэш РФ в режиме разработки...

REM Остановка существующих контейнеров
echo ⏹️  Остановка существующих контейнеров...
docker-compose -f docker-compose.dev.yml down

REM Очистка старых образов
echo 🧹 Очистка старых образов...
docker system prune -f

REM Запуск в режиме разработки
echo 🔧 Запуск в режиме разработки...
docker-compose -f docker-compose.dev.yml up --build -d

echo.
echo ✅ Приложение запущено успешно!
echo.
echo 🌐 Сайт: http://стримкэш.рф
echo 🔧 API: http://стримкэш.рф/api
echo 📚 Документация API: http://стримкэш.рф/docs
echo.
echo 📋 Полезные команды:
echo   - Просмотр логов: docker-compose -f docker-compose.dev.yml logs -f
echo   - Остановка: docker-compose -f docker-compose.dev.yml down
echo   - Перезапуск: docker-compose -f docker-compose.dev.yml restart
echo.
echo 🔍 Контейнеры:
docker-compose -f docker-compose.dev.yml ps

pause 