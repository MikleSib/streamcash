'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { alertAPI, streamerAPI } from '@/lib/api';
import { 
  Play,
  ArrowLeft,
  Volume2,
  VolumeX,
  RotateCcw,
  Settings,
  TestTube,
  Sparkles,
  ExternalLink,
  Monitor
} from 'lucide-react';

interface AlertTier {
  id: string;
  name: string;
  min_amount: number;
  max_amount?: number;
  sound_enabled: boolean;
  sound_file_url?: string;
  sound_volume: number;
  visual_enabled: boolean;
  alert_duration: number;
  text_color: string;
  background_color: string;
  font_size: number;
  animation_enabled: boolean;
  animation_type: 'none' | 'gif' | 'confetti' | 'fireworks' | 'hearts' | 'sparkles';
  gif_url?: string;
  text_template: string;
  screen_shake: boolean;
  highlight_color?: string;
  icon: string;
  color: string;
}

function AlertTestContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tiers, setTiers] = useState<AlertTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingTier, setTestingTier] = useState<string | null>(null);
  const [streamerProfile, setStreamerProfile] = useState<any>(null);
  const [testData, setTestData] = useState({
    donor_name: 'TestUser',
    amount: '100',
    message: 'Тестовое сообщение!'
  });

  const tierFromUrl = searchParams.get('tier');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadSettings();
      loadStreamerProfile();
    }
  }, [user, authLoading]);

  const loadSettings = async () => {
    try {
      const response = await alertAPI.getSettings();
      if (response.data.tiers && response.data.tiers.length > 0) {
        setTiers(response.data.tiers);
        
        // Если указан tier в URL, начинаем тест
        if (tierFromUrl) {
          const tier = response.data.tiers.find((t: AlertTier) => t.id === tierFromUrl);
          if (tier) {
            setTimeout(() => testAlert(tier), 500);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load alert settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStreamerProfile = async () => {
    try {
      const response = await streamerAPI.getMe();
      setStreamerProfile(response.data);
    } catch (error) {
      console.error('Failed to load streamer profile:', error);
    }
  };

  const testAlert = async (tier: AlertTier) => {
    setTestingTier(tier.id);
    
    try {
      // Показываем визуальный алерт
      showVisualAlert(tier);
      
    } catch (error) {
      console.error('Failed to test alert:', error);
    } finally {
      setTestingTier(null);
    }
  };

  const showVisualAlert = (tier: AlertTier) => {
    if (!tier.visual_enabled) return;

    // Создаем элемент алерта
    const alertElement = document.createElement('div');
    alertElement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      padding: 20px;
      border-radius: 10px;
      font-family: Arial, sans-serif;
      font-size: ${tier.font_size}px;
      color: ${tier.text_color};
      background: ${tier.background_color};
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      transform: translateX(400px);
      transition: transform 0.5s ease-out;
      max-width: 400px;
      word-wrap: break-word;
    `;

    // Заполняем шаблон
    let alertText = tier.text_template
      .replace('{name}', testData.donor_name)
      .replace('{amount}', `${testData.amount} ₽`)
      .replace('{message}', testData.message);

    alertElement.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 24px;">${tier.icon}</span>
        <div>
          <div style="font-weight: bold; margin-bottom: 5px;">${alertText}</div>
          ${testData.message ? `<div style="font-size: 14px; opacity: 0.8;">${testData.message}</div>` : ''}
        </div>
      </div>
    `;

    document.body.appendChild(alertElement);

    // Анимация появления
    setTimeout(() => {
      alertElement.style.transform = 'translateX(0)';
    }, 100);

    // Добавляем анимацию если включена
    if (tier.animation_enabled && tier.animation_type !== 'none') {
      addAnimation(alertElement, tier.animation_type);
    }

    // Эффект тряски экрана
    if (tier.screen_shake) {
      document.body.style.animation = 'shake 0.5s ease-in-out';
      setTimeout(() => {
        document.body.style.animation = '';
      }, 500);
    }

    // Удаляем алерт через указанное время
    setTimeout(() => {
      alertElement.style.transform = 'translateX(400px)';
      setTimeout(() => {
        if (alertElement.parentNode) {
          alertElement.parentNode.removeChild(alertElement);
        }
      }, 500);
    }, tier.alert_duration * 1000);
  };

  const addAnimation = (element: HTMLElement, type: string) => {
    switch (type) {
      case 'confetti':
        element.style.animation = 'confetti 2s ease-out';
        break;
      case 'fireworks':
        element.style.animation = 'fireworks 2s ease-out';
        break;
      case 'hearts':
        element.style.animation = 'hearts 2s ease-out';
        break;
      case 'sparkles':
        element.style.animation = 'sparkles 2s ease-out';
        break;
      case 'gif':
        if (element.querySelector('img')) {
          element.style.animation = 'pulse 1s ease-in-out';
        }
        break;
    }
  };

  const openWidgetTest = () => {
    if (streamerProfile?.donation_url) {
      window.open(`/donate/${streamerProfile.donation_url}`, '_blank');
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Тестирование алертов</h1>
              <p className="text-gray-600">Проверьте как выглядят ваши алерты</p>
            </div>
          </div>
          <Button
            onClick={openWidgetTest}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Открыть виджет
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Настройки теста */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Настройки теста
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Имя донатера
                </label>
                <input
                  type="text"
                  value={testData.donor_name}
                  onChange={(e) => setTestData({...testData, donor_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сумма (₽)
                </label>
                <input
                  type="number"
                  value={testData.amount}
                  onChange={(e) => setTestData({...testData, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сообщение
                </label>
                <textarea
                  value={testData.message}
                  onChange={(e) => setTestData({...testData, message: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Список алертов */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Доступные алерты
            </h2>
            
            {tiers.length === 0 ? (
              <div className="text-center py-8">
                <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Нет настроенных алертов</p>
                <Button
                  onClick={() => router.push('/dashboard/settings')}
                  className="mt-4"
                >
                  Настроить алерты
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{tier.icon}</span>
                        <div>
                          <h3 className="font-medium text-gray-900">{tier.name}</h3>
                          <p className="text-sm text-gray-500">
                            {tier.min_amount}₽ - {tier.max_amount ? `${tier.max_amount}₽` : '∞'}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => testAlert(tier)}
                        disabled={testingTier === tier.id}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {testingTier === tier.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Тестирование...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Тест
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CSS анимации */}
        <style jsx>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          
          @keyframes confetti {
            0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          
          @keyframes fireworks {
            0% { transform: scale(0); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.8; }
            100% { transform: scale(0); opacity: 0; }
          }
          
          @keyframes hearts {
            0% { transform: scale(0) rotate(0deg); opacity: 1; }
            50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
            100% { transform: scale(0) rotate(360deg); opacity: 0; }
          }
          
          @keyframes sparkles {
            0% { transform: scale(0) rotate(0deg); opacity: 1; }
            50% { transform: scale(1.5) rotate(180deg); opacity: 0.8; }
            100% { transform: scale(0) rotate(360deg); opacity: 0; }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}</style>
      </div>
    </DashboardLayout>
  );
}

export default function AlertTestPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <AlertTestContent />
    </Suspense>
  );
} 