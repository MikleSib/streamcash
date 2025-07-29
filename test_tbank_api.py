#!/usr/bin/env python3
"""
Тестовый скрипт для проверки T-Bank API интеграции
"""

import requests
import json
import hashlib
import time
import uuid

# Настройки
API_URL = "http://localhost:8000"
TBANK_TERMINAL = "1753782171950DEMO"
TBANK_SECRET_KEY = "Hs%8cNP6W&hv%3!^"

def test_tbank_init():
    """Тест создания платежа через наш API"""
    print("🧪 Тестирование T-Bank API через наш endpoint...")
    
    # Данные для теста
    test_data = {
        "amount": 100,
        "order_id": f"order_{int(time.time() * 1000)}_{uuid.uuid4().hex[:8]}",
        "payment_method": "tbank",
        "description": "Тестовый донат"
    }
    
    try:
        response = requests.post(
            f"{API_URL}/api/v1/payments/tbank/init",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"📡 Статус ответа: {response.status_code}")
        print(f"📄 Заголовки: {dict(response.headers)}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Успешный ответ: {json.dumps(result, indent=2, ensure_ascii=False)}")
            return result
        else:
            print(f"❌ Ошибка: {response.status_code}")
            print(f"📄 Ответ: {response.text}")
            return None
            
    except Exception as e:
        print(f"💥 Исключение: {e}")
        return None

def test_direct_tbank():
    """Прямой тест T-Bank API"""
    print("\n🔗 Прямой тест T-Bank API...")
    
    # Генерируем данные
    order_id = f"order_{int(time.time() * 1000)}_{uuid.uuid4().hex[:8]}"
    amount = 10000  # 100 рублей в копейках
    
    # Подготавливаем данные
    payment_data = {
        "TerminalKey": TBANK_TERMINAL,
        "Amount": amount,
        "OrderId": order_id,
        "Description": "Тестовый донат",
        "Language": "ru",
        "Frame": True,
        "DATA": {
            "connection_type": "Widget2.0"
        }
    }
    
    # Генерируем токен
    token_string = f"{payment_data['TerminalKey']}{payment_data['Amount']}{payment_data['OrderId']}{TBANK_SECRET_KEY}"
    token = hashlib.sha256(token_string.encode('utf-8')).hexdigest()
    payment_data["Token"] = token
    
    print(f"🔑 Сгенерированный токен: {token}")
    print(f"📦 Данные запроса: {json.dumps(payment_data, indent=2, ensure_ascii=False)}")
    
    try:
        response = requests.post(
            "https://securepay.tinkoff.ru/v2/Init",
            json=payment_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"📡 Статус ответа: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Успешный ответ: {json.dumps(result, indent=2, ensure_ascii=False)}")
            return result
        else:
            print(f"❌ Ошибка: {response.status_code}")
            print(f"📄 Ответ: {response.text}")
            return None
            
    except Exception as e:
        print(f"💥 Исключение: {e}")
        return None

def main():
    print("🚀 Запуск тестов T-Bank интеграции")
    print("=" * 50)
    
    # Тест 1: Наш API
    result1 = test_tbank_init()
    
    print("\n" + "=" * 50)
    
    # Тест 2: Прямой API
    result2 = test_direct_tbank()
    
    print("\n" + "=" * 50)
    print("📊 Результаты тестирования:")
    
    if result1:
        print("✅ Наш API работает корректно")
    else:
        print("❌ Наш API не работает")
        
    if result2:
        print("✅ Прямой T-Bank API работает корректно")
    else:
        print("❌ Прямой T-Bank API не работает")

if __name__ == "__main__":
    main() 