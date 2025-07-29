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
        if not settings.TBANK_TERMINAL or not settings.TBANK_PASSWORD:
            raise ValueError("T-Bank credentials not configured")
        
        import uuid
        order_id = str(uuid.uuid4())
        
        # Согласно документации T-Bank, используем правильный endpoint
        url = "https://securepay.tinkoff.ru/v2/Init"
        
        # Подготавливаем URL для уведомлений
        api_url = settings.API_URL
        frontend_url = settings.FRONTEND_URL
        
        # Создаем токен для подписи запроса
        import hashlib
        token_data = [
            {"Amount": str(int(amount * 100))},
            {"Description": description},
            {"OrderId": order_id},
            {"SecretKey": settings.TBANK_PASSWORD},
            {"TerminalKey": settings.TBANK_TERMINAL}
        ]
        token_string = "".join([list(x.values())[0] for x in token_data])
        token = hashlib.sha256(token_string.encode('utf-8')).hexdigest()
        
        # Создаем данные для запроса согласно документации T-Bank
        data = {
            "TerminalKey": settings.TBANK_TERMINAL,
            "Amount": int(amount * 100),  # Сумма в копейках
            "OrderId": order_id,
            "Description": description,
            "Token": token,
            "Language": "ru",
            "NotificationURL": f"{api_url}{settings.API_V1_STR}/payments/webhook/tbank",
            "SuccessURL": f"{frontend_url}/donate/success",
            "FailURL": f"{frontend_url}/donate/failed",
            "DATA": {
                "connection_type": "Widget"  # Обязательный параметр для виджета
            }
        }
        
        # Добавляем чек если требуется
        if hasattr(settings, 'TBANK_RECEIPT_ENABLED') and settings.TBANK_RECEIPT_ENABLED:
            data["Receipt"] = {
                "Email": "donations@streamcash.ru",
                "Taxation": "usn_income",
                "Items": [
                    {
                        "Name": description,
                        "Price": int(amount * 100),
                        "Quantity": 1.00,
                        "Amount": int(amount * 100),
                        "Tax": "none"
                    }
                ]
            }
        
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        async with httpx.AsyncClient() as client:
            try:
                print(f"T-Bank API request to: {url}")
                print(f"T-Bank API data: {data}")
                
                response = await client.post(url, json=data, headers=headers, timeout=30.0)
                print(f"T-Bank API response status: {response.status_code}")
                print(f"T-Bank API response: {response.text}")
                
                if response.status_code == 200:
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
                        error_message = result.get("Message", "Unknown error")
                        raise Exception(f"T-Bank payment creation failed: {error_message}")
                else:
                    raise Exception(f"T-Bank API HTTP error: {response.status_code}")
                        
            except Exception as e:
                print(f"T-Bank API error: {e}")
                
                # Fallback на тестовую страницу при ошибках
                return {
                    "id": order_id,
                    "status": "pending",
                    "confirmation_url": f"{frontend_url}/donate/tbank-test?order_id={order_id}&amount={amount}",
                    "amount": amount,
                    "currency": "RUB"
                }

    async def check_payment_status(self, payment_id: str) -> str:
        try:
            payment = Payment.find_one(payment_id)
            return payment.status
        except Exception:
            return "unknown" 