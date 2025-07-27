@echo off
chcp 65001 >nul

echo 🚀 Запуск DonationAlerts РФ...

:: Проверяем наличие .env файла
if not exist .env (
    echo 📝 Создаю .env файл из .env.example...
    copy .env.example .env >nul
    echo ⚠️  Не забудьте настроить переменные окружения в файле .env
)

:: Выбор режима запуска
echo Выберите режим запуска:
echo 1^) Продакшн ^(docker-compose.yml^)
echo 2^) Разработка ^(docker-compose.dev.yml^)
set /p choice="Введите номер (1 или 2): "

if "%choice%"=="1" (
    echo 🔧 Запуск в продакшн режиме...
    docker-compose down
    docker-compose up --build -d
    echo ✅ Приложение запущено!
    echo 🌐 Фронтенд: http://localhost:3000
    echo 🔧 API: http://localhost:8000
    echo 📚 Документация: http://localhost:8000/docs
) else if "%choice%"=="2" (
    echo 🔧 Запуск в режиме разработки...
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.dev.yml up --build
) else (
    echo ❌ Неверный выбор. Выберите 1 или 2.
    pause
    exit /b 1
)

echo.
echo 📋 Полезные команды:
echo   - Остановить: docker-compose down
echo   - Посмотреть логи: docker-compose logs -f
echo   - Перезапустить: docker-compose restart

pause 