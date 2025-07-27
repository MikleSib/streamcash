# СтримКэш РФ

Российская платформа для приёма донатов стримерами. Альтернатива DonationAlerts с поддержкой российских платёжных систем и без блокировок.

## 🚀 Возможности

- ✅ **Российские платёжные системы**: YooKassa, Сбербанк, Тинькофф
- ✅ **Низкие комиссии**: Минимальные комиссии за обработку платежей
- ✅ **Real-time уведомления**: WebSocket соединения для мгновенных алертов
- ✅ **Красивый интерфейс**: Современный UI на Next.js с Tailwind CSS
- ✅ **Аналитика**: Подробная статистика донатов и доходов
- ✅ **Настраиваемые виджеты**: Гибкие настройки алертов и целей
- ✅ **Безопасность**: JWT аутентификация и защищённые API
 - ✅ **Docker**: Полная контейнеризация для лёгкого развёртывания

## 🛠 Технологии

### Backend
- **FastAPI** - быстрый и современный веб-фреймворк
- **SQLAlchemy** - ORM для работы с базой данных
- **PostgreSQL** - производительная база данных
- **Redis** - кэширование и очереди
- **WebSockets** - real-time соединения
- **YooKassa API** - интеграция с платёжными системами

### Frontend
- **Next.js 14** - React фреймворк с App Router
- **TypeScript** - типизированный JavaScript
- **Tailwind CSS** - utility-first CSS фреймворк
- **React Query** - управление состоянием сервера
- **Axios** - HTTP клиент

### Infrastructure
- **Docker & Docker Compose** - контейнеризация
- **Nginx** - reverse proxy и load balancer
- **Alembic** - миграции базы данных

## 🐳 Быстрый старт с Docker

### Предварительные требования

- Docker & Docker Compose
- Git

### Запуск одной командой

**Linux/macOS:**
```bash
git clone <repository-url>
cd donationalerts-ru
./docker-start.sh
```

**Windows:**
```cmd
git clone <repository-url>
cd donationalerts-ru
docker-start.bat
```

### Ручной запуск

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd donationalerts-ru
```

2. Скопируйте файл переменных окружения:
```bash
cp .env.example .env
```

3. Отредактируйте `.env` файл (добавьте ключи платёжных систем):
```env
YOOKASSA_SHOP_ID=your_shop_id
YOOKASSA_SECRET_KEY=your_secret_key
```

4. Запустите приложение:

**Режим разработки:**
```bash
docker-compose -f docker-compose.dev.yml up --build
```

**Продакшн режим:**
```bash
docker-compose up --build -d
```

### Доступ к приложению

- 🌐 **Фронтенд**: http://localhost:3000
- 🔧 **API**: http://localhost:8000
- 📚 **Документация API**: http://localhost:8000/docs
- 🗄️ **PostgreSQL**: localhost:5432
- 🔴 **Redis**: localhost:6379

## 📋 Docker команды

### Основные команды

```bash
# Запуск в фоне
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down

# Перестройка образов
docker-compose up --build

# Просмотр статуса
docker-compose ps
```

### Команды для разработки

```bash
# Запуск в режиме разработки
docker-compose -f docker-compose.dev.yml up

# Подключение к контейнеру бэкенда
docker-compose exec backend bash

# Подключение к PostgreSQL
docker-compose exec db psql -U postgres -d donation_alerts_ru

# Применение миграций вручную
docker-compose exec backend alembic upgrade head
```

### Очистка

```bash
# Скрипт полной очистки
./docker-cleanup.sh      # Linux/macOS
docker-cleanup.bat       # Windows

# Или вручную
docker-compose down
docker system prune -f
```

## 🔧 Настройка для продакшн

### 1. Переменные окружения

Создайте файл `.env` с реальными значениями:

```env
# Безопасность
SECRET_KEY=your-super-secret-key-256-bit
POSTGRES_PASSWORD=secure-database-password

# Домены
FRONTEND_URL=https://стримкэш.рф
API_URL=https://api.стримкэш.рф
NEXT_PUBLIC_API_URL=https://api.стримкэш.рф

# Платёжные системы
YOOKASSA_SHOP_ID=your_real_shop_id
YOOKASSA_SECRET_KEY=your_real_secret_key

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password
```

### 2. SSL сертификаты

Для HTTPS поместите сертификаты в `nginx/ssl/`:
- `cert.pem` - сертификат
- `key.pem` - приватный ключ

### 3. Запуск продакшн

```bash
# С Nginx
docker-compose -f docker-compose.prod.yml up -d

# Без Nginx (если используете внешний load balancer)
docker-compose up -d
```

## 🔧 Настройка платёжных систем

### YooKassa

1. Зарегистрируйтесь на [yookassa.ru](https://yookassa.ru/)
2. Получите `shop_id` и `secret_key` в личном кабинете
3. Добавьте их в `.env` файл

### Сбербанк

1. Получите доступ к API Сбербанк Эквайринг
2. Добавьте `SBERBANK_USERNAME` и `SBERBANK_PASSWORD` в `.env`

### Тинькофф

1. Зарегистрируйтесь в Тинькофф Эквайринг
2. Получите `TINKOFF_TERMINAL_KEY` и `TINKOFF_SECRET_KEY`
3. Добавьте их в `.env` файл

## 📊 Мониторинг

### Логи приложения

```bash
# Все логи
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Состояние контейнеров

```bash
# Статус всех контейнеров
docker-compose ps

# Использование ресурсов
docker stats
```

### Backup базы данных

```bash
# Создание backup
docker-compose exec db pg_dump -U postgres donation_alerts_ru > backup.sql

# Восстановление
docker-compose exec -T db psql -U postgres donation_alerts_ru < backup.sql
```

## 🎮 Использование

### Для стримеров

1. Зарегистрируйтесь на платформе
2. Создайте профиль стримера в дашборде
3. Настройте параметры донатов (мин/макс сумма, цели)
4. Получите ссылку для приёма донатов
5. Интегрируйте виджет в ваш стрим

### Для донатеров

1. Перейдите по ссылке стримера
2. Выберите сумму и способ оплаты
3. Оставьте сообщение (опционально)
4. Совершите оплату через российские платёжные системы

## 🚀 Деплой в продакшн

### VPS/Dedicated сервер

1. Установите Docker и Docker Compose
2. Клонируйте репозиторий
3. Настройте `.env` файл
4. Запустите: `docker-compose -f docker-compose.prod.yml up -d`

### Cloud провайдеры

Поддерживается деплой на:
- DigitalOcean
- AWS ECS
- Google Cloud Run
- Yandex Cloud
- VK Cloud

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции: `git checkout -b feature/amazing-feature`
3. Зафиксируйте изменения: `git commit -m 'Add amazing feature'`
4. Отправьте в ветку: `git push origin feature/amazing-feature`
5. Откройте Pull Request

## 🔧 Разработка

### Локальная разработка без Docker

Если вы предпочитаете разрабатывать без Docker:

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Структура проекта

```
donationalerts-ru/
├── backend/                 # FastAPI бэкенд
│   ├── app/                # Код приложения
│   ├── alembic/            # Миграции
│   ├── static/             # Статические файлы
│   ├── Dockerfile          # Продакшн образ
│   └── Dockerfile.dev      # Образ для разработки
├── frontend/               # Next.js фронтенд
│   ├── src/                # Исходный код
│   ├── public/             # Публичные файлы
│   ├── Dockerfile          # Продакшн образ
│   └── Dockerfile.dev      # Образ для разработки
├── nginx/                  # Nginx конфигурация
├── docker-compose.yml      # Продакшн compose
├── docker-compose.dev.yml  # Разработка compose
└── docker-compose.prod.yml # Продакшн с SSL
```

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл [LICENSE](LICENSE) для подробностей.

## 🆘 Поддержка

Если у вас есть вопросы или проблемы:
- Создайте Issue в GitHub
- Напишите в Telegram: @your_telegram
- Email: support@стримкэш.рф

## 🔥 Roadmap

- [ ] Kubernetes манифесты
- [ ] CI/CD pipeline
- [ ] Интеграция с OBS WebSocket
- [ ] Мобильное приложение
- [ ] Интеграция с Twitch/YouTube
- [ ] Криптовалютные платежи
- [ ] Голосовые алерты
- [ ] Система рефералов
- [ ] API для разработчиков

---

**СтримКэш РФ** - сделано в России для российских стримеров! 🇷🇺 