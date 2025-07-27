# 🚀 Развертывание СтримКэш РФ

## Быстрый запуск для разработки

### Требования:
- Docker & Docker Compose
- Домен настроен на сервер: `стримкэш.рф` (`xn--h1aefoeg0czb.xn--p1ai`)

### 1. Запуск одной командой:

**Linux/macOS:**
```bash
./docker-start-dev.sh
```

**Windows:**
```cmd
docker-start-dev.bat
```

### 2. Ручной запуск:

```bash
# Остановка старых контейнеров
docker-compose -f docker-compose.dev.yml down

# Запуск в режиме разработки
docker-compose -f docker-compose.dev.yml up --build -d
```

### 3. Доступ к приложению:

- 🌐 **Сайт**: http://стримкэш.рф
- 🔧 **API**: http://стримкэш.рф/api
- 📚 **Документация**: http://стримкэш.рф/docs

### 4. Полезные команды:

```bash
# Просмотр логов
docker-compose -f docker-compose.dev.yml logs -f

# Просмотр статуса
docker-compose -f docker-compose.dev.yml ps

# Остановка
docker-compose -f docker-compose.dev.yml down

# Перезапуск отдельного сервиса
docker-compose -f docker-compose.dev.yml restart backend
docker-compose -f docker-compose.dev.yml restart frontend
```

### 5. Структура для разработки:

```
🌐 Nginx (порт 80) -> стримкэш.рф
   ├── /api/* -> Backend (порт 8000)
   ├── /docs -> API Documentation
   ├── /static/* -> Static files
   └── /* -> Frontend (порт 3000)
```

### 6. Контейнеры:

- `streamcash_dev_nginx` - Nginx reverse proxy
- `streamcash_dev_frontend` - Next.js фронтенд
- `streamcash_dev_backend` - FastAPI бэкенд
- `streamcash_dev_db` - PostgreSQL база данных
- `streamcash_dev_redis` - Redis кэш

### 7. Настройки для продакшн:

Для продакшн развертывания обновите:
1. Пароли в docker-compose.dev.yml
2. Добавьте SSL сертификаты
3. Настройте реальные ключи платежных систем
4. Используйте docker-compose.prod.yml

---

**СтримКэш РФ** готов к работе! 🇷🇺 