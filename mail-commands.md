# 📧 Команды для управления почтовым сервисом

## Быстрый запуск

### MailHog (разработка):
```bash
# Запуск
docker-compose -f docker-compose.ssl.yml --profile dev up -d mailhog

# Остановка
docker-compose -f docker-compose.ssl.yml --profile dev down mailhog

# Логи
docker logs streamcash_mailhog -f
```

### Poste.io (продакшен):
```bash
# Запуск
docker-compose -f docker-compose.ssl.yml --profile production up -d mail

# Остановка
docker-compose -f docker-compose.ssl.yml --profile production down mail

# Логи
docker logs streamcash_mail -f
```

## Альтернативный запуск через отдельный файл:
```bash
# MailHog
docker-compose -f docker-compose.mail.yml --profile dev up -d mailhog

# Poste.io
docker-compose -f docker-compose.mail.yml --profile production up -d
```

## Проверка статуса:
```bash
# Проверить запущенные контейнеры
docker ps | grep mail

# Проверить сети
docker network ls | grep streamcash
```

## Отладка:
```bash
# Проверить конфигурацию docker-compose
docker-compose -f docker-compose.ssl.yml config

# Проверить профили
docker-compose -f docker-compose.ssl.yml --profile production config
```