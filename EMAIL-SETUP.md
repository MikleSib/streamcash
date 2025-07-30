# 📧 Настройка Email-сервиса для СтримКэш

## Варианты почтовых сервисов

### 1. **Poste.io** (Рекомендуется для продакшена)
Полноценный почтовый сервер с веб-админкой.

**Особенности:**
- ✅ Веб-интерфейс администратора
- ✅ Поддержка SMTP, IMAP, POP3
- ✅ Антиспам фильтры  
- ✅ SSL/TLS поддержка
- ✅ Простая настройка через Docker

### 2. **MailHog** (Для разработки)
SMTP-сервер для тестирования email-уведомлений.

**Особенности:**
- ✅ Перехватывает все исходящие письма
- ✅ Веб-интерфейс для просмотра писем
- ✅ Идеально для разработки и тестирования

## Быстрый старт

### Для разработки (MailHog)

1. **Запустите MailHog:**
```bash
docker-compose --profile dev up -d mailhog
```

2. **Настройте переменные окружения:**
```env
EMAIL_HOST=localhost
EMAIL_PORT=1025
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
EMAIL_USE_TLS=False
```

3. **Откройте веб-интерфейс:**
- URL: http://localhost:8025
- Все отправленные письма будут отображаться здесь

### Для продакшена (Poste.io) - домен стримкэш.рф

1. **Подготовьте DNS записи:**
- A-запись: `mail.стримкэш.рф` → IP сервера
- MX-запись: `стримкэш.рф` → `mail.стримкэш.рф`
- Punycode: `mail.xn--h1aefoeg0czb.xn--p1ai` (для технических нужд)

2. **Запустите Poste.io:**
```bash
# Основной стек с почтой
docker-compose --profile production up -d mail

# Или отдельный почтовый стек
docker-compose -f docker-compose.mail.yml --profile production up -d
```

3. **Первоначальная настройка:**
- Откройте https://mail.стримкэш.рф:8443 (с SSL)
- Или http://your-server:8090 (без SSL)
- Создайте администратора
- Настройте домены и почтовые ящики

4. **Настройте переменные окружения:**
```env
EMAIL_HOST=mail.стримкэш.рф
EMAIL_PORT=587
EMAIL_HOST_USER=noreply@стримкэш.рф
EMAIL_HOST_PASSWORD=secure_password
EMAIL_USE_TLS=True
FRONTEND_URL=https://стримкэш.рф
```

## Настройка DNS для продакшена

### Обязательные DNS записи для стримкэш.рф:

```dns
# A-запись для почтового сервера (можно использовать кириллицу или punycode)
mail.стримкэш.рф.               IN  A       YOUR_SERVER_IP
mail.xn--h1aefoeg0czb.xn--p1ai. IN  A       YOUR_SERVER_IP

# MX-запись для домена
стримкэш.рф.                    IN  MX  10  mail.стримкэш.рф.
xn--h1aefoeg0czb.xn--p1ai.      IN  MX  10  mail.xn--h1aefoeg0czb.xn--p1ai.

# SPF запись для предотвращения спама
стримкэш.рф.                    IN  TXT     "v=spf1 mx ~all"
xn--h1aefoeg0czb.xn--p1ai.      IN  TXT     "v=spf1 mx ~all"

# DMARC запись (рекомендуется)
_dmarc.стримкэш.рф.             IN  TXT     "v=DMARC1; p=quarantine; rua=mailto:admin@стримкэш.рф"
_dmarc.xn--h1aefoeg0czb.xn--p1ai. IN  TXT   "v=DMARC1; p=quarantine; rua=mailto:admin@xn--h1aefoeg0czb.xn--p1ai"

# Опционально: автодискавери для почтовых клиентов
autoconfig.стримкэш.рф.         IN  A       YOUR_SERVER_IP
autoconfig.xn--h1aefoeg0czb.xn--p1ai. IN A  YOUR_SERVER_IP
```

**Важно:** Российские домены (.рф) используют Punycode для технического представления. 
Ваш домен стримкэш.рф в Punycode: `xn--h1aefoeg0czb.xn--p1ai`

### Настройка DKIM (опционально):
DKIM настраивается автоматически в веб-интерфейсе Poste.io.

## Типы email-уведомлений

### 1. Приветственное письмо
Отправляется при регистрации нового пользователя.

### 2. Уведомления о донатах
Стримеры получают красивые email-уведомления о новых донатах.

### 3. Сброс пароля (планируется)
Пользователи смогут восстанавливать пароль через email.

## Команды для управления

### Запуск сервисов:

```bash
# Только для разработки
docker-compose --profile dev up -d mailhog

# Только для продакшена  
docker-compose --profile production up -d mail

# Вместе с основным стеком
docker-compose --profile dev up -d
docker-compose --profile production up -d
```

### Мониторинг логов:

```bash
# MailHog логи
docker logs streamcash_mailhog -f

# Poste.io логи
docker logs streamcash_mail -f
```

### Резервное копирование:

```bash
# Бэкап данных почтового сервера
docker run --rm -v streamcash_mail_data:/data -v $(pwd):/backup alpine tar czf /backup/mail-backup.tar.gz /data
```

## Веб-интерфейсы

### MailHog (разработка):
- **URL:** http://localhost:8025
- **Описание:** Просмотр всех отправленных писем

### Poste.io (продакшен):
- **URL:** http://your-server:8090
- **Описание:** Полноценная админка почтового сервера
- **Функции:**
  - Управление доменами
  - Создание почтовых ящиков
  - Настройка антиспама
  - Мониторинг очередей
  - SSL сертификаты

## Безопасность

### Рекомендации:

1. **Смените пароли по умолчанию**
2. **Настройте SSL/TLS сертификаты**
3. **Ограничьте доступ к админке по IP**
4. **Регулярно обновляйте Docker образы**
5. **Настройте фаервол**

### Пример настройки фаервола:

```bash
# Разрешить только необходимые порты
ufw allow 25/tcp    # SMTP
ufw allow 587/tcp   # SMTP submission  
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 8090/tcp  # Admin interface (ограничить по IP)
```

## Тестирование

### Проверка отправки писем:

```python
# Тест в Python
import smtplib
from email.mime.text import MIMEText

msg = MIMEText("Test message")
msg['Subject'] = "Test"
msg['From'] = "test@yourdomain.com"
msg['To'] = "recipient@example.com"

with smtplib.SMTP('localhost', 587) as server:
    server.send_message(msg)
```

### Проверка DNS записей:

```bash
# Проверка MX записи
dig MX yourdomain.com

# Проверка SPF записи  
dig TXT yourdomain.com

# Проверка DMARC записи
dig TXT _dmarc.yourdomain.com
```

## Мониторинг и логирование

### Важные метрики:
- Количество отправленных писем
- Процент доставки
- Отклоненные письма
- Размер очереди

### Логи Poste.io:
```bash
# Просмотр логов почты
docker exec streamcash_mail tail -f /data/logs/mail.log

# Просмотр логов веб-интерфейса
docker exec streamcash_mail tail -f /data/logs/admin.log
```

## Решение проблем

### Письма не отправляются:
1. Проверьте настройки SMTP
2. Убедитесь, что сервис запущен
3. Проверьте логи
4. Проверьте DNS записи

### Письма попадают в спам:
1. Настройте SPF запись
2. Настройте DKIM
3. Настройте DMARC
4. Проверьте репутацию IP

### Проблемы с SSL:
1. Убедитесь, что сертификаты действительны
2. Проверьте права доступ к файлам сертификатов
3. Перезапустите сервис после обновления сертификатов

## Полезные ссылки

- [Poste.io документация](https://poste.io/)
- [MailHog GitHub](https://github.com/mailhog/MailHog)
- [Тестирование SPF/DKIM/DMARC](https://www.mail-tester.com/)
- [DNS записи для почты](https://support.google.com/a/answer/174125)

---

💡 **Совет:** Начните с MailHog для разработки, а затем переходите на Poste.io для продакшена!