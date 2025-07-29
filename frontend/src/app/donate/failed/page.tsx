'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function FailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorInfo, setErrorInfo] = useState<any>(null);

  useEffect(() => {
    // Получаем информацию об ошибке из URL параметров
    const error = searchParams.get('error');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    
    if (error || orderId || amount) {
      setErrorInfo({
        error,
        orderId,
        amount: amount ? parseFloat(amount) : null
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Оплата не прошла
            </h1>
            <p className="text-gray-600">
              К сожалению, произошла ошибка при обработке платежа. Попробуйте еще раз.
            </p>
          </div>

          {errorInfo && (
            <div className="bg-red-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-red-700 mb-2">Информация об ошибке:</h3>
              <div className="space-y-1 text-sm text-red-600">
                {errorInfo.error && (
                  <p>Ошибка: <span className="font-medium">{errorInfo.error}</span></p>
                )}
                {errorInfo.amount && (
                  <p>Сумма: <span className="font-medium">{errorInfo.amount} ₽</span></p>
                )}
                {errorInfo.orderId && (
                  <p>Номер заказа: <span className="font-medium">{errorInfo.orderId}</span></p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={() => router.back()}
              className="w-full py-3"
            >
              Попробовать снова
            </Button>
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full py-3"
            >
              Вернуться на главную
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 