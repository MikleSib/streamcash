'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { streamerAPI, donationAPI } from '@/lib/api';
import { formatMoney } from '@/lib/utils';
import { Heart, Users, Target } from 'lucide-react';

interface Streamer {
  id: number;
  display_name: string;
  stream_title?: string;
  stream_description?: string;
  donation_goal: number;
  current_donations: number;
  min_donation_amount: number;
  max_donation_amount: number;
  user_id: number;
}

export default function DonatePage() {
  const params = useParams();
  const donationUrl = params.url as string;
  
  const [streamer, setStreamer] = useState<Streamer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [alertTiers, setAlertTiers] = useState<any[]>([]);
  
  const [donationData, setDonationData] = useState({
    amount: 0,
    message: '',
    donor_name: '',
    is_anonymous: false,
    payment_method: 'test',
  });
  const [donatingLoading, setDonatingLoading] = useState(false);

  useEffect(() => {
    loadStreamerData();
  }, [donationUrl]);

  const loadStreamerData = async () => {
    try {
      const response = await streamerAPI.getByUrl(donationUrl);
      setStreamer(response.data);
      
      // Загружаем настройки алертов
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const alertResponse = await fetch(`${API_URL}/v1/alerts/streamer/${donationUrl}`);
        console.log('Alert response status:', alertResponse.status);
        if (alertResponse.ok) {
          const alertData = await alertResponse.json();
          console.log('Alert data received:', alertData);
          setAlertTiers(alertData.tiers || []);
          console.log('Alert tiers set:', alertData.tiers || []);
        } else {
          console.log('Alert response not ok:', await alertResponse.text());
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
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setDonationData({
        ...donationData,
        [name]: target.checked,
      });
    } else {
      setDonationData({
        ...donationData,
        [name]: type === 'number' ? parseFloat(value) || 0 : value,
      });
    }
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamer) return;

    if (donationData.amount < streamer.min_donation_amount) {
      alert(`Минимальная сумма доната: ${formatMoney(streamer.min_donation_amount)}`);
      return;
    }

    if (donationData.amount > streamer.max_donation_amount) {
      alert(`Максимальная сумма доната: ${formatMoney(streamer.max_donation_amount)}`);
      return;
    }

    setDonatingLoading(true);

    try {
      const response = await donationAPI.create({
        ...donationData,
        recipient_id: streamer.user_id,
      });

      if (response.data.payment_url) {
        window.location.href = response.data.payment_url;
      }
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Произошла ошибка при создании доната';
      alert(message);
    } finally {
      setDonatingLoading(false);
    }
  };

  const quickAmounts = [50, 100, 200, 500, 1000];
  
  const getTierForAmount = (amount: number) => {
    return alertTiers.find(tier => {
      const minAmount = tier.min_amount || 0;
      const maxAmount = tier.max_amount;
      return amount >= minAmount && (maxAmount === null || maxAmount === undefined || amount <= maxAmount);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !streamer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Стример не найден'}
          </h1>
          <Button onClick={() => window.location.href = '/'}>
            Вернуться на главную
          </Button>
        </div>
      </div>
    );
  }

  const progressPercentage = streamer.donation_goal > 0 
    ? Math.min((streamer.current_donations / streamer.donation_goal) * 100, 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                  {streamer.display_name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
                {streamer.display_name}
              </h1>
              <div className="flex items-center justify-center mb-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                <span className="text-sm text-gray-500 uppercase tracking-wide">ОФЛАЙН</span>
              </div>
              {streamer.stream_title && (
                <p className="text-lg text-gray-600 mb-4 font-medium">
                  {streamer.stream_title}
                </p>
              )}
              {streamer.stream_description && (
                <p className="text-gray-500 leading-relaxed">
                  {streamer.stream_description}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Heart className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">
                    Всего собрано
                  </span>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {formatMoney(streamer.current_donations)}
                </span>
              </div>

              {streamer.donation_goal > 0 && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Target className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-800">
                        Цель сбора
                      </span>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {formatMoney(streamer.donation_goal)}
                    </span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    {progressPercentage.toFixed(1)}% от цели
                  </p>
                </div>
              )}

              {alertTiers.length > 0 ? (
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">🎉</span>
                    Уровни алертов
                  </h3>
                  <div className="space-y-3">
                    {alertTiers
                      .sort((a, b) => (a.min_amount || 0) - (b.min_amount || 0))
                      .map((tier, index) => (
                        <div
                          key={tier.id || index}
                          className={`p-3 rounded-lg border transition-all duration-200 ${
                            getTierForAmount(donationData.amount) === tier
                              ? 'border-purple-500 bg-purple-100 shadow-md'
                              : 'border-gray-200 bg-white hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{tier.icon === 'Star' ? '⭐' : '🎁'}</span>
                              <span className="font-medium text-gray-900">{tier.name}</span>
                            </div>
                            <div className="text-sm font-semibold text-purple-600">
                              {tier.min_amount}₽{tier.max_amount ? `-${tier.max_amount}₽` : '+'}
                            </div>
                          </div>
                          {tier.text_template && (
                            <div className="text-xs text-gray-600">
                              {tier.text_template
                                .replace('{donor_name}', 'Имя')
                                .replace('{amount}', tier.min_amount + '₽')
                                .replace('{message}', 'сообщение')}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Поддержать стримера
              </h2>
              <p className="text-gray-500">Отправьте донат и поддержите любимого стримера</p>
            </div>

            <form onSubmit={handleDonate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сумма доната (₽)
                </label>
                <input
                  type="number"
                  name="amount"
                  min={streamer.min_donation_amount}
                  max={streamer.max_donation_amount}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-lg font-semibold"
                  placeholder={`От ${streamer.min_donation_amount} до ${streamer.max_donation_amount} ₽`}
                  value={donationData.amount || ''}
                  onChange={handleDonationChange}
                />
                <div className="grid grid-cols-5 gap-2 mt-3">
                  {quickAmounts
                    .filter(amount => amount >= streamer.min_donation_amount && amount <= streamer.max_donation_amount)
                    .map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      className={`px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                        donationData.amount === amount
                          ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:scale-105'
                      }`}
                      onClick={() => setDonationData({ ...donationData, amount })}
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Как вас называть?"
                  value={donationData.donor_name}
                  onChange={handleDonationChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сообщение
                </label>
                <textarea
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Оставьте сообщение для стримера..."
                  value={donationData.message}
                  onChange={handleDonationChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Способ оплаты
                </label>
                <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-amber-50 text-amber-700 font-medium">
                  🧪 Тестовая оплата (для разработки)
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  name="is_anonymous"
                  id="is_anonymous"
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-md"
                  checked={donationData.is_anonymous}
                  onChange={handleDonationChange}
                />
                <label htmlFor="is_anonymous" className="ml-3 block text-sm font-medium text-gray-900">
                  🕶️ Анонимный донат
                </label>
              </div>

              <Button
                type="submit"
                loading={donatingLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                size="lg"
              >
                {donatingLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Обработка...
                  </div>
                ) : (
                  <>
                    🎁 Задонатить {donationData.amount > 0 ? formatMoney(donationData.amount) : ''}
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 