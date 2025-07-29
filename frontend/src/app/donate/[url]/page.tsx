'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { streamerAPI } from '@/lib/api';
import { api } from '@/lib/api';

interface Streamer {
  id: number;
  display_name: string;
  donation_url: string;
  current_donations?: number;
  total_donations?: number;
  stream_description?: string;
  avatar_url?: string;
  donation_goal?: number;
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
    payment_method: 'tbank',
    is_anonymous: false
  });
  const [alertTiers, setAlertTiers] = useState<AlertTier[]>([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadStreamerData();
  }, [donationUrl]);

  const loadStreamerData = async () => {
    console.log('Loading streamer data for URL:', donationUrl);
    try {
      const response = await streamerAPI.getByUrl(donationUrl);
      console.log('Streamer API response:', response);
      const streamerData = response.data;
      
      if (!streamerData) {
        console.error('No streamer data received');
        setError('Стример не найден');
        return;
      }
      
      if (!streamerData.donation_goal) {
        streamerData.donation_goal = 50000;
      }
      console.log('Setting streamer data:', streamerData);
      setStreamer(streamerData);
      
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
      console.error('Error loading streamer data:', error);
      setError('Стример не найден');
    } finally {
      console.log('Setting loading to false');
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

  const handleAmountButtonClick = (amount: number) => {
    setDonationData(prev => ({
      ...prev,
      amount: amount
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      if (donationData.payment_method === 'tbank') {
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const response = await api.post('/payments/tbank/init', {
          amount: donationData.amount,
          order_id: orderId,
          payment_method: 'tbank',
          description: `Донат для ${streamer?.display_name || 'стримера'}`
        });

        if (response.data.success && response.data.payment_url) {
          window.location.href = response.data.payment_url;
        } else {
          throw new Error('Не удалось создать платеж T-Bank');
        }
        return;
      }

      const response = await api.post('/donations/', {
        recipient_id: streamer?.id,
        ...donationData
      });

      if (response.data.confirmation_url) {
        window.location.href = response.data.confirmation_url;
      }
    } catch (error) {
      console.error('Ошибка при создании доната:', error);
      setError('Ошибка при создании доната');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !streamer) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
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

  const progressPercentage = streamer.donation_goal ? ((streamer.total_donations || 0) / streamer.donation_goal) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center mr-4">
                <span className="text-white text-2xl font-bold">
                  {streamer.display_name?.charAt(0).toUpperCase() || 'S'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{streamer.display_name}</h1>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                  <span className="text-gray-600 text-sm">ОФЛАЙН</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Стрим о стриме</h3>
              <p className="text-gray-600">
                {streamer.stream_description || 'Описание стрима Описание стрима'}
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-blue-600 mr-2">❤️</span>
                  <span className="text-sm font-medium text-gray-700">Всего собрано</span>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {(streamer.total_donations || 0).toLocaleString()} ₽
                </span>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">🎯</span>
                  <span className="text-sm font-medium text-gray-700">Цель сбора</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {(streamer.donation_goal || 50000).toLocaleString()} ₽
                </span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-green-600 mt-1">
                {progressPercentage.toFixed(1)}% от цели
              </p>
            </div>

            {alertTiers.length > 0 && (
              <div className="bg-purple-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-purple-900 mb-3 flex items-center">
                  🎉 Уровни алертов
                </h4>
                <div className="space-y-2">
                  {alertTiers.map((tier) => (
                    <div key={tier.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-2">⭐</span>
                        <span className="text-sm font-medium text-purple-900">{tier.name}</span>
                      </div>
                      <span className="text-sm text-purple-600">
                        {tier.min_amount}₽+
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Поддержать стримера</h2>
              <p className="text-gray-600">Отправьте донат и поддержите любимого стримера</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сумма доната (₽)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="amount"
                    min="100"
                    max="10000"
                    step="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={donationData.amount}
                    onChange={handleDonationChange}
                    placeholder="От 100 до 10000 ₽"
                    required
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[100, 200, 500, 1000].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleAmountButtonClick(amount)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        donationData.amount === amount
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {amount} ₽
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ваше имя
                </label>
                <input
                  type="text"
                  name="donor_name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={donationData.donor_name}
                  onChange={handleDonationChange}
                  placeholder="Как вас называть?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сообщение
                </label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  value={donationData.message}
                  onChange={handleDonationChange}
                  placeholder="Оставьте сообщение для стримера..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_anonymous"
                  id="is_anonymous"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={donationData.is_anonymous}
                  onChange={handleDonationChange}
                />
                <label htmlFor="is_anonymous" className="ml-2 flex items-center text-sm text-gray-900">
                  <span className="text-purple-600 mr-1">👤</span>
                  Анонимный донат
                </label>
              </div>

              <Button
                type="submit"
                disabled={processing}
                className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg transition-all duration-200"
              >
                <span className="mr-2">🎁</span>
                {processing ? 'Обработка...' : 'Задонатить'}
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
    </div>
  );
}

export default function DonationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <DonationContent />
    </Suspense>
  );
} 