'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
// import TbankPayment from '@/components/TbankPayment';

// Временная заглушка для TbankPayment
const TbankPayment = ({ amount, orderId, donorName, description, onSuccess, onError, onClose }: any) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl p-8 max-w-md w-full">
      <h3 className="text-xl font-bold mb-4">T-Bank Payment (Тест)</h3>
      <div className="space-y-2 mb-6">
        <p>Сумма: {amount} ₽</p>
        <p>Заказ: {orderId}</p>
        <p>Донатер: {donorName}</p>
        <p>Описание: {description}</p>
      </div>
      <div className="flex gap-4">
        <Button onClick={onSuccess} className="flex-1 bg-green-600 hover:bg-green-700">
          Успех
        </Button>
        <Button onClick={() => onError('Тестовая ошибка')} className="flex-1 bg-red-600 hover:bg-red-700">
          Ошибка
        </Button>
        <Button onClick={onClose} variant="outline" className="flex-1">
          Закрыть
        </Button>
      </div>
    </div>
  </div>
);

export default function TbankTestPage() {
  const [showPayment, setShowPayment] = useState(false);
  const [testData, setTestData] = useState({
    amount: 100,
    orderId: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    donorName: 'Тестовый пользователь'
  });

  const handleTestPayment = () => {
    setShowPayment(true);
  };

  const handleSuccess = () => {
    setShowPayment(false);
    alert('Платеж успешно создан!');
  };

  const handleError = (error: string) => {
    setShowPayment(false);
    alert(`Ошибка: ${error}`);
  };

  const handleClose = () => {
    setShowPayment(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Тест T-Bank интеграции
          </h1>
          <p className="text-gray-600">
            Проверка создания платежа с токеном
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Сумма (₽)
            </label>
            <input
              type="number"
              value={testData.amount}
              onChange={(e) => setTestData(prev => ({ ...prev, amount: parseInt(e.target.value) || 100 }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Имя донатера
            </label>
            <input
              type="text"
              value={testData.donorName}
              onChange={(e) => setTestData(prev => ({ ...prev, donorName: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID заказа
            </label>
            <input
              type="text"
              value={testData.orderId}
              onChange={(e) => setTestData(prev => ({ ...prev, orderId: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <Button
          onClick={handleTestPayment}
          className="w-full py-4 text-lg font-semibold"
        >
          Тестировать T-Bank платеж
        </Button>

        <div className="mt-4 text-sm text-gray-600">
          <p>Сумма: {testData.amount} ₽</p>
          <p>Заказ: {testData.orderId}</p>
          <p>Донатер: {testData.donorName}</p>
        </div>
      </div>

      {showPayment && (
        <TbankPayment
          amount={testData.amount}
          orderId={testData.orderId}
          donorName={testData.donorName}
          description="Тестовый донат"
          onSuccess={handleSuccess}
          onError={handleError}
          onClose={handleClose}
        />
      )}
    </div>
  );
} 