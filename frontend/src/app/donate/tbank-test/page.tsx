'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

function TbankTestPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const orderId = searchParams.get('order_id');
  const amount = searchParams.get('amount');

  const simulatePayment = async (success: boolean) => {
    setLoading(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/v1/payments/webhook/tbank`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          PaymentId: orderId,
          Status: success ? 'CONFIRMED' : 'CANCELLED',
          Amount: parseFloat(amount || '0') * 100,
          OrderId: orderId
        }),
      });

      if (response.ok) {
        router.push(success ? '/donate/success' : '/donate/failed');
      } else {
        alert('Ошибка при обработке платежа');
      }
    } catch (error) {
      console.error('T-Bank payment simulation error:', error);
      alert('Ошибка при симуляции платежа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Тестовый платеж T-Bank
          </h1>
          <p className="text-gray-600">
            Симуляция платежа через T-Bank
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Номер заказа:</span>
            <span className="font-mono text-sm">{orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Сумма:</span>
            <span className="font-bold text-lg">{amount} ₽</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => simulatePayment(true)}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
          >
            {loading ? 'Обработка...' : 'Успешный платеж'}
          </Button>
          
          <Button
            onClick={() => simulatePayment(false)}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
          >
            {loading ? 'Обработка...' : 'Отменить платеж'}
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Это тестовая страница для симуляции платежей T-Bank
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TbankTestPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <TbankTestPaymentContent />
    </Suspense>
  );
} 