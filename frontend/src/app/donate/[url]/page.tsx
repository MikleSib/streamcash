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
  
  const [donationData, setDonationData] = useState({
    amount: 0,
    message: '',
    donor_name: '',
    donor_email: '',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {streamer.display_name}
              </h1>
              {streamer.stream_title && (
                <p className="text-lg text-gray-600 mb-4">
                  {streamer.stream_title}
                </p>
              )}
              {streamer.stream_description && (
                <p className="text-gray-500">
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
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Поддержать стримера
            </h2>

            <form onSubmit={handleDonate} className="space-y-4">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`От ${streamer.min_donation_amount} до ${streamer.max_donation_amount} ₽`}
                  value={donationData.amount || ''}
                  onChange={handleDonationChange}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {quickAmounts
                    .filter(amount => amount >= streamer.min_donation_amount && amount <= streamer.max_donation_amount)
                    .map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      className={`px-3 py-1 text-sm rounded-md transition-colors font-medium ${
                        donationData.amount === amount
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Как вас называть?"
                  value={donationData.donor_name}
                  onChange={handleDonationChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (необязательно)
                </label>
                <input
                  type="email"
                  name="donor_email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                  value={donationData.donor_email}
                  onChange={handleDonationChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сообщение
                </label>
                <textarea
                  name="message"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Оставьте сообщение для стримера..."
                  value={donationData.message}
                  onChange={handleDonationChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Способ оплаты
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600">
                  Тестовая оплата (для разработки)
                </div>
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
                <label htmlFor="is_anonymous" className="ml-2 block text-sm text-gray-900">
                  Анонимный донат
                </label>
              </div>

              <Button
                type="submit"
                loading={donatingLoading}
                className="w-full"
                size="lg"
              >
                Задонатить {donationData.amount > 0 ? formatMoney(donationData.amount) : ''}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 