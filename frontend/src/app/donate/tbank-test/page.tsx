'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function TbankTestPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const paymentId = searchParams.get('payment_id');
  const amount = searchParams.get('amount');

  const simulateTbankPayment = async (status: string) => {
    setLoading(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/v1/payments/webhook/tbank`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_id: paymentId,
          status: status,
          amount: parseFloat(amount || '0')
        }),
      });

      if (response.ok) {
        if (status === 'Подтвержден') {
          router.push('/donate/success');
        } else {
          router.push('/donate/failed');
        }
      } else {
        alert('Ошибка при обработке платежа');
      }
    } catch (error) {
      console.error('T-Bank payment simulation error:', error);
      alert('Ошибка при симуляции платежа Т-банка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Тестовый платеж Т-банк</h1>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-2">ID платежа: <span className="font-mono">{paymentId}</span></p>
          <p className="text-gray-600 mb-2">Сумма: <span className="font-bold">{amount} ₽</span></p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => simulateTbankPayment('Резервируется')}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            {loading ? 'Обработка...' : 'Резервируется'}
          </Button>
          
          <Button
            onClick={() => simulateTbankPayment('Подтвержден')}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            {loading ? 'Обработка...' : 'Подтвержден'}
          </Button>
          
          <Button
            onClick={() => simulateTbankPayment('Отменен')}
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600"
          >
            {loading ? 'Обработка...' : 'Отменен'}
          </Button>
          
          <Button
            onClick={() => simulateTbankPayment('Возвращен')}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            {loading ? 'Обработка...' : 'Возвращен'}
          </Button>
          
          <Button
            onClick={() => simulateTbankPayment('Возвращен частично')}
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600"
          >
            {loading ? 'Обработка...' : 'Возвращен частично'}
          </Button>
          
          <Button
            onClick={() => simulateTbankPayment('Резервирование отменено')}
            disabled={loading}
            className="w-full bg-gray-500 hover:bg-gray-600"
          >
            {loading ? 'Обработка...' : 'Резервирование отменено'}
          </Button>
        </div>
      </div>
    </div>
  );
} 