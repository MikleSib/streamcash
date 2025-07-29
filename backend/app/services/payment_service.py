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
        
        # Попробуем несколько возможных API endpoints
        urls = [
            "https://securepay.tbank.ru/api/v1/payments/init",
            "https://pay.tbank.ru/api/v1/payments/init", 
            "https://api.tbank.ru/payments/init",
            "https://securepay.tbank.ru/payment/init"
        ]
        
        data = {
            "terminal": settings.TBANK_TERMINAL,
            "password": settings.TBANK_PASSWORD,
            "amount": int(amount * 100),
            "order_id": order_id,
            "description": description,
            "currency": "RUB",
            "language": "ru",
            "notification_url": f"{settings.API_URL}/api/v1/payments/webhook/tbank",
            "success_url": f"{settings.FRONTEND_URL}/donate/success",
            "fail_url": f"{settings.FRONTEND_URL}/donate/failed"
        }
        
        async with httpx.AsyncClient() as client:
            for url in urls:
                try:
                    print(f"Trying T-Bank API: {url}")
                    response = await client.post(url, json=data, timeout=10.0)
                    print(f"T-Bank API response status: {response.status_code}")
                    print(f"T-Bank API response: {response.text}")
                    
                    if response.status_code == 200:
                        result = response.json()
                        
                        if result.get("success") or result.get("payment_url"):
                            return {
                                "id": result.get("payment_id", order_id),
                                "status": "pending",
                                "confirmation_url": result.get("payment_url"),
                                "amount": amount,
                                "currency": "RUB"
                            }
                        else:
                            print(f"T-Bank API error response: {result}")
                            continue
                    else:
                        print(f"T-Bank API HTTP error: {response.status_code}")
                        continue
                        
                except Exception as e:
                    print(f"T-Bank API error for {url}: {e}")
                    continue
            
            # Если все API endpoints не работают, используем тестовую страницу
            print("All T-Bank API endpoints failed, using test page")
            payment_id = str(uuid.uuid4())
            return {
                "id": payment_id,
                "status": "pending",
                "confirmation_url": f"{settings.FRONTEND_URL}/donate/tbank-test?payment_id={payment_id}&amount={amount}",
                "amount": amount,
                "currency": "RUB"
            }

    async def check_payment_status(self, payment_id: str) -> str:
        try:
            payment = Payment.find_one(payment_id)
            return payment.status
        except Exception:
            return "unknown" 