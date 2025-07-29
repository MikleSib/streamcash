'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { streamerAPI } from '@/lib/api';
import { api } from '@/lib/api';

interface Streamer {
  id: number;
  name: string;
  url: string;
  current_donations: number;
  total_donations: number;
  description?: string;
  avatar_url?: string;
}

interface AlertTier {
  id: string;
  name: string;
  min_amount: number;
  max_amount?: number;
  sound_enabled: boolean;
  sound_file_url?: string;
  visual_enabled: boolean;
  alert_duration: number;
  text_color: string;
  background_color: string;
  font_size: number;
  animation_enabled: boolean;
  animation_type: string;
  gif_urls: string[];
  text_template: string;
  elements: any[];
}

interface DonationData {
  donor_name: string;
  amount: number;
  message: string;
  payment_method: string;
  is_anonymous: boolean;
}

function DonationContent() {
  const params = useParams();
  const router = useRouter();
  const donationUrl = params.url as string;
  
  const [streamer, setStreamer] = useState<Streamer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [donationData, setDonationData] = useState<DonationData>({
    donor_name: '',
    amount: 100,
    message: '',
    payment_method: 'test',
    is_anonymous: false
  });
  const [alertTiers, setAlertTiers] = useState<AlertTier[]>([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadStreamerData();
  }, [donationUrl]);

  const loadStreamerData = async () => {
    try {
      const response = await streamerAPI.getByUrl(donationUrl);
      setStreamer(response.data);
      
      try {
        const alertResponse = await api.get(`/alerts/streamer/${donationUrl}`);
        console.log('Alert response status:', alertResponse.status);
        if (alertResponse.status === 200) {
          const alertData = alertResponse.data;
          console.log('Alert data received:', alertData);
          setAlertTiers(alertData.tiers || []);
          console.log('Alert tiers set:', alertData.tiers || []);
        } else {
          console.log('Alert response not ok:', alertResponse.statusText);
        }
      } catch (alertError) {
        console.error('Не удалось загрузить настройки алертов:', alertError);
      }
    } catch (error) {
      setError('Стример не найден');
    } finally {
      setLoading(false);
    }
  };

  const handleDonationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setDonationData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const response = await api.post('/donations/', {
        streamer_url: donationUrl,
        ...donationData
      });

      if (response.data.confirmation_url) {
        if (donationData.payment_method === 'tbank') {
          // Для Т-банка используем их iframe
          openTbankPayment(response.data.confirmation_url);
        } else {
          window.location.href = response.data.confirmation_url;
        }
      }
    } catch (error) {
      console.error('Ошибка при создании доната:', error);
      setError('Ошибка при создании доната');
    } finally {
      setProcessing(false);
    }
  };

  const openTbankPayment = (paymentUrl: string) => {
    // Создаем модальное окно для Т-банка
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const iframe = document.createElement('iframe');
    iframe.src = paymentUrl;
    iframe.style.cssText = `
      width: 90%;
      height: 90%;
      border: none;
      border-radius: 8px;
      background: white;
    `;

    const closeButton = document.createElement('button');
    closeButton.textContent = '✕';
    closeButton.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      background: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 20px;
      cursor: pointer;
      z-index: 10001;
    `;
    closeButton.onclick = () => {
      document.body.removeChild(modal);
    };

    modal.appendChild(closeButton);
    modal.appendChild(iframe);
    document.body.appendChild(modal);

    // Слушаем сообщения от iframe
    window.addEventListener('message', (event) => {
      if (event.origin.includes('tbank.ru') || event.origin.includes('tinkoff.ru')) {
        if (event.data.type === 'payment-success') {
          document.body.removeChild(modal);
          router.push('/donate/success');
        } else if (event.data.type === 'payment-failed') {
          document.body.removeChild(modal);
          router.push('/donate/failed');
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !streamer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Стример не найден'}
          </h1>
          <Button onClick={() => router.push('/')}>
            Вернуться на главную
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Донат для {streamer.name}
            </h1>
            <p className="text-gray-600">
              Поддержите стримера и получите особые привилегии!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ваше имя
              </label>
              <input
                type="text"
                name="donor_name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                value={donationData.donor_name}
                onChange={handleDonationChange}
                placeholder="Введите ваше имя"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сумма доната (₽)
              </label>
              <input
                type="number"
                name="amount"
                min="1"
                step="1"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                value={donationData.amount}
                onChange={handleDonationChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сообщение (необязательно)
              </label>
              <textarea
                name="message"
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                value={donationData.message}
                onChange={handleDonationChange}
                placeholder="Напишите сообщение стримеру..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Способ оплаты
              </label>
              <select
                name="payment_method"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                value={donationData.payment_method}
                onChange={handleDonationChange}
              >
                <option value="test">🧪 Тестовая оплата (для разработки)</option>
                <option value="tbank">🏦 Т-банк</option>
                <option value="yookassa">💳 YooKassa</option>
                <option value="sberbank">🏛️ Сбербанк</option>
                <option value="tinkoff">💳 Тинькофф</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_anonymous"
                id="is_anonymous"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={donationData.is_anonymous}
                onChange={handleDonationChange}
              />
              <label htmlFor="is_anonymous" className="ml-2 block text-sm text-gray-900">
                Анонимный донат
              </label>
            </div>

            <Button
              type="submit"
              disabled={processing}
              className="w-full py-4 text-lg font-semibold"
            >
              {processing ? 'Обработка...' : `Задонатить ${donationData.amount}₽`}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DonationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <DonationContent />
    </Suspense>
  );
} 