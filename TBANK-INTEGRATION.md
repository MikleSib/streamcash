# Интеграция T-Bank для StreamCash

Данная документация описывает интеграцию платежной системы T-Bank в проект StreamCash согласно официальной документации T-Bank.

## 📋 Требования

### Системные требования
- Сайт должен работать по протоколу HTTPS
- Отсутствие заголовка `Cross-Origin-Opener-Policy: *`
- Настройка CSP политик для разрешения доменов T-Bank

### Поддерживаемые браузеры
- Chrome >= 63
- Edge >= 19
- Safari >= 11
- Firefox >= 67
- Opera >= 50
- Samsung Internet >= 8.2
- Opera Mobile >= 73

## 🔧 Настройка CSP

Добавьте следующие директивы в ваши CSP политики:

```html
Content-Security-Policy: 
  script-src: https://*.tinkoff.ru https://*.tcsbank.ru https://*.tbank.ru https://*.nspk.ru https://*.t-static.ru;
  frame-src: https://*.tinkoff.ru https://*.tcsbank.ru https://*.tbank.ru https://*.nspk.ru https://*.t-static.ru;
  img-src: https://*.tinkoff.ru https://*.tcsbank.ru https://*.tbank.ru https://*.nspk.ru https://*.t-static.ru;
  connect-src: https://*.tinkoff.ru https://*.tcsbank.ru https://*.tbank.ru https://*.nspk.ru https://*.t-static.ru;
  style-src: 'unsafe-inline' https://*.tinkoff.ru https://*.tcsbank.ru https://*.tbank.ru https://*.nspk.ru https://*.t-static.ru;
```

## 🏦 Получение ключей T-Bank

1. Зарегистрируйтесь в личном кабинете T-Bank
2. Перейдите в раздел "Магазины"
3. Выберите ваш магазин
4. Во вкладке "Терминалы" найдите публичный ключ терминала (TerminalKey)
5. Настройте тип подключения "Универсальный"
6. Включите нужные способы оплаты на вкладке "Способы оплаты"

## ⚙️ Конфигурация

### Переменные окружения

Добавьте в ваш `.env` файл:

```env
# T-Bank настройки
TBANK_TERMINAL=your_terminal_key_here
TBANK_PASSWORD=your_password_here
TBANK_RECEIPT_ENABLED=false

# URL для уведомлений
FRONTEND_URL=https://your-domain.com
API_URL=https://api.your-domain.com
```

### Настройка терминала

1. **Для платежной формы T-Bank:**
   - Магазины → Способы оплаты → Выберите способ → Платежная форма Т-Банка → Включить

2. **Для виджета быстрой оплаты:**
   - Магазины → Способы оплаты → Выберите способ → Настроить → Своя платежная форма → Включить

## 🚀 Использование

### Backend API

Создание платежа:

```python
from app.services.payment_service import PaymentService

payment_service = PaymentService()
payment_data = await payment_service.create_payment(
    amount=100.0,
    description="Донат для стримера",
    payment_method=PaymentMethod.TBANK
)
```

### Frontend интеграция

```typescript
import TbankPayment from '@/components/TbankPayment';

// Использование компонента
<TbankPayment
  amount={100}
  orderId="order_123"
  onSuccess={() => console.log('Payment successful')}
  onError={(error) => console.error('Payment failed:', error)}
  onClose={() => console.log('Payment closed')}
/>
```

## 📡 Webhook обработка

T-Bank отправляет уведомления на endpoint `/api/v1/payments/webhook/tbank`

### Статусы платежей

- `CONFIRMED` - платеж подтвержден
- `CANCELLED` - платеж отменен
- `REVERSED` - платеж возвращен
- `REFUNDED` - платеж возвращен полностью
- `PARTIAL_REFUNDED` - платеж возвращен частично

## 🧪 Тестирование

### Тестовая страница

Доступна по адресу: `/donate/tbank-test?order_id=123&amount=100`

### Демо ключи

Для тестирования используйте демо ключи:
- TerminalKey: `1753782171950DEMO`
- Password: `Hs%8cNP6W&hv%3!^`

## 🔒 Безопасность

### Обязательные параметры

При создании платежа обязательно передавайте:

```json
{
  "DATA": {
    "connection_type": "Widget"
  }
}
```

### Валидация webhook

Всегда проверяйте подпись webhook уведомлений от T-Bank для обеспечения безопасности.

## 📊 Мониторинг

### Логирование

Все запросы к T-Bank API логируются с детальной информацией:

```python
print(f"T-Bank API request to: {url}")
print(f"T-Bank API data: {data}")
print(f"T-Bank API response: {response.text}")
```

### Обработка ошибок

Система автоматически обрабатывает ошибки и предоставляет fallback на тестовую страницу при недоступности T-Bank API.

## 🎯 Поддерживаемые методы оплаты

- **T-Pay** - быстрая оплата через T-Bank
- **СБП** - Система быстрых платежей
- **MirPay** - оплата через MirPay (только Android)
- **SberPay** - оплата через SberPay (не отображается в WebView)

## 📝 Примеры

### Полная интеграция

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>T-Bank Payment</title>
</head>
<body>
    <div id="paymentContainer"></div>
    
    <script src="https://acq-paymentform-integrationjs.t-static.ru/integration.js" onload="onPaymentIntegrationLoad()" async></script>
    <script>
        const initConfig = {
            terminalKey: 'your_terminal_key',
            product: 'eacq',
            features: {
                payment: {
                    container: document.getElementById('paymentContainer'),
                    paymentStartCallback: async () => {
                        const response = await fetch('/api/v1/payments/init', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                amount: 100,
                                order_id: 'order_123',
                                payment_method: 'tbank'
                            })
                        });
                        const result = await response.json();
                        return result.payment_url;
                    }
                }
            }
        };
        
        function onPaymentIntegrationLoad() {
            PaymentIntegration.init(initConfig).then().catch();
        }
    </script>
</body>
</html>
```

## 🆘 Поддержка

При возникновении проблем:

1. Проверьте логи приложения
2. Убедитесь в правильности настроек CSP
3. Проверьте доступность T-Bank API
4. Обратитесь к официальной документации T-Bank

## 📚 Дополнительные ресурсы

- [Официальная документация T-Bank](https://www.tbank.ru/kassa/dev/)
- [API Reference](https://www.tbank.ru/kassa/dev/payments/)
- [Интеграция виджетов](https://www.tbank.ru/kassa/dev/integration/) 