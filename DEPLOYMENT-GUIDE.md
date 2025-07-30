# Руководство по развертыванию StreamCash

## Локальная разработка

### Запуск локальной версии
```bash
# Запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f backend
```

### Переменные окружения для локальной разработки
Создайте файл `.env` в корне проекта:
```env
# База данных
POSTGRES_DB=donation_alerts_ru
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Backend
SECRET_KEY=your-super-secret-key-change-in-production
API_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# Т-банк (тестовые данные)
TBANK_TERMINAL=1753782171950DEMO
TBANK_PASSWORD=Hs%8cNP6W&hv%3!^
```

## Продакшн развертывание (SSL)

### Подготовка сервера
1. Установите Docker и Docker Compose
2. Настройте SSL сертификаты (Let's Encrypt)
3. Настройте домен `стримкэш.рф`

### Запуск продакшн версии
```bash
# Используйте готовый скрипт
./docker-start-ssl.sh

# Или вручную
docker-compose -f docker-compose.ssl.yml up -d
```

### Переменные окружения для продакшна
```env
# База данных
POSTGRES_DB=streamcash_dev
POSTGRES_USER=postgres
POSTGRES_PASSWORD=streamcash_dev_2024

# Backend
SECRET_KEY=streamcash-dev-secret-key-super-long-and-secure-2024
API_URL=https://стримкэш.рф
FRONTEND_URL=https://стримкэш.рф
API_V1_STR=/api/v1

# Т-банк (реальные данные)
TBANK_TERMINAL=ваш_реальный_терминал
TBANK_PASSWORD=ваш_реальный_пароль
```

## Интеграция с Т-банком

### Настройка в личном кабинете Т-банка
1. Зайдите в личный кабинет интернет-эквайринга → «Магазины»
2. Выберите ваш магазин → «Способы оплаты»
3. Выберите нужный способ оплаты → «Платежная форма Т-Банка» → «Включить»
4. Скопируйте TerminalKey из вкладки «Терминалы»

### Требования для Т-банка
Согласно [документации Т-банка](https://www.tbank.ru/kassa/dev/integrationjs/#section/Podgotovka-k-ispolzovaniyu):

1. **HTTPS обязателен** - сайт должен работать по протоколу HTTPS
2. **CSP политики** должны разрешать:
   ```
   script-src: https://*.tinkoff.ru https://*.tcsbank.ru https://*.tbank.ru https://*.nspk.ru https://*.t-static.ru
   frame-src: https://*.tinkoff.ru https://*.tcsbank.ru https://*.tbank.ru https://*.nspk.ru https://*.t-static.ru
   img-src: https://*.tinkoff.ru https://*.tcsbank.ru https://*.tbank.ru https://*.nspk.ru https://*.t-static.ru
   connect-src: https://*.tinkoff.ru https://*.tcsbank.ru https://*.tbank.ru https://*.nspk.ru https://*.t-static.ru
   style-src: 'unsafe-inline' https://*.tinkoff.ru https://*.tcsbank.ru https://*.tbank.ru https://*.nspk.ru https://*.t-static.ru
   ```

3. **Отсутствие заголовков**:
   ```
   Cross-Origin-Opener-Policy: *
   ```

### Поддерживаемые браузеры
- Chrome >= 63
- Edge >= 19
- Safari >= 11
- Firefox >= 67
- Opera >= 50
- Samsung Internet >= 8.2
- Opera Mobile >= 73

## Решение проблем

### Проблема с DNS
Если возникают ошибки `[Errno -2] Name or service not known`:
1. Добавьте DNS серверы в `docker-compose.yml`:
   ```yaml
   dns:
     - 8.8.8.8
     - 8.8.4.4
   ```

2. Или используйте `extra_hosts`:
   ```yaml
   extra_hosts:
     - "securepay.tbank.ru:185.178.208.12"
   ```

### Проблема с DDoS-Guard
Т-банк использует DDoS-Guard защиту. Если получаете 503 ошибку:
1. Система автоматически переключится на тестовую страницу
2. Для продакшна обратитесь в Т-банк для добавления вашего IP в белый список

### Проблема с SSL сертификатами
Если Т-банк возвращает ошибки SSL:
1. Отключена проверка SSL сертификатов в коде
2. Используются правильные заголовки User-Agent

## Мониторинг

### Логи
```bash
# Логи backend
docker-compose logs -f backend

# Логи frontend
docker-compose logs -f frontend

# Логи nginx
docker-compose logs -f nginx
```

### Проверка статуса
```bash
# Статус контейнеров
docker-compose ps

# Проверка API
curl https://стримкэш.рф/api/v1/health
```

## Обновление

### Обновление кода
```bash
# Остановить контейнеры
docker-compose down

# Пересобрать образы
docker-compose build --no-cache

# Запустить заново
docker-compose up -d
```

### Обновление базы данных
```bash
# Применить миграции
docker-compose exec backend alembic upgrade head
``` 