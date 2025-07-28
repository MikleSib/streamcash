'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { streamerAPI } from '@/lib/api';
import { useToast } from '@/lib/toast';
import { 
  User, 
  Type, 
  FileText, 
  Target, 
  DollarSign, 
  Settings,
  Save,
  Eye,
  Edit3,
  Star,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

export default function StreamerSetupPage() {
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [existingProfile, setExistingProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    display_name: '',
    stream_title: '',
    stream_description: '',
    donation_goal: 0,
    min_donation_amount: 10,
    max_donation_amount: 10000,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadExistingProfile();
  }, []);

  const loadExistingProfile = async () => {
    try {
      const response = await streamerAPI.getMe();
      setExistingProfile(response.data);
      setFormData({
        display_name: response.data.display_name || '',
        stream_title: response.data.stream_title || '',
        stream_description: response.data.stream_description || '',
        donation_goal: response.data.donation_goal || 0,
        min_donation_amount: response.data.min_donation_amount || 10,
        max_donation_amount: response.data.max_donation_amount || 10000,
      });
    } catch (error) {
      setFormData({
        ...formData,
        display_name: user?.full_name || user?.email || '',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (existingProfile) {
        await streamerAPI.update({
          stream_title: formData.stream_title,
          stream_description: formData.stream_description,
          donation_goal: formData.donation_goal,
          min_donation_amount: formData.min_donation_amount,
          max_donation_amount: formData.max_donation_amount,
        });
        toast.success('Профиль стримера успешно обновлен!');
      } else {
        await streamerAPI.create({
          ...formData,
          user_id: user?.id,
        });
        toast.success('Профиль стримера успешно создан!');
      }
      
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Произошла ошибка при сохранении профиля';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-600 border-t-transparent mx-auto mb-8"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Загружаем профиль</h3>
            <p className="text-gray-300">Подготавливаем настройки...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
       

        <div className="glass-effect rounded-2xl shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center space-x-3 mb-6">
                <User className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Основная информация</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Отображаемое имя
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.display_name}
                      disabled
                      className="w-full px-4 py-4 bg-gray-700/50 border border-gray-600 text-gray-300 rounded-xl transition-all cursor-not-allowed"
                      placeholder="Имя из регистрации"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <Info className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Используется имя из вашего аккаунта
                  </p>
                </div>

                <div>
                  <label htmlFor="stream_title" className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
                    <Type className="w-4 h-4 mr-2" />
                    Название стрима
                  </label>
                  <input
                    type="text"
                    name="stream_title"
                    id="stream_title"
                    className="w-full px-4 py-4 bg-gray-700/70 border border-gray-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-400 hover:bg-gray-700/90"
                    placeholder="О чём ваш стрим?"
                    value={formData.stream_title}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/20">
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Описание контента</h2>
              </div>

              <div>
                <label htmlFor="stream_description" className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Описание стрима
                </label>
                <textarea
                  name="stream_description"
                  id="stream_description"
                  rows={4}
                  className="w-full px-4 py-4 bg-gray-700/70 border border-gray-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 hover:bg-gray-700/90 resize-none"
                  placeholder="Расскажите больше о своём контенте..."
                  value={formData.stream_description}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Опишите, что смотрители могут ожидать от вашего стрима
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-500/20">
              <div className="flex items-center space-x-3 mb-6">
                <DollarSign className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-bold text-white">Настройки донатов</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="donation_goal" className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Цель сбора (₽)
                  </label>
                  <input
                    type="number"
                    name="donation_goal"
                    id="donation_goal"
                    min="0"
                    className="w-full px-4 py-4 bg-gray-700/70 border border-gray-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-400 hover:bg-gray-700/90"
                    placeholder="0"
                    value={formData.donation_goal}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-gray-400 mt-2">0 = без цели</p>
                </div>

                <div>
                  <label htmlFor="min_donation_amount" className="block text-sm font-semibold text-gray-300 mb-3">
                    Мин. донат (₽)
                  </label>
                  <input
                    type="number"
                    name="min_donation_amount"
                    id="min_donation_amount"
                    min="1"
                    required
                    className="w-full px-4 py-4 bg-gray-700/70 border border-gray-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-400 hover:bg-gray-700/90"
                    value={formData.min_donation_amount}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="max_donation_amount" className="block text-sm font-semibold text-gray-300 mb-3">
                    Макс. донат (₽)
                  </label>
                  <input
                    type="number"
                    name="max_donation_amount"
                    id="max_donation_amount"
                    min="1"
                    required
                    className="w-full px-4 py-4 bg-gray-700/70 border border-gray-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-400 hover:bg-gray-700/90"
                    value={formData.max_donation_amount}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl backdrop-blur-sm">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-3" />
                  {error}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Save className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg">
                      {existingProfile ? 'Готово к обновлению' : 'Готово к созданию'}
                    </h4>
                    <p className="text-gray-300">
                      {existingProfile 
                        ? 'Изменения будут применены к вашему профилю' 
                        : 'Профиль будет создан и активирован'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                    className="px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 text-gray-200 border-gray-500 rounded-xl transition-all duration-200"
                  >
                    Отмена
                  </Button>
                  <Button 
                    type="submit" 
                    loading={saving}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 border-0"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        {existingProfile ? 'Обновление...' : 'Создание...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {existingProfile ? 'Обновить профиль' : 'Создать профиль'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {existingProfile && (
          <div className="glass-effect rounded-2xl p-6 shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Профиль активен и готов к работе
                </h3>
                <p className="text-gray-300 text-sm">
                  Ваша ссылка для донатов: <span className="text-purple-400 font-mono">стримкэш.рф/donate/{existingProfile.donation_url}</span>
                </p>
              </div>
              <Button
                onClick={() => router.push('/dashboard/settings')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-200"
              >
                Настройки алертов
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 