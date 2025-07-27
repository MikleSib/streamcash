'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function TestPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const paymentId = searchParams.get('payment_id');
  const amount = searchParams.get('amount');

  const simulatePayment = async (success: boolean) => {
    setLoading(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/v1/payments/webhook/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_id: paymentId,
          status: success ? 'succeeded' : 'failed',
          amount: parseFloat(amount || '0')
        }),
      });

      if (response.ok) {
        router.push(success ? '/donate/success' : '/donate/failed');
      } else {
        alert('Ошибка при обработке платежа');
      }
    } catch (error) {
      console.error('Payment simulation error:', error);
      alert('Ошибка при симуляции платежа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Тестовая оплата
          </h1>
          <p className="text-gray-600 mb-2">
            ID платежа: {paymentId}
          </p>
          <p className="text-gray-600 mb-6">
            Сумма: {amount} ₽
          </p>
          
          <div className="space-y-4">
            <Button
              onClick={() => simulatePayment(true)}
              loading={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Успешная оплата
            </Button>
            
            <Button
              onClick={() => simulatePayment(false)}
              loading={loading}
              variant="outline"
              className="w-full"
            >
              Неуспешная оплата
            </Button>
          </div>
          
          <p className="mt-4 text-xs text-gray-500">
            Это тестовая страница для разработки
          </p>
        </div>
      </div>
    </div>
  );
} 