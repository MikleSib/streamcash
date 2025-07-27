'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { streamerAPI } from '@/lib/api';

export default function StreamerSetupPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    display_name: '',
    stream_title: '',
    stream_description: '',
    donation_goal: 0,
    min_donation_amount: 10,
    max_donation_amount: 10000,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await streamerAPI.create({
        ...formData,
        user_id: user?.id,
      });
      
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Произошла ошибка при создании профиля';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Настройка профиля стримера
            </h1>
            <p className="mt-2 text-gray-600">
              Заполните информацию о вашем стриме для начала приёма донатов
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="display_name" className="block text-sm font-medium text-gray-700">
                Отображаемое имя *
              </label>
              <input
                type="text"
                name="display_name"
                id="display_name"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Как вас зовут в стримах?"
                value={formData.display_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="stream_title" className="block text-sm font-medium text-gray-700">
                Название стрима
              </label>
              <input
                type="text"
                name="stream_title"
                id="stream_title"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="О чём ваш стрим?"
                value={formData.stream_title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="stream_description" className="block text-sm font-medium text-gray-700">
                Описание стрима
              </label>
              <textarea
                name="stream_description"
                id="stream_description"
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Расскажите больше о своём контенте..."
                value={formData.stream_description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label htmlFor="donation_goal" className="block text-sm font-medium text-gray-700">
                  Цель сбора (₽)
                </label>
                <input
                  type="number"
                  name="donation_goal"
                  id="donation_goal"
                  min="0"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="0"
                  value={formData.donation_goal}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="min_donation_amount" className="block text-sm font-medium text-gray-700">
                  Мин. донат (₽)
                </label>
                <input
                  type="number"
                  name="min_donation_amount"
                  id="min_donation_amount"
                  min="1"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.min_donation_amount}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="max_donation_amount" className="block text-sm font-medium text-gray-700">
                  Макс. донат (₽)
                </label>
                <input
                  type="number"
                  name="max_donation_amount"
                  id="max_donation_amount"
                  min="1"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.max_donation_amount}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
              >
                Отмена
              </Button>
              <Button type="submit" loading={loading}>
                Создать профиль
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 