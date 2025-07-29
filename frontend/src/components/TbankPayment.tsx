'use client';

import React, { useEffect, useRef, useState } from 'react';

interface TbankPaymentProps {
  amount: number;
  orderId: string;
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  description?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    pay: (form: HTMLFormElement) => void;
  }
}

export default function TbankPayment({ 
  amount, 
  orderId, 
  donorName = '',
  donorEmail = '',
  donorPhone = '',
  description = 'Донат',
  onSuccess, 
  onError, 
  onClose 
}: TbankPaymentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentToken, setPaymentToken] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Блокируем прокрутку body
    document.body.style.overflow = 'hidden';

    // Обработчик клавиши Escape
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);

    // Загружаем скрипт T-Bank виджета
    const loadTbankScript = () => {
      return new Promise<void>((resolve, reject) => {
        // Проверяем, не загружен ли уже скрипт
        if (typeof window.pay === 'function') {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://securepay.tinkoff.ru/html/payForm/js/tinkoff_v2.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Не удалось загрузить T-Bank виджет'));
        document.head.appendChild(script);
      });
    };

    // Инициализируем виджет
    const initWidget = async () => {
      try {
        setLoading(true);
        setError(null);

        await loadTbankScript();

        // Даем время скрипту инициализироваться
        setTimeout(() => {
          setLoading(false);
        }, 1000);

      } catch (err) {
        console.error('Ошибка инициализации T-Bank виджета:', err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки платежной формы');
        setLoading(false);
      }
    };

    initWidget();

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formRef.current) return;

    try {
      // Используем виджет напрямую без создания платежа через API
      console.log('Using T-Bank widget directly');
      window.pay(formRef.current);
    } catch (err) {
      console.error('Ошибка при отправке формы:', err);
      setError('Ошибка при отправке платежа');
      onError?.('Ошибка при отправке платежа');
    }
  };

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
                    onClick={onClose}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 ml-2"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="tbank-widget-container">
              {/* Стили для T-Bank виджета */}
              <style jsx>{`
                .payform-tbank {
                  display: flex;
                  margin: 2px auto;
                  flex-direction: column;
                  max-width: 400px;
                }
                .payform-tbank-row {
                  margin: 2px;
                  border-radius: 4px;
                  flex: 1;
                  transition: 0.3s;
                  border: 1px solid #DFE3F3;
                  padding: 15px;
                  outline: none;
                  background-color: #DFE3F3;
                  font-size: 15px;
                }
                .payform-tbank-row:focus {
                  background-color: #FFFFFF;
                  border: 1px solid #616871;
                  border-radius: 4px;
                }
                .payform-tbank-btn {
                  background-color: #FBC520;
                  border: 1px solid #FBC520;
                  color: #3C2C0B;
                  cursor: pointer;
                }
                .payform-tbank-btn:hover {
                  background-color: #FAB619;
                  border: 1px solid #FAB619;
                }
                .payform-tbank-btn:disabled {
                  background-color: #ccc;
                  border: 1px solid #ccc;
                  cursor: not-allowed;
                }
              `}</style>

              {/* T-Bank виджет форма */}
              <form 
                ref={formRef}
                className="payform-tbank" 
                name="payform-tbank" 
                onSubmit={handleSubmit}
              >
                <input 
                  className="payform-tbank-row" 
                  type="hidden" 
                  name="terminalkey" 
                  value="1753782171950DEMO"
                />
                <input 
                  className="payform-tbank-row" 
                  type="hidden" 
                  name="frame" 
                  value="true"
                />
                <input 
                  className="payform-tbank-row" 
                  type="hidden" 
                  name="language" 
                  value="ru"
                />
                <input 
                  className="payform-tbank-row" 
                  type="hidden" 
                  name="amount" 
                  value={amount * 100}
                  readOnly
                />
                <input 
                  className="payform-tbank-row" 
                  type="hidden" 
                  name="order" 
                  value={orderId}
                  readOnly
                />
                <input 
                  className="payform-tbank-row" 
                  type="hidden" 
                  name="description" 
                  value={description}
                  readOnly
                />
                
                {donorName && (
                  <input 
                    className="payform-tbank-row" 
                    type="text" 
                    placeholder="ФИО плательщика" 
                    name="name" 
                    defaultValue={donorName}
                    readOnly
                  />
                )}
                
                {donorEmail && (
                  <input 
                    className="payform-tbank-row" 
                    type="email" 
                    placeholder="E-mail" 
                    name="email" 
                    defaultValue={donorEmail}
                    readOnly
                  />
                )}
                
                {donorPhone && (
                  <input 
                    className="payform-tbank-row" 
                    type="tel" 
                    placeholder="Контактный телефон" 
                    name="phone" 
                    defaultValue={donorPhone}
                    readOnly
                  />
                )}

                {/* Дополнительные данные */}
                <input 
                  className="payform-tbank-row" 
                  type="hidden" 
                  name="DATA" 
                  value={`DonorName=${donorName} | OrderId=${orderId}`}
                />

                <input 
                  className="payform-tbank-row payform-tbank-btn" 
                  type="submit" 
                  value={`Оплатить ${amount} ₽`}
                  disabled={loading}
                />
              </form>

              <div className="text-center mt-4 text-sm text-gray-600">
                <p>Сумма к оплате: {amount} ₽</p>
                <p>Номер заказа: {orderId}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 