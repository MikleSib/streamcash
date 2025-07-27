'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { donationAPI, streamerAPI } from '@/lib/api';
import { formatMoney } from '@/lib/utils';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Settings, 
  Link as LinkIcon, 
  Copy, 
  Eye,
  Calendar,
  Target,
  Gift,
  BarChart3,
  Zap,
  Sparkles,
  CheckCircle,
  ExternalLink,
  Monitor,
  Bell,
  Star,
  Activity
} from 'lucide-react';

interface DashboardStats {
  total_amount: number;
  total_count: number;
  today_amount: number;
  today_count: number;
  this_month_amount: number;
  this_month_count: number;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [streamerProfile, setStreamerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    try {
      const [statsResponse, streamerResponse] = await Promise.allSettled([
        donationAPI.getStats(user!.id),
        streamerAPI.getMe(),
      ]);

      if (statsResponse.status === 'fulfilled') {
        setStats(statsResponse.value.data);
      }

      if (streamerResponse.status === 'fulfilled') {
        setStreamerProfile(streamerResponse.value.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(type);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const copyDonationLink = () => {
    if (streamerProfile?.donation_url) {
      const link = `${window.location.origin}/donate/${streamerProfile.donation_url}`;
      copyToClipboard(link, 'donation');
    }
  };

  const copyWidgetLink = () => {
    if (streamerProfile?.donation_url) {
      const widgetUrl = `http://localhost:8000/api/v1/alerts/widget/${streamerProfile.donation_url}`;
      copyToClipboard(widgetUrl, 'widget');
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    change, 
    color = 'purple',
    trend = 'up'
  }: {
    title: string;
    value: string | number;
    icon: any;
    change?: string;
    color?: 'purple' | 'green' | 'blue' | 'yellow';
    trend?: 'up' | 'down' | 'neutral';
  }) => {
    const colorClasses = {
      purple: 'from-purple-600 to-pink-600',
      green: 'from-green-600 to-emerald-600',
      blue: 'from-blue-600 to-cyan-600',
      yellow: 'from-yellow-600 to-orange-600'
    };

    return (
      <div className="group relative bg-gray-800/70 backdrop-blur-md rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r opacity-5 group-hover:opacity-10 transition-opacity duration-300" 
             style={{ background: `linear-gradient(to right, var(--color-${color}-600), var(--color-${color === 'purple' ? 'pink' : color}-600))` }} />
        
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            {change && (
              <div className={`flex items-center text-sm font-medium ${
                trend === 'up' ? 'text-green-300' : trend === 'down' ? 'text-red-300' : 'text-gray-300'
              }`}>
                <Activity className="w-4 h-4 mr-1" />
                {change}
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">{title}</h3>
            <p className="text-3xl font-bold text-white">{value}</p>
          </div>
        </div>
      </div>
    );
  };

  const QuickActionCard = ({ 
    title, 
    description, 
    icon: Icon, 
    onClick, 
    color = 'purple' 
  }: {
    title: string;
    description: string;
    icon: any;
    onClick: () => void;
    color?: string;
  }) => (
    <div 
      onClick={onClick}
      className="group cursor-pointer bg-gray-800/70 backdrop-blur-md rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 p-6"
    >
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
            {title}
          </h3>
          <p className="text-gray-300 text-sm mt-1 leading-relaxed">{description}</p>
        </div>
        <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
      </div>
    </div>
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-6"></div>
            <p className="text-gray-300 text-lg">Загружаем ваш дашборд...</p>
            <p className="text-gray-500 text-sm mt-2">Подготавливаем статистику и настройки</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Добро пожаловать, <span className="text-purple-300">{user.username}</span>!
              </h1>
              <p className="text-gray-200 text-lg mt-2">
                Управляйте донатами и развивайте свой канал
              </p>
            </div>
          </div>

        </div>

        {!streamerProfile ? (
          /* Setup Streamer Profile */
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800/70 backdrop-blur-md rounded-2xl border border-gray-700/50 p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4">
                Создайте профиль стримера
              </h2>
              <p className="text-gray-200 text-lg mb-8 leading-relaxed">
                Настройте свой профиль за 2 минуты и начните принимать донаты от зрителей. 
                Это совершенно бесплатно!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-purple-400" />
                  </div>
                  <p className="text-sm text-gray-300 font-medium">Быстрая настройка</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Gift className="w-6 h-6 text-green-400" />
                  </div>
                  <p className="text-sm text-gray-300 font-medium">Без комиссий</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Monitor className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-sm text-gray-300 font-medium">OBS виджеты</p>
                </div>
              </div>
              
              <Button 
                onClick={() => router.push('/dashboard/streamer-setup')}
                className="px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Создать профиль стримера
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard
                title="Всего собрано"
                value={stats ? formatMoney(stats.total_amount) : '0 ₽'}
                icon={DollarSign}
                color="purple"
                change="+12.5%"
                trend="up"
              />
              <StatCard
                title="За этот месяц"
                value={stats ? formatMoney(stats.this_month_amount) : '0 ₽'}
                icon={TrendingUp}
                color="green"
                change="+8.2%"
                trend="up"
              />
              <StatCard
                title="Всего донатов"
                value={stats ? stats.total_count : 0}
                icon={Users}
                color="blue"
                change="+15"
                trend="up"
              />
              <StatCard
                title="Сегодня"
                value={stats ? formatMoney(stats.today_amount) : '0 ₽'}
                icon={Calendar}
                color="yellow"
                change="Новые"
                trend="neutral"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Donation Link */}
              <div className="lg:col-span-2 bg-gray-800/70 backdrop-blur-md rounded-xl border border-gray-700/50 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <LinkIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Ссылка для донатов</h2>
                    <p className="text-gray-300 text-sm">Поделитесь с вашей аудиторией</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 mb-4">
                  <input
                    type="text"
                    readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/donate/${streamerProfile.donation_url}`}
                    className="flex-1 px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Button 
                    size="sm" 
                    onClick={copyDonationLink}
                    className={`transition-all duration-200 ${
                      copiedLink === 'donation' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {copiedLink === 'donation' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center text-green-300">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="font-medium">Готово к использованию</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Eye className="w-4 h-4 mr-1" />
                    <span className="font-medium">{stats?.total_count || 0} переходов</span>
                  </div>
                </div>
              </div>

              {/* Goal Progress */}
              <div className="bg-gray-800/70 backdrop-blur-md rounded-xl border border-gray-700/50 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Цель месяца</h3>
                    <p className="text-gray-300 text-sm font-medium">50,000 ₽</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300 font-medium">Прогресс</span>
                    <span className="text-sm text-white font-bold">
                      {stats ? Math.round((stats.this_month_amount / 50000) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-600 to-emerald-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${stats ? Math.min((stats.this_month_amount / 50000) * 100, 100) : 0}%` }}
                    />
                  </div>
                </div>

                <p className="text-gray-300 text-sm font-medium">
                  Осталось: {formatMoney(50000 - (stats?.this_month_amount || 0))}
                </p>
              </div>
            </div>

            {/* OBS Widget Section */}
            <div className="bg-gray-800/70 backdrop-blur-md rounded-xl border border-gray-700/50 p-6 mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Виджет для OBS</h2>
                  <p className="text-gray-200">Показывайте алерты о донатах в прямом эфире</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    URL виджета
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      readOnly
                      value={`http://localhost:8000/api/v1/alerts/widget/${streamerProfile.donation_url}`}
                      className="flex-1 px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white text-sm focus:outline-none"
                    />
                    <Button 
                      size="sm" 
                      onClick={copyWidgetLink}
                      className={`transition-all duration-200 ${
                        copiedLink === 'widget' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {copiedLink === 'widget' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {copiedLink === 'widget' && (
                    <p className="text-green-300 text-sm mt-2 flex items-center font-medium">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Ссылка скопирована!
                    </p>
                  )}
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3 flex items-center">
                    <Bell className="w-4 h-4 mr-2 text-blue-400" />
                    Инструкция по настройке
                  </h4>
                  <div className="space-y-3 text-sm text-gray-200">
                    <div className="flex items-start">
                      <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0 font-bold">1</span>
                      <span className="leading-relaxed">Откройте OBS и нажмите "+" в панели "Источники"</span>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0 font-bold">2</span>
                      <span className="leading-relaxed">Выберите "Источник браузера" (Browser Source)</span>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0 font-bold">3</span>
                      <span className="leading-relaxed">Вставьте скопированную ссылку в поле URL</span>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0 font-bold">4</span>
                      <span className="leading-relaxed">Установите размер: 800x600 пикселей</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Zap className="w-6 h-6 mr-3 text-purple-400" />
                Быстрые действия
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <QuickActionCard
                  title="Настройки алертов"
                  description="Настройте звуки, анимации и внешний вид уведомлений"
                  icon={Settings}
                  onClick={() => router.push('/dashboard/settings')}
                />
                
                <QuickActionCard
                  title="История донатов"
                  description="Просмотрите все полученные донаты и статистику"
                  icon={BarChart3}
                  onClick={() => router.push('/dashboard/donations')}
                />
                
                <QuickActionCard
                  title="Страница донатов"
                  description="Посмотрите, как выглядит ваша страница для зрителей"
                  icon={Eye}
                  onClick={() => window.open(`/donate/${streamerProfile.donation_url}`, '_blank')}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 