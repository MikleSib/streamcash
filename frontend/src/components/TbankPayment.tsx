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
  const [showDemoForm, setShowDemoForm] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    const initTbankPayment = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ждем загрузки скрипта T-Bank
        if (!window.PaymentIntegration) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://acq-paymentform-integrationjs.t-static.ru/integration.js';
            script.async = true;
            script.onload = () => {
              // Даем время скрипту инициализироваться
              setTimeout(resolve, 1000);
            };
            script.onerror = () => {
              reject(new Error('Ошибка загрузки платежного виджета'));
            };
            document.head.appendChild(script);
          });
        }

        // Проверяем еще раз после загрузки
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
                      payment_method: 'tbank',
                      description: `Донат ${amount} ₽`
                    }),
                  });

                  if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || 'Ошибка инициализации платежа');
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
                  console.log('T-Bank widget loaded');
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
                    console.log('T-Bank dialog closed');
                    onClose?.();
                  }
                },
                alert: {
                  showAlertCallback: (alert: any) => {
                    console.log('T-Bank alert:', alert);
                    if (alert.type === 'error') {
                      onError?.(alert.message || 'Ошибка платежа');
                    }
                  }
                },
                payment: {
                  failedPaymentStartCallback: (error: any) => {
                    console.error('Payment start failed:', error);
                    onError?.(error.message || 'Ошибка инициализации платежа');
                  }
                }
              }
            }
          }
        };

        console.log('Initializing T-Bank integration...');
        
        // Инициализация интеграции
        const integration = await window.PaymentIntegration.init(initConfig);
        console.log('T-Bank integration initialized:', integration);
        
        // Получаем объект платежной интеграции
        const paymentIntegration = await integration.payments.get('main-integration');
        console.log('Payment integration object:', paymentIntegration);
        
        // Устанавливаем доступные методы оплаты согласно настройкам терминала
        const availableWidgetTypes = ['sbp', 'mirpay', 'sberpay', 'bnpl', 'tpay'];
        await paymentIntegration.updateWidgetTypes(availableWidgetTypes);
        console.log('Widget types updated:', availableWidgetTypes);
        
        // Даем время виджету отрендериться
        setTimeout(() => {
          // Проверяем, есть ли содержимое в контейнере
          const container = containerRef.current;
          if (container && container.children.length === 0) {
            console.warn('Widget container is empty, showing demo form');
            // Показываем демо-форму вместо ошибки
            setLoading(false);
            setError(null);
            setShowDemoForm(true);
          } else {
            setLoading(false);
          }
        }, 3000);

      } catch (err) {
        console.error('T-Bank integration error:', err);
        setError(err instanceof Error ? err.message : 'Ошибка инициализации платежа');
        setLoading(false);
        
        // Fallback: показываем простую форму оплаты
        setTimeout(() => {
          if (error) {
            setError('T-Bank недоступен. Используйте тестовую страницу для демонстрации.');
          }
        }, 3000);
      }
    };

    initTbankPayment();

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [amount, orderId, onSuccess, onError, onClose]);

  return (
    <div className="tbank-modal" onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose?.();
      }
    }}>
      <div className="tbank-modal-content">
        <div className="tbank-modal-header">
          <h3 className="text-lg font-semibold text-gray-900">Оплата через T-Bank</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
            aria-label="Закрыть"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="tbank-modal-body">
          {loading && (
            <div className="tbank-loading">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Загрузка платежной формы...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="tbank-error">
              <div className="text-center">
                <div className="text-red-600 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-sm font-medium">{error}</p>
                </div>
                              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Попробовать снова
                </button>
                <button
                  onClick={() => {
                    const testUrl = `/donate/tbank-test?order_id=${orderId}&amount=${amount}`;
                    window.open(testUrl, '_blank');
                  }}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Тестовая страница
                </button>
              </div>
              </div>
            </div>
          )}

          {showDemoForm ? (
            <div className="tbank-demo-form">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Демо-форма оплаты</h4>
                <p className="text-gray-600">T-Bank виджет недоступен в демо-режиме</p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-green-600 font-bold">СБП</span>
                      </div>
                      <span className="text-sm font-medium">Система быстрых платежей</span>
                    </div>
                  </button>
                  
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-blue-600 font-bold">TP</span>
                      </div>
                      <span className="text-sm font-medium">Tinkoff Pay</span>
                    </div>
                  </button>
                  
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-purple-600 font-bold">MP</span>
                      </div>
                      <span className="text-sm font-medium">MirPay</span>
                    </div>
                  </button>
                  
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-red-600 font-bold">SP</span>
                      </div>
                      <span className="text-sm font-medium">SberPay</span>
                    </div>
                  </button>
                </div>
                
                <div className="text-center">
                  <button
                    onClick={() => {
                      const testUrl = `/donate/tbank-test?order_id=${orderId}&amount=${amount}`;
                      window.open(testUrl, '_blank');
                    }}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Перейти к тестовой странице
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div 
              ref={containerRef} 
              className="tbank-payment-container"
              style={{ 
                display: loading || error ? 'none' : 'block'
              }}
            />
          )}
        </div>

        <div className="tbank-modal-footer">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Сумма к оплате: <span className="font-semibold text-gray-900">{amount} ₽</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Номер заказа: {orderId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 