'use client';

import { useEffect, useRef, useState } from 'react';

interface TbankPaymentProps {
  amount: number;
  orderId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    PaymentIntegration: any;
  }
}

export default function TbankPayment({ 
  amount, 
  orderId, 
  onSuccess, 
  onError, 
  onClose 
}: TbankPaymentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initTbankPayment = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ждем загрузки скрипта T-Bank
        if (!window.PaymentIntegration) {
          await new Promise<void>((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://acq-paymentform-integrationjs.t-static.ru/integration.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => {
              setError('Ошибка загрузки платежного виджета');
              resolve();
            };
            document.head.appendChild(script);
          });
        }

        if (!window.PaymentIntegration) {
          throw new Error('Не удалось загрузить платежный виджет');
        }

        // Конфигурация согласно документации T-Bank
        const initConfig = {
          terminalKey: '1753782171950DEMO', // Демо ключ, замените на реальный
          product: 'eacq',
          features: {
            payment: {
              container: containerRef.current,
              paymentStartCallback: async () => {
                try {
                  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                  const response = await fetch(`${apiUrl}/api/v1/payments/init`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      amount: amount,
                      order_id: orderId,
                      payment_method: 'tbank'
                    }),
                  });

                  if (!response.ok) {
                    throw new Error('Ошибка инициализации платежа');
                  }

                  const result = await response.json();
                  return result.payment_url;
                } catch (err) {
                  console.error('Payment start error:', err);
                  throw err;
                }
              },
              config: {
                loadedCallback: () => {
                  setLoading(false);
                },
                status: {
                  changedCallback: async (status: string) => {
                    console.log('Payment status changed:', status);
                    if (status === 'SUCCESS') {
                      onSuccess?.();
                    } else if (status === 'REJECTED' || status === 'CANCELED') {
                      onError?.('Платеж не был выполнен');
                    }
                  }
                },
                dialog: {
                  closedCallback: () => {
                    onClose?.();
                  }
                }
              }
            }
          }
        };

        // Инициализация интеграции
        const integration = await window.PaymentIntegration.init(initConfig);
        
        // Получаем объект платежной интеграции
        const paymentIntegration = await integration.payments.get('main-integration');
        
        // Устанавливаем доступные методы оплаты
        await paymentIntegration.updateWidgetTypes(['tpay', 'sbp', 'mirpay']);

      } catch (err) {
        console.error('T-Bank integration error:', err);
        setError(err instanceof Error ? err.message : 'Ошибка инициализации платежа');
        setLoading(false);
      }
    };

    initTbankPayment();
  }, [amount, orderId, onSuccess, onError, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Оплата через T-Bank</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Загрузка платежной формы...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Попробовать снова
            </button>
          </div>
        )}

        <div 
          ref={containerRef} 
          className="min-h-[200px]"
          style={{ display: loading || error ? 'none' : 'block' }}
        />

        <div className="mt-4 text-xs text-gray-500 text-center">
          Сумма к оплате: {amount} ₽
        </div>
      </div>
    </div>
  );
} 