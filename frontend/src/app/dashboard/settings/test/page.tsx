'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { alertAPI } from '@/lib/api';
import { 
  Play,
  ArrowLeft,
  Volume2,
  VolumeX,
  RotateCcw,
  Settings,
  TestTube,
  Sparkles
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

export default function AlertTestPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tiers, setTiers] = useState<AlertTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingTier, setTestingTier] = useState<string | null>(null);
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

  const testAlert = async (tier: AlertTier) => {
    setTestingTier(tier.id);

    // Воспроизводим звук если включен
    if (tier.sound_enabled && tier.sound_file_url) {
      try {
        const audio = new Audio(tier.sound_file_url);
        audio.volume = tier.sound_volume;
        await audio.play();
      } catch (error) {
        console.log('Sound playback failed:', error);
      }
    }

    // Показываем визуальный алерт
    if (tier.visual_enabled) {
      showVisualAlert(tier);
    }

    // Останавливаем тест через заданное время
    setTimeout(() => {
      setTestingTier(null);
    }, tier.alert_duration * 1000);
  };

  const showVisualAlert = (tier: AlertTier) => {
    // Создаем временный элемент для алерта
    const alertElement = document.createElement('div');
    alertElement.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-6 rounded-xl shadow-2xl transition-all duration-500';
    alertElement.style.backgroundColor = tier.background_color;
    alertElement.style.color = tier.text_color;
    alertElement.style.fontSize = `${tier.font_size}px`;
    alertElement.style.fontWeight = 'bold';
    alertElement.style.textAlign = 'center';
    alertElement.style.minWidth = '300px';
    alertElement.style.maxWidth = '600px';

    // Добавляем highlight если есть
    if (tier.highlight_color) {
      alertElement.style.border = `3px solid ${tier.highlight_color}`;
      alertElement.style.boxShadow = `0 0 20px ${tier.highlight_color}40`;
    }

    // Форматируем текст
    const formattedText = tier.text_template
      .replace('{donor_name}', testData.donor_name)
      .replace('{amount}', testData.amount)
      .replace('{message}', testData.message);

    alertElement.innerHTML = formattedText;

    // Добавляем анимацию
    if (tier.animation_enabled) {
      addAnimation(alertElement, tier.animation_type);
    }

    // Тряска экрана
    if (tier.screen_shake) {
      document.body.style.animation = 'shake 0.5s ease-in-out 3';
    }

    // Добавляем на страницу
    document.body.appendChild(alertElement);

    // Анимация появления
    setTimeout(() => {
      alertElement.style.transform = 'translate(-50%, 0) scale(1)';
      alertElement.style.opacity = '1';
    }, 100);

    // Удаляем через время
    setTimeout(() => {
      alertElement.style.transform = 'translate(-50%, -100px) scale(0.8)';
      alertElement.style.opacity = '0';
      setTimeout(() => {
        if (alertElement.parentNode) {
          document.body.removeChild(alertElement);
        }
        document.body.style.animation = '';
      }, 500);
    }, tier.alert_duration * 1000);
  };

  const addAnimation = (element: HTMLElement, type: string) => {
    const animationContainer = document.createElement('div');
    animationContainer.className = 'absolute inset-0 pointer-events-none overflow-hidden';

    switch (type) {
      case 'sparkles':
        for (let i = 0; i < 20; i++) {
          const sparkle = document.createElement('div');
          sparkle.innerHTML = '✨';
          sparkle.className = 'absolute animate-ping';
          sparkle.style.left = `${Math.random() * 100}%`;
          sparkle.style.top = `${Math.random() * 100}%`;
          sparkle.style.animationDelay = `${Math.random() * 2}s`;
          animationContainer.appendChild(sparkle);
        }
        break;
      
      case 'confetti':
        for (let i = 0; i < 30; i++) {
          const confetti = document.createElement('div');
          confetti.innerHTML = '🎊';
          confetti.className = 'absolute animate-bounce';
          confetti.style.left = `${Math.random() * 100}%`;
          confetti.style.animationDelay = `${Math.random() * 1}s`;
          confetti.style.animationDuration = '2s';
          animationContainer.appendChild(confetti);
        }
        break;
      
      case 'fireworks':
        for (let i = 0; i < 15; i++) {
          const firework = document.createElement('div');
          firework.innerHTML = '🎆';
          firework.className = 'absolute animate-ping';
          firework.style.left = `${Math.random() * 100}%`;
          firework.style.top = `${Math.random() * 100}%`;
          firework.style.animationDelay = `${Math.random() * 3}s`;
          animationContainer.appendChild(firework);
        }
        break;
      
      case 'hearts':
        for (let i = 0; i < 10; i++) {
          const heart = document.createElement('div');
          heart.innerHTML = '💖';
          heart.className = 'absolute animate-pulse';
          heart.style.left = `${Math.random() * 100}%`;
          heart.style.top = `${Math.random() * 100}%`;
          heart.style.animationDelay = `${Math.random() * 2}s`;
          animationContainer.appendChild(heart);
        }
        break;
    }

    element.appendChild(animationContainer);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-6"></div>
            <p className="text-gray-300 text-lg">Загружаем тест алертов...</p>
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <TestTube className="w-6 h-6 text-white" />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-white">Тест алертов</h1>
              <p className="text-gray-200">Проверьте как выглядят ваши алерты в действии</p>
            </div>
          </div>
        </div>

        {/* Test Data Form */}
        <div className="bg-gray-800/70 backdrop-blur-md rounded-xl border border-gray-700/50 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-purple-400" />
            Данные для теста
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Имя донатера
              </label>
              <input
                type="text"
                value={testData.donor_name}
                onChange={(e) => setTestData({...testData, donor_name: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="TestUser"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Сумма (₽)
              </label>
              <input
                type="number"
                value={testData.amount}
                onChange={(e) => setTestData({...testData, amount: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Сообщение
              </label>
              <input
                type="text"
                value={testData.message}
                onChange={(e) => setTestData({...testData, message: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Тестовое сообщение!"
              />
            </div>
          </div>
        </div>

        {/* Alert Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tiers.map((tier) => {
            const isTesting = testingTier === tier.id;
            
            const colorClasses = {
              gray: 'from-gray-600 to-gray-800',
              purple: 'from-purple-600 to-purple-800',
              red: 'from-red-600 to-red-800',
              yellow: 'from-yellow-600 to-orange-600',
              blue: 'from-blue-600 to-blue-800',
              green: 'from-green-600 to-green-800'
            };

            return (
              <div
                key={tier.id}
                className={`bg-gray-800/70 backdrop-blur-md rounded-xl border border-gray-700/50 p-6 transition-all duration-300 ${
                  isTesting ? 'ring-2 ring-purple-500 bg-purple-500/10' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorClasses[tier.color as keyof typeof colorClasses]} flex items-center justify-center`}>
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                      <p className="text-gray-400 text-sm">
                        {tier.min_amount}₽ {tier.max_amount ? `- ${tier.max_amount}₽` : '+ и выше'}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => testAlert(tier)}
                    disabled={isTesting}
                    className={`px-4 py-2 ${
                      isTesting 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'
                    } transition-colors`}
                  >
                    {isTesting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Preview Settings */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Звук:</span>
                    <div className="flex items-center space-x-1">
                      {tier.sound_enabled ? (
                        <>
                          <Volume2 className="w-4 h-4 text-green-400" />
                          <span className="text-green-400">{Math.round(tier.sound_volume * 100)}%</span>
                        </>
                      ) : (
                        <>
                          <VolumeX className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-500">Выкл</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Анимация:</span>
                    <span className={tier.animation_enabled ? 'text-purple-400' : 'text-gray-500'}>
                      {tier.animation_enabled ? tier.animation_type : 'Нет'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Длительность:</span>
                    <span className="text-blue-400">{tier.alert_duration}с</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Тряска:</span>
                    <span className={tier.screen_shake ? 'text-red-400' : 'text-gray-500'}>
                      {tier.screen_shake ? 'Да' : 'Нет'}
                    </span>
                  </div>
                </div>

                {/* Preview Text */}
                <div className="mt-4 p-3 rounded-lg border border-gray-600" style={{
                  backgroundColor: tier.background_color + '40',
                  borderColor: tier.text_color + '20'
                }}>
                  <p className="text-xs text-gray-400 mb-1">Предпросмотр:</p>
                  <p 
                    className="font-medium"
                    style={{ 
                      color: tier.text_color,
                      fontSize: `${Math.min(tier.font_size, 14)}px`
                    }}
                  >
                    {tier.text_template
                      .replace('{donor_name}', testData.donor_name)
                      .replace('{amount}', testData.amount)
                      .replace('{message}', testData.message)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {tiers.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-800/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <TestTube className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Нет настроенных алертов
            </h3>
            <p className="text-gray-400 mb-6">
              Сначала настройте алерты, чтобы их можно было протестировать
            </p>
            <Button 
              onClick={() => router.push('/dashboard/settings')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Settings className="w-4 h-4 mr-2" />
              Перейти к настройкам
            </Button>
          </div>
        )}
      </div>

      {/* CSS для анимаций */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
      `}</style>
    </div>
  );
} 