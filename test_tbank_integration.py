#!/usr/bin/env python3
"""
Простой тест для проверки T-Bank интеграции
"""

import asyncio
import httpx
import hashlib
import json

async def test_tbank_init():
    """Тестируем метод Init T-Bank API"""
    
    # Тестовые данные - реальный терминал StreamCash
    terminal_key = "1753782171950DEMO"
    password = "Hs%8cNP6W&hv%3!^"
    amount = 10000  # 100 рублей в копейках
    order_id = "test_order_123"
    description = "Тестовый платеж"
    
    # Создаем токен
    token_data = [
        {"Amount": str(amount)},
        {"Description": description},
        {"OrderId": order_id},
        {"SecretKey": password},
        {"TerminalKey": terminal_key}
    ]
    token_string = "".join([list(x.values())[0] for x in token_data])
    token = hashlib.sha256(token_string.encode('utf-8')).hexdigest()
    
    print(f"Token string: {token_string}")
    print(f"Generated token: {token}")
    
    # Данные запроса
    data = {
        "TerminalKey": terminal_key,
        "Amount": amount,
        "OrderId": order_id,
        "Description": description,
        "Token": token,
        "Language": "ru",
        "DATA": {
            "connection_type": "Widget"
        }
    }
    
    print("Отправляем запрос к T-Bank API...")
    print(f"URL: https://securepay.tinkoff.ru/v2/Init")
    print(f"Data: {json.dumps(data, indent=2, ensure_ascii=False)}")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "https://securepay.tinkoff.ru/v2/Init",
                json=data,
                headers={"Content-Type": "application/json"},
                timeout=30.0
            )
            
            print(f"\nСтатус ответа: {response.status_code}")
            print(f"Ответ: {response.text}")
            
            if response.status_code == 200:
                result = response.json()
                if result.get("Success"):
                    print(f"\n✅ Успешно! PaymentId: {result.get('PaymentId')}")
                    print(f"PaymentURL: {result.get('PaymentURL')}")
                else:
                    print(f"\n❌ Ошибка: {result.get('Message')}")
            else:
                print(f"\n❌ HTTP ошибка: {response.status_code}")
                
        except Exception as e:
            print(f"\n❌ Исключение: {e}")

if __name__ == "__main__":
    asyncio.run(test_tbank_init()) 