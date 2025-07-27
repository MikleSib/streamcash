'use client';

import { Button } from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';

export default function DonationSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Спасибо за донат!
          </h1>
          <p className="text-gray-600">
            Ваш донат успешно отправлен. Стример получит уведомление!
          </p>
        </div>
        
        <Button 
          onClick={() => window.location.href = '/'}
          className="w-full"
        >
          Вернуться на главную
        </Button>
      </div>
    </div>
  );
} 