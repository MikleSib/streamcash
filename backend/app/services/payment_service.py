import httpx
import json
from typing import Dict, Any
from yookassa import Configuration, Payment
from app.core.config import settings
from app.models.donation import PaymentMethod

class PaymentService:
    def __init__(self):
        if settings.YOOKASSA_SHOP_ID and settings.YOOKASSA_SECRET_KEY:
            Configuration.account_id = settings.YOOKASSA_SHOP_ID
            Configuration.secret_key = settings.YOOKASSA_SECRET_KEY

    async def create_payment(
        self, 
        amount: float, 
        description: str, 
        payment_method: PaymentMethod
    ) -> Dict[str, Any]:
        if payment_method == PaymentMethod.TEST:
            return await self._create_test_payment(amount, description)
        elif payment_method == PaymentMethod.YOOKASSA:
            return await self._create_yookassa_payment(amount, description)
        elif payment_method == PaymentMethod.TINKOFF:
            return await self._create_tinkoff_payment(amount, description)
        elif payment_method == PaymentMethod.SBERBANK:
            return await self._create_sberbank_payment(amount, description)
        elif payment_method == PaymentMethod.TBANK:
            return await self._create_tbank_payment(amount, description)
        else:
            raise ValueError(f"Unsupported payment method: {payment_method}")

    async def _create_test_payment(self, amount: float, description: str) -> Dict[str, Any]:
        import uuid
        fake_payment_id = str(uuid.uuid4())
        return {
            "id": fake_payment_id,
            "status": "pending",
            "confirmation_url": f"{settings.FRONTEND_URL}/donate/test-payment?payment_id={fake_payment_id}&amount={amount}",
            "amount": amount,
            "currency": "RUB"
        }

    async def _create_yookassa_payment(self, amount: float, description: str) -> Dict[str, Any]:
        if not settings.YOOKASSA_SHOP_ID or not settings.YOOKASSA_SECRET_KEY:
            import uuid
            fake_payment_id = str(uuid.uuid4())
            return {
                "id": fake_payment_id,
                "status": "pending",
                "confirmation_url": f"{settings.FRONTEND_URL}/donate/test-payment?payment_id={fake_payment_id}&amount={amount}",
                "amount": amount,
                "currency": "RUB"
            }
        
        try:
            payment = Payment.create({
                "amount": {
                    "value": str(amount),
                    "currency": "RUB"
                },
                "confirmation": {
                    "type": "redirect",
                    "return_url": f"{settings.FRONTEND_URL}/donation/success"
                },
                "capture": True,
                "description": description
            })
            
            return {
                "id": payment.id,
                "status": payment.status,
                "confirmation_url": payment.confirmation.confirmation_url,
                "amount": amount,
                "currency": "RUB"
            }
        except Exception as e:
            raise Exception(f"Failed to create YooKassa payment: {str(e)}")

    async def _create_tinkoff_payment(self, amount: float, description: str) -> Dict[str, Any]:
        if not settings.TINKOFF_TERMINAL_KEY:
            raise ValueError("Tinkoff credentials not configured")
        
        url = "https://securepay.tinkoff.ru/v2/Init"
        
        data = {
            "TerminalKey": settings.TINKOFF_TERMINAL_KEY,
            "Amount": int(amount * 100),
            "OrderId": f"order_{int(amount)}_{description[:10]}",
            "Description": description,
            "Language": "ru",
            "NotificationURL": f"{settings.API_URL}/api/v1/payments/webhook/tinkoff",
            "SuccessURL": f"{settings.FRONTEND_URL}/donation/success",
            "FailURL": f"{settings.FRONTEND_URL}/donation/failed"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=data)
            result = response.json()
            
            if result.get("Success"):
                return {
                    "id": result["PaymentId"],
                    "status": "pending",
                    "confirmation_url": result["PaymentURL"],
                    "amount": amount,
                    "currency": "RUB"
                }
            else:
                raise Exception(f"Tinkoff payment creation failed: {result}")

    async def _create_sberbank_payment(self, amount: float, description: str) -> Dict[str, Any]:
        if not settings.SBERBANK_USERNAME:
            raise ValueError("Sberbank credentials not configured")
        
        url = "https://securepayments.sberbank.ru/payment/rest/register.do"
        
        data = {
            "userName": settings.SBERBANK_USERNAME,
            "password": settings.SBERBANK_PASSWORD,
            "orderNumber": f"order_{int(amount)}_{description[:10]}",
            "amount": int(amount * 100),
            "currency": "643",
            "returnUrl": f"{settings.FRONTEND_URL}/donation/success",
            "failUrl": f"{settings.FRONTEND_URL}/donation/failed",
            "description": description
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, data=data)
            result = response.json()
            
            if result.get("errorCode") == 0:
                return {
                    "id": result["orderId"],
                    "status": "pending", 
                    "confirmation_url": result["formUrl"],
                    "amount": amount,
                    "currency": "RUB"
                }
            else:
                raise Exception(f"Sberbank payment creation failed: {result}")

    async def _create_tbank_payment(self, amount: float, description: str) -> Dict[str, Any]:
        """
        Создание платежа через T-Bank API с генерацией токена
        """
        if not settings.TBANK_TERMINAL:
            raise ValueError("T-Bank terminal not configured")
        
        import uuid
        import hashlib
        import time
        
        # Генерируем уникальный ID заказа
        order_id = f"order_{int(time.time() * 1000)}_{uuid.uuid4().hex[:8]}"
        
        # Подготавливаем данные для создания платежа
        payment_data = {
            "TerminalKey": settings.TBANK_TERMINAL,
            "Amount": int(amount * 100),  # T-Bank ожидает сумму в копейках
            "OrderId": order_id,
            "Description": description,
            "Language": "ru",
            "SuccessURL": f"{settings.FRONTEND_URL}/donate/success?orderId={order_id}&amount={amount}",
            "FailURL": f"{settings.FRONTEND_URL}/donate/failed?orderId={order_id}&amount={amount}",
            "NotificationURL": f"{settings.API_URL}/api/v1/payments/webhook/tbank",
            "DATA": {
                "connection_type": "API"
            }
        }
        
        # Генерируем токен для подписи согласно документации T-Bank
        # Создаем массив пар ключ-значение
        token_params = [
            {"Amount": str(payment_data['Amount'])},
            {"Description": payment_data['Description']},
            {"OrderId": payment_data['OrderId']},
            {"Password": settings.TBANK_PASSWORD},
            {"TerminalKey": payment_data['TerminalKey']}
        ]
        
        # Сортируем по алфавиту по ключу
        token_params.sort(key=lambda x: list(x.keys())[0])
        
        # Выводим отсортированные параметры для отладки
        print("🔍 Отсортированные параметры для токена:")
        for param in token_params:
            key = list(param.keys())[0]
            value = list(param.values())[0]
            print(f"   {key}: {value}")
        
        # Конкатенируем только значения
        token_string = ''.join([list(param.values())[0] for param in token_params])
        token = hashlib.sha256(token_string.encode('utf-8')).hexdigest()
        payment_data["Token"] = token
        
        print(f"T-Bank payment data: {payment_data}")
        
        # Отправляем запрос к T-Bank API
        url = "https://securepay.tinkoff.ru/v2/"
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payment_data)
                result = response.json()
                
                print(f"T-Bank API response: {result}")
                
                if result.get("Success"):
                    return {
                        "id": result.get("PaymentId", order_id),
                        "status": "pending",
                        "confirmation_url": result.get("PaymentURL"),
                        "amount": amount,
                        "currency": "RUB",
                        "order_id": order_id
                    }
                else:
                    error_msg = f"T-Bank payment creation failed: {result}"
                    print(error_msg)
                    raise Exception(error_msg)
                    
        except Exception as e:
            print(f"T-Bank API error: {str(e)}")
            raise Exception(f"T-Bank API error: {str(e)}")

    async def check_payment_status(self, payment_id: str) -> str:
        try:
            payment = Payment.find_one(payment_id)
            return payment.status
        except Exception:
            return "unknown" 