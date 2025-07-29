'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  useEffect(() => {
    // Получаем информацию о платеже из URL параметров
    const paymentId = searchParams.get('paymentId');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    
    if (paymentId || orderId || amount) {
      setPaymentInfo({
        paymentId,
        orderId,
        amount: amount ? parseFloat(amount) : null
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Оплата прошла успешно!
            </h1>
            <p className="text-gray-600">
              Спасибо за ваш донат! Ваша поддержка очень важна для стримера.
            </p>
          </div>

          {paymentInfo && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Детали платежа:</h3>
              <div className="space-y-1 text-sm text-gray-600">
                {paymentInfo.amount && (
                  <p>Сумма: <span className="font-medium">{paymentInfo.amount} ₽</span></p>
                )}
                {paymentInfo.orderId && (
                  <p>Номер заказа: <span className="font-medium">{paymentInfo.orderId}</span></p>
                )}
                {paymentInfo.paymentId && (
                  <p>ID платежа: <span className="font-medium">{paymentInfo.paymentId}</span></p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/')}
              className="w-full py-3"
            >
              Вернуться на главную
            </Button>
            <Button 
              onClick={() => router.back()}
              variant="outline"
              className="w-full py-3"
            >
              Назад к донату
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 