'use client';

import { Button } from '@/components/ui/Button';
import { XCircle } from 'lucide-react';

export default function DonationFailedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="mb-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Оплата не прошла
          </h1>
          <p className="text-gray-600">
            Произошла ошибка при обработке платежа. Попробуйте еще раз.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={() => window.history.back()}
            className="w-full"
          >
            Попробовать снова
          </Button>
          
          <Button 
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="w-full"
          >
            Вернуться на главную
          </Button>
        </div>
      </div>
    </div>
  );
} 