'use client';

import { useEffect, useRef } from 'react';

interface TbankPaymentProps {
  terminalKey: string;
  amount: number;
  orderId: string;
  description: string;
  onSuccess: () => void;
  onError: (error: string) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    PaymentIntegration: any;
  }
}

export default function TbankPayment({
  terminalKey,
  amount,
  orderId,
  description,
  onSuccess,
  onError,
  onClose
}: TbankPaymentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;

    // Загружаем скрипт Т-банка
    const script = document.createElement('script');
    script.src = 'https://acq-paymentform-integrationjs.t-static.ru/integration.js';
    script.async = true;
    script.onload = () => {
      scriptLoaded.current = true;
      initializePayment();
    };
    script.onerror = () => {
      onError('Не удалось загрузить платежную форму Т-банка');
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const initializePayment = async () => {
    try {
      if (!window.PaymentIntegration) {
        onError('Платежная система Т-банка недоступна');
        return;
      }

      const initConfig = {
        terminalKey: terminalKey,
        product: 'eacq',
        features: {
          iframe: {
            container: containerRef.current,
            paymentStartCallback: async () => {
              // Здесь должен быть вызов к вашему backend для инициирования платежа
              const response = await fetch('/api/v1/payments/tbank/init', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  TerminalKey: terminalKey,
                  Amount: amount * 100, // в копейках
                  OrderId: orderId,
                  Description: description,
                  Language: 'ru',
                  NotificationURL: `${window.location.origin}/api/v1/payments/webhook/tbank`,
                  SuccessURL: `${window.location.origin}/donate/success`,
                  FailURL: `${window.location.origin}/donate/failed`,
                  Receipt: {
                    Email: 'donations@streamcash.ru',
                    Taxation: 'usn_income',
                    Items: [
                      {
                        Name: description,
                        Price: amount * 100,
                        Quantity: 1.00,
                        Amount: amount * 100,
                        Tax: 'none'
                      }
                    ]
                  }
                })
              });

              const result = await response.json();
              return result.PaymentURL;
            },
          },
        },
      };

      const integration = await window.PaymentIntegration.init(initConfig);
      
      // Слушаем события платежа
      integration.on('payment-success', () => {
        onSuccess();
      });

      integration.on('payment-failed', (error: any) => {
        onError(error.message || 'Платеж не удался');
      });

    } catch (error) {
      console.error('Ошибка инициализации Т-банка:', error);
      onError('Ошибка инициализации платежной системы');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl h-3/4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Оплата через Т-банк</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="flex-1">
          <div ref={containerRef} className="w-full h-full min-h-[400px]" />
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>Сумма к оплате: {amount} ₽</p>
          <p>Номер заказа: {orderId}</p>
        </div>
      </div>
    </div>
  );
} 