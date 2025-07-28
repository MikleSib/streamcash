'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { donationAPI, streamerAPI, alertAPI } from '@/lib/api';
import { formatMoney } from '@/lib/utils';
import { 
  DollarSign, 
  Settings, 
  Link as LinkIcon, 
  Copy, 
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle,
  BarChart3,
  Monitor,
  Bell,
  Gift,
  User,
  Calendar,
  Home,
  History,
  AlertTriangle,
  ExternalLink,
  TrendingUp,
  Activity,
  Zap,
  TestTube
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
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedObsLink, setCopiedObsLink] = useState(false);
  const [showObsLink, setShowObsLink] = useState(false);


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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getDonationUrl = () => {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    const baseUrl = hostname === 'xn--h1aefoeg0czb.xn--p1ai' ? 'https://стримкэш.рф' : window.location.origin;
    return `${baseUrl}/donate/${streamerProfile?.donation_url}`;
  };

  const getWidgetUrl = () => {
    return `https://стримкэш.рф/api/v1/alerts/widget/${streamerProfile?.donation_url}`;
  };

  const openWidgetTest = () => {
    const widgetUrl = getWidgetUrl();
    const testWindow = window.open(
      widgetUrl, 
      'widget-test',
      'width=800,height=600,resizable=yes,scrollbars=no,menubar=no,toolbar=no,location=no,status=no'
    );
    
    if (testWindow) {
      setTimeout(() => {
        const anyWindow = testWindow as any;
        if (anyWindow.testAlert) {
          anyWindow.testAlert(100);
        }
      }, 2000);
    }
  };

  const sendTestAlert = async (amount: number = 100) => {
    try {
      await alertAPI.testAlert(amount);
    } catch (error) {
      console.error('Failed to send test alert:', error);
    }
  };

  const [testAmount, setTestAmount] = useState(100);

  const copyDonationLink = () => {
    if (streamerProfile?.donation_url) {
      const link = getDonationUrl();
      copyToClipboard(link);
    }
  };

  const copyObsLink = async () => {
    if (streamerProfile?.donation_url) {
      const link = getWidgetUrl();
      try {
        await navigator.clipboard.writeText(link);
        setCopiedObsLink(true);
        setTimeout(() => setCopiedObsLink(false), 2000);
      } catch (error) {
        console.error('Failed to copy OBS link:', error);
      }
    }
  };



  const StatCard = ({ title, value, icon: Icon, change, color, trend }: {
    title: string;
    value: string | number;
    icon: any;
    change: string;
    color: string;
    trend: 'up' | 'down' | 'neutral';
  }) => (
    <div className="bg-gray-800/60 backdrop-blur-md rounded-xl border border-gray-700/30 p-6 hover:border-gray-600/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
          trend === 'up' ? 'text-green-400 bg-green-400/10' : 
          trend === 'down' ? 'text-red-400 bg-red-400/10' : 
          'text-gray-400 bg-gray-400/10'
        }`}>
          {trend === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
          {trend === 'down' && <Activity className="w-3 h-3 mr-1 rotate-180" />}
          {trend === 'neutral' && <Activity className="w-3 h-3 mr-1" />}
          {change}
        </div>
      </div>
      <div>
        <h3 className="text-gray-400 text-sm mb-2 font-medium">{title}</h3>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  );

  const OverviewSection = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Обзор</h1>
          <p className="text-gray-400">Статистика и основные показатели</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Activity className="w-4 h-4" />
          <span>Обновлено только что</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Всего собрано"
          value={stats ? formatMoney(stats.total_amount) : '0 ₽'}
          icon={DollarSign}
          change="+12.5%"
          color="from-purple-600 to-pink-600"
          trend="up"
        />
        <StatCard
          title="За этот месяц"
          value={stats ? formatMoney(stats.this_month_amount) : '0 ₽'}
          icon={Calendar}
          change="+8.2%"
          color="from-green-600 to-emerald-600"
          trend="up"
        />
        <StatCard
          title="Всего донатов"
          value={stats ? stats.total_count : 0}
          icon={User}
          change="+15"
          color="from-blue-600 to-cyan-600"
          trend="up"
        />
      </div>

      <div className="bg-gray-800/60 backdrop-blur-md rounded-xl border border-gray-700/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <LinkIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Ссылка для донатов</h2>
              <p className="text-gray-400 text-sm">Поделитесь с вашей аудиторией</p>
            </div>
          </div>
          <button
            onClick={() => window.open(getDonationUrl(), '_blank')}
            className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm">Открыть</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="text"
            readOnly
            value={getDonationUrl()}
            className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
          />
          <Button 
            onClick={copyDonationLink}
            className={`px-6 py-3 transition-all duration-200 ${
              copiedLink 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {copiedLink ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Скопировано
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Копировать
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="bg-gray-800/60 backdrop-blur-md rounded-xl border border-gray-700/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">OBS Виджет</h2>
              <p className="text-gray-400 text-sm">Ссылка для добавления в OBS Studio</p>
            </div>
          </div>
          <button
            onClick={() => window.open(getWidgetUrl(), '_blank')}
            className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm">Открыть</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="text"
            readOnly
            value={showObsLink ? getWidgetUrl() : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
            className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 font-mono"
          />
          <Button 
            onClick={() => setShowObsLink(!showObsLink)}
            className="px-4 py-3 bg-gray-600/50 border border-gray-500/50 text-gray-300 hover:bg-gray-500/50"
            title={showObsLink ? "Скрыть ссылку" : "Показать ссылку"}
          >
            {showObsLink ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button 
            onClick={copyObsLink}
            className={`px-6 py-3 transition-all duration-200 ${
              copiedObsLink 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {copiedObsLink ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Скопировано
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Копировать
              </>
            )}
          </Button>
        </div>
        
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-300 text-sm flex items-center">
            <Monitor className="w-4 h-4 mr-2" />
            Добавьте эту ссылку как "Источник браузера" в OBS Studio (размер: 800x600)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/60 backdrop-blur-md rounded-xl border border-gray-700/30 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">История донатов</h3>
              <p className="text-gray-400 text-sm">Детальная статистика</p>
            </div>
          </div>
          <Button 
            onClick={() => router.push('/dashboard/donations')}
            className="w-full bg-green-600/20 border border-green-600/30 text-green-400 hover:bg-green-600/30 hover:border-green-600/50"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Открыть историю
          </Button>
        </div>

        <div className="bg-gray-800/60 backdrop-blur-md rounded-xl border border-gray-700/30 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Настройки алертов</h3>
              <p className="text-gray-400 text-sm">Звуки и анимации</p>
            </div>
          </div>
          <Button 
            onClick={() => router.push('/dashboard/settings')}
            className="w-full bg-purple-600/20 border border-purple-600/30 text-purple-400 hover:bg-purple-600/30 hover:border-purple-600/50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Настроить
          </Button>
        </div>
      </div>
    </div>
  );

  const SettingsSection = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Настройки</h1>
        <p className="text-gray-400">Настройте алерты и звуки</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/60 backdrop-blur-md rounded-xl border border-gray-700/30 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Алерты</h3>
              <p className="text-gray-400 text-sm">Настройка уведомлений</p>
            </div>
          </div>
          <Button 
            onClick={() => router.push('/dashboard/settings')}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Настроить алерты
          </Button>
        </div>

        <div className="bg-gray-800/60 backdrop-blur-md rounded-xl border border-gray-700/30 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Тест алертов</h3>
              <p className="text-gray-400 text-sm">Проверьте как работают</p>
            </div>
          </div>
          <Button 
            onClick={() => router.push('/dashboard/settings/test')}
            className="w-full bg-yellow-600 hover:bg-yellow-700"
          >
            Запустить тест
          </Button>
        </div>
      </div>
    </div>
  );

  const HistorySection = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">История донатов</h1>
        <p className="text-gray-400">Все полученные донаты</p>
      </div>

      <div className="bg-gray-800/60 backdrop-blur-md rounded-xl border border-gray-700/30 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Детальная статистика</h3>
            <p className="text-gray-400 text-sm">Просмотр всех донатов</p>
          </div>
        </div>
        <Button 
          onClick={() => router.push('/dashboard/donations')}
          className="bg-green-600 hover:bg-green-700"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Открыть историю
        </Button>
      </div>
    </div>
  );

  const AlertsSection = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Алерты</h1>
        <p className="text-gray-400">Настройка уведомлений о донатах</p>
      </div>

      <div className="bg-gray-800/60 backdrop-blur-md rounded-xl border border-gray-700/30 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Настройки алертов</h3>
            <p className="text-gray-400 text-sm">Звуки, анимации, внешний вид</p>
          </div>
        </div>
        <Button 
          onClick={() => router.push('/dashboard/settings')}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Settings className="w-4 h-4 mr-2" />
          Настроить
        </Button>
      </div>
    </div>
  );

  const WidgetSection = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">OBS Виджет</h1>
        <p className="text-gray-400">Настройка виджета для OBS</p>
      </div>

      <div className="bg-gray-800/60 backdrop-blur-md rounded-xl border border-gray-700/30 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
            <Monitor className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">URL виджета</h3>
            <p className="text-gray-400 text-sm">Ссылка для добавления в OBS</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 mb-6">
          <input
            type="text"
            readOnly
            value={getWidgetUrl()}
            className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white text-sm focus:outline-none"
          />
          <Button 
            onClick={() => copyToClipboard(getWidgetUrl())}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700"
          >
            <Copy className="w-4 h-4 mr-2" />
            Копировать
          </Button>
        </div>

        {/* Кнопки тестирования виджета */}
        <div className="space-y-4 mb-6">
          <div className="flex space-x-4">
            <Button 
              onClick={openWidgetTest}
              className="px-6 py-3 bg-green-600 hover:bg-green-700"
            >
              <TestTube className="w-4 h-4 mr-2" />
              Тест виджета (800x600)
            </Button>
            <Button 
              onClick={() => window.open(getWidgetUrl(), '_blank')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Открыть виджет
            </Button>
          </div>
          
          {/* Дополнительные тестовые кнопки */}
          <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
            <h4 className="text-white font-medium mb-3 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-yellow-400" />
              Тестирование алертов:
            </h4>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => sendTestAlert(50)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm"
              >
                Тест 50₽
              </Button>
              <Button 
                onClick={() => sendTestAlert(100)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-sm"
              >
                Тест 100₽
              </Button>
              <Button 
                onClick={() => sendTestAlert(500)}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-sm"
              >
                Тест 500₽
              </Button>
              <Button 
                onClick={() => sendTestAlert(1000)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-sm"
              >
                Тест 1000₽
              </Button>
              <div className="flex items-center space-x-2 ml-4">
                <input
                  type="number"
                  value={testAmount}
                  onChange={(e) => setTestAmount(Number(e.target.value))}
                  className="w-20 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                  min="1"
                  placeholder="100"
                />
                <Button 
                  onClick={() => sendTestAlert(testAmount)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-sm"
                >
                  Тест
                </Button>
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-2">
              * Тестовые алерты будут отображаться во всех открытых виджетах
            </p>
          </div>
        </div>

        {/* Предпросмотр виджета */}
        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
          <h4 className="text-white font-medium mb-3 flex items-center">
            <Monitor className="w-4 h-4 mr-2 text-blue-400" />
            Предпросмотр виджета:
          </h4>
          <div className="bg-black rounded-lg overflow-hidden" style={{ width: '400px', height: '300px' }}>
            <iframe
              src={getWidgetUrl()}
              width="400"
              height="300"
              style={{ border: 'none', background: 'transparent' }}
              title="Widget Preview"
            />
          </div>
          <p className="text-gray-400 text-xs mt-2">
            * Используйте кнопки тестирования выше, чтобы увидеть алерты в предпросмотре
          </p>
        </div>

        <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
          <h4 className="text-white font-medium mb-3 flex items-center">
            <Bell className="w-4 h-4 mr-2 text-blue-400" />
            Инструкция по настройке:
          </h4>
          <div className="text-sm text-gray-300 space-y-2">
            <div className="flex items-start space-x-3">
              <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
              <span>Откройте OBS → Источники → + → Источник браузера</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
              <span>Вставьте скопированную ссылку в поле URL</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
              <span>Установите размер: 800x600 пикселей</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">4</span>
              <span>Используйте "Тест виджета" для проверки работы алертов</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );



  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-6"></div>
            <p className="text-gray-300 text-lg">Загружаем дашборд...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      {!streamerProfile ? (
        <div className="max-w-md mx-auto">
          <div className="bg-gray-800/70 backdrop-blur-md rounded-2xl border border-gray-700/50 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              Создайте профиль стримера
            </h2>
            <p className="text-gray-300 mb-8">
              Настройте профиль за 2 минуты и начните принимать донаты
            </p>
            
            <Button 
              onClick={() => router.push('/dashboard/streamer-setup')}
              className="w-full py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Создать профиль
            </Button>
          </div>
        </div>
      ) : (
        <OverviewSection />
      )}
    </DashboardLayout>
  );
} 