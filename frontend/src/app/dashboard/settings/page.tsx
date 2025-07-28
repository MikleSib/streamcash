'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/lib/toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { AudioTrimmer } from '@/components/AudioTrimmer';
import { alertAPI, streamerAPI } from '@/lib/api';
import { 
  Volume2, 
  Eye, 
  Type, 
  Filter, 
  RotateCcw, 
  Plus,
  Trash2,
  Settings,
  Play,
  Upload,
  Image,
  Music,
  Zap,
  Star,
  Crown,
  Diamond,
  Gift,
  Sparkles,
  Save,
  TestTube,
  Info,
  CheckCircle,
  XCircle,
  VolumeX,
  Palette,
  Clock,
  DollarSign,
  FileText,
  Lightbulb
} from 'lucide-react';

interface AlertTier {
  id: string;
  name: string;
  min_amount: number;
  max_amount?: number;
  
  // Звук
  sound_enabled: boolean;
  sound_file_url?: string;
  sound_volume: number;
  sound_start_time: number;
  sound_end_time?: number;
  
  // Визуальное оформление
  visual_enabled: boolean;
  alert_duration: number;
  text_color: string;
  background_color: string;
  font_size: number;
  
  // Анимация/GIF
  animation_enabled: boolean;
  animation_type: 'none' | 'gif' | 'confetti' | 'fireworks' | 'hearts' | 'sparkles';
  gif_url?: string;
  
  // Текст
  text_template: string;
  
  // Дополнительные эффекты
  screen_shake: boolean;
  highlight_color?: string;
  
  icon: string;
  color: string;
}

interface AlertSettings {
  id?: number;
  alerts_enabled: boolean;
  tiers: AlertTier[];
  
  // Общие настройки
  show_anonymous: boolean;
  banned_words?: string;
  min_display_time: number;
  max_display_time: number;
}

const ANIMATION_TYPES = [
  { value: 'none', label: 'Без анимации', icon: '❌' },
  { value: 'gif', label: 'Своя GIF', icon: '🎬' }
];

export default function AlertSettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [settings, setSettings] = useState<AlertSettings>({
    alerts_enabled: true,
    tiers: [],
    show_anonymous: true,
    min_display_time: 2,
    max_display_time: 15
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [previewTier, setPreviewTier] = useState<string | null>(null);
  const [userFiles, setUserFiles] = useState<{audio_files: any[], image_files: any[]}>({audio_files: [], image_files: []});
  const [streamerProfile, setStreamerProfile] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadSettings();
      loadUserFiles();
      loadStreamerProfile();
    }
  }, [user, authLoading]);

  const loadSettings = async () => {
    try {
      const response = await alertAPI.getSettings();
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to load alert settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserFiles = async () => {
    try {
      const response = await alertAPI.getUserFiles();
      setUserFiles(response.data);
    } catch (error) {
      console.error('Failed to load user files:', error);
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

  const updateTier = useCallback((tierId: string, updates: Partial<AlertTier>) => {
    setSettings(prev => ({
      ...prev,
      tiers: prev.tiers.map(tier => 
        tier.id === tierId ? { ...tier, ...updates } : tier
      )
    }));
  }, []);

  const addNewTier = async () => {
    try {
      setSaving(true);
      const response = await alertAPI.createTier();
      setSettings(response.data);
      setActiveTab(response.data.tiers.length - 1);
      toast.success('Новый уровень создан!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Произошла ошибка при создании уровня';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const deleteTier = async (tierId: string) => {
    if (settings.tiers.length <= 1) {
      alert('Нельзя удалить последний уровень!');
      return;
    }
    
    if (!confirm('Удалить этот уровень алертов?')) return;
    
    try {
      setSaving(true);
      const response = await alertAPI.deleteTier(tierId);
      setSettings(response.data);
      
      if (activeTab >= response.data.tiers.length) {
        setActiveTab(0);
      }
      
      toast.success('Уровень удален!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Произошла ошибка при удалении уровня';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!settings.tiers[activeTab]) {
      toast.error('Нет выбранного уровня для сохранения');
      return;
    }
    
    setSaving(true);

    try {
      const currentTier = settings.tiers[activeTab];
      const response = await alertAPI.updateTier(currentTier.id, currentTier);
      setSettings(response.data);
      toast.success('Уровень успешно сохранен!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Произошла ошибка при сохранении';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleTrimChange = useCallback((tierId: string, startTime: number, endTime: number | null) => {
    updateTier(tierId, {
      sound_start_time: startTime,
      sound_end_time: endTime ?? undefined
    });
  }, [updateTier]);

  const handlePreview = useCallback((startTime: number, endTime: number | null) => {
    console.log('Предварительный просмотр:', { startTime, endTime });
  }, []);

  const handleSaveGeneralSettings = async () => {
    setSaving(true);

    try {
      const generalSettings = {
        alerts_enabled: settings.alerts_enabled,
        show_anonymous: settings.show_anonymous,
        banned_words: settings.banned_words,
        min_display_time: settings.min_display_time,
        max_display_time: settings.max_display_time
      };
      
      const response = await alertAPI.updateSettings(generalSettings);
      setSettings(response.data);
      toast.success('Общие настройки сохранены!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Произошла ошибка при сохранении общих настроек';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const testAlert = async (tier: AlertTier) => {
    if (!streamerProfile?.donation_url) {
      toast.error('Профиль стримера не настроен');
      return;
    }

    try {
      const widgetUrl = `https://стримкэш.рф/api/v1/alerts/widget/${streamerProfile.donation_url}`;
      const testWindow = window.open(
        widgetUrl, 
        'widget-test',
        'width=800,height=600,resizable=yes,scrollbars=no,menubar=no,toolbar=no,location=no,status=no'
      );

      await new Promise(resolve => setTimeout(resolve, 2000));

      await alertAPI.testAlert(tier.min_amount);
      
      toast.success(`Тест алерт отправлен (${tier.min_amount}₽)!`);
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Ошибка отправки тест алерта';
      toast.error(errorMessage);
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons = {
      Gift,
      Star,
      Crown,
      Diamond,
      Zap,
      Sparkles
    };
    const IconComponent = icons[iconName as keyof typeof icons] || Gift;
    return <IconComponent className="w-5 h-5" />;
  };

  const TierCard = ({ tier, index }: { tier: AlertTier; index: number }) => {
    const isActive = activeTab === index;
    
    return (
      <div 
        className={`cursor-pointer rounded-xl p-5 border-2 transition-all duration-200 ${
          isActive 
            ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 shadow-lg' 
            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-md'
        }`}
        onClick={() => setActiveTab(index)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              isActive 
                ? 'bg-purple-500 text-white' 
                : 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
            }`}>
              {getIconComponent(tier.icon)}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{tier.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {tier.min_amount}₽ {tier.max_amount ? `— ${tier.max_amount}₽` : 'и выше'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                testAlert(tier);
              }}
              className="p-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-md"
              title="Протестировать алерт"
            >
              <Play className="w-4 h-4" />
            </button>
            
            {settings.tiers.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTier(tier.id);
                }}
                className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-md"
                title="Удалить уровень"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div className={`px-3 py-2 rounded-lg text-center text-xs font-medium transition-colors ${
            tier.sound_enabled 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-700' 
              : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-600'
          }`}>
            {tier.sound_enabled ? (
              <>
                <Volume2 className="w-3 h-3 inline mr-1" />Звук
              </>
            ) : (
              <>
                <VolumeX className="w-3 h-3 inline mr-1" />Тишина
              </>
            )}
          </div>
          
          <div className={`px-3 py-2 rounded-lg text-center text-xs font-medium transition-colors ${
            tier.animation_enabled 
              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-700' 
              : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-600'
          }`}>
            {tier.animation_enabled ? (
              <>
                <Sparkles className="w-3 h-3 inline mr-1" />Анимация
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 inline mr-1" />Без анимации
              </>
            )}
          </div>
          
          <div className={`px-3 py-2 rounded-lg text-center text-xs font-medium transition-colors ${
            tier.screen_shake 
              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border border-orange-200 dark:border-orange-700' 
              : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-600'
          }`}>
            {tier.screen_shake ? 'Тряска' : 'Статичный'}
          </div>
        </div>
      </div>
    );
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-600 border-t-transparent mx-auto mb-8"></div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Загружаем настройки</h3>
            <p className="text-gray-600 dark:text-gray-300">Подготавливаем ваши алерты...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

  const currentTier = settings.tiers[activeTab];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">


        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                settings.alerts_enabled 
                  ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
              }`}>
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Алерты включены</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {settings.alerts_enabled 
                    ? 'Зрители будут видеть уведомления о донатах' 
                    : 'Алерты отключены для всех зрителей'
                  }
                </p>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.alerts_enabled}
                onChange={(e) => setSettings({...settings, alerts_enabled: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              <span className={`ml-4 text-sm font-semibold ${
                settings.alerts_enabled 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {settings.alerts_enabled ? 'Включено' : 'Выключено'}
              </span>
            </label>
          </div>
          
          {!settings.alerts_enabled && (
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <div className="flex items-center">
                <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-3" />
                <p className="text-amber-800 dark:text-amber-200 font-medium">
                  Алерты отключены. Зрители не будут видеть уведомления о донатах.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    Уровни алертов
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Настройте разные алерты для разных сумм
                  </p>
                </div>
                
                <button
                  onClick={addNewTier}
                  disabled={saving}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  {saving ? 'Создание...' : 'Добавить'}
                </button>
              </div>
              
              <div className="space-y-4">
                {settings.tiers.map((tier, index) => (
                  <TierCard key={tier.id} tier={tier} index={index} />
                ))}
              </div>
              
              {settings.tiers.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Plus className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Нет настроенных уровней
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Создайте свой первый уровень алертов
                  </p>
                  <button
                    onClick={addNewTier}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-medium"
                  >
                    Создать первый уровень
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {currentTier && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white">
                        {getIconComponent(currentTier.icon)}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{currentTier.name}</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                          Настройки для уровня {currentTier.min_amount}₽{currentTier.max_amount ? ` — ${currentTier.max_amount}₽` : ' и выше'}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => testAlert(currentTier)}
                      className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center"
                    >
                      <TestTube className="w-4 h-4 mr-2" />
                      Тест
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-8">
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <DollarSign className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Основные настройки
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Название уровня
                        </label>
                        <input
                          type="text"
                          value={currentTier.name}
                          onChange={(e) => updateTier(currentTier.id, { name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="Название уровня алерта"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Длительность показа (сек)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={currentTier.alert_duration}
                          onChange={(e) => updateTier(currentTier.id, { alert_duration: parseInt(e.target.value) || 1 })}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">От 1 до 30 секунд</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Минимальная сумма (₽)
                        </label>
                        <input
                          type="number"
                          value={currentTier.min_amount}
                          onChange={(e) => updateTier(currentTier.id, { min_amount: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Максимальная сумма (₽)
                        </label>
                        <input
                          type="number"
                          value={currentTier.max_amount || ''}
                          onChange={(e) => updateTier(currentTier.id, { max_amount: e.target.value ? parseInt(e.target.value) : undefined })}
                          placeholder="Не ограничено"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Оставьте пустым для "и выше"</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <Volume2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Звуковые настройки
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Настройте звуковое сопровождение алерта
                          </p>
                        </div>
                      </div>
                      
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={currentTier.sound_enabled}
                          onChange={(e) => updateTier(currentTier.id, { sound_enabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                        <span className={`ml-3 text-sm font-semibold ${
                          currentTier.sound_enabled 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {currentTier.sound_enabled ? 'Включено' : 'Выключено'}
                        </span>
                      </label>
                    </div>
                    
                    {currentTier.sound_enabled && (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Громкость: {Math.round(currentTier.sound_volume * 100)}%
                          </label>
                          <div className="flex items-center space-x-4">
                            <VolumeX className="w-4 h-4 text-gray-400" />
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.05"
                              value={currentTier.sound_volume}
                              onChange={(e) => updateTier(currentTier.id, { sound_volume: parseFloat(e.target.value) })}
                              className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <Volume2 className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            <Music className="w-4 h-4 inline mr-1" />
                            Звуковой файл
                          </label>
                          <div className="space-y-4">
                            <select
                              value={currentTier.sound_file_url || ''}
                              onChange={(e) => updateTier(currentTier.id, { 
                                sound_file_url: e.target.value,
                                sound_start_time: 0,
                                sound_end_time: undefined
                              })}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                              <option value="">
                                {userFiles.audio_files.length > 0 ? 'Выберите звук из загруженных' : 'Загрузите свой звук'}
                              </option>
                              {userFiles.audio_files.map((file, index) => (
                                <option key={file.url} value={file.url}>
                                  {file.tier_name || `Звук ${index + 1}`}
                                </option>
                              ))}
                            </select>
                            
                            <div className="flex items-center space-x-3">
                              <input
                                type="file"
                                accept=".mp3,.wav,.ogg"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    try {
                                      toast.info('Загружаем аудио файл...');
                                      const response = await alertAPI.uploadAudio(file);
                                      updateTier(currentTier.id, { 
                                        sound_file_url: response.data.file_url,
                                        sound_start_time: 0,
                                        sound_end_time: undefined
                                      });
                                      await loadUserFiles();
                                      toast.success('Аудио файл загружен!');
                                    } catch (error: any) {
                                      const errorMessage = error.response?.data?.detail || 'Ошибка загрузки файла';
                                      toast.error(errorMessage);
                                    }
                                  }
                                }}
                                className="hidden"
                                id={`audio-upload-${currentTier.id}`}
                              />
                              <label
                                htmlFor={`audio-upload-${currentTier.id}`}
                                className="px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl cursor-pointer transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Загрузить MP3
                              </label>
                              
                              {currentTier.sound_file_url && currentTier.sound_file_url.startsWith('/static/uploads/') && (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      await alertAPI.deleteFile(currentTier.sound_file_url!);
                                      updateTier(currentTier.id, { 
                                        sound_file_url: '',
                                        sound_start_time: 0,
                                        sound_end_time: undefined
                                      });
                                      await loadUserFiles();
                                      toast.success('Файл удален!');
                                    } catch (error: any) {
                                      const errorMessage = error.response?.data?.detail || 'Ошибка удаления файла';
                                      toast.error(errorMessage);
                                    }
                                  }}
                                  className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                                  title="Удалить файл"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            
                            {!currentTier.sound_file_url && (
                              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                <div className="flex items-center">
                                  <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                                    <strong>Совет:</strong> Загрузите короткий звук (3-10 секунд) для лучшего эффекта
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {currentTier.sound_file_url && (
                          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Редактор звука</h4>
                            <AudioTrimmer
                              audioUrl={currentTier.sound_file_url}
                              initialStartTime={currentTier.sound_start_time || 0}
                              initialEndTime={currentTier.sound_end_time}
                              onTrimChange={(startTime, endTime) => 
                                handleTrimChange(currentTier.id, startTime, endTime)
                              }
                              onPreview={handlePreview}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          Визуальные настройки
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Настройте внешний вид алерта
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Цвет текста
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={currentTier.text_color}
                            onChange={(e) => updateTier(currentTier.id, { text_color: e.target.value })}
                            className="w-12 h-12 border-2 border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer"
                          />
                          <input
                            type="text"
                            value={currentTier.text_color}
                            onChange={(e) => updateTier(currentTier.id, { text_color: e.target.value })}
                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Цвет фона
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={currentTier.background_color}
                            onChange={(e) => updateTier(currentTier.id, { background_color: e.target.value })}
                            className="w-12 h-12 border-2 border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer"
                          />
                          <input
                            type="text"
                            value={currentTier.background_color}
                            onChange={(e) => updateTier(currentTier.id, { background_color: e.target.value })}
                            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            placeholder="#ffffff"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          <Type className="w-4 h-4 inline mr-1" />
                          Размер шрифта (px)
                        </label>
                        <input
                          type="number"
                          min="12"
                          max="72"
                          value={currentTier.font_size}
                          onChange={(e) => updateTier(currentTier.id, { font_size: parseInt(e.target.value) || 12 })}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">От 12 до 72 пикселей</p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">Эффект тряски</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Встряхивать экран при алерте</span>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={currentTier.screen_shake}
                              onChange={(e) => updateTier(currentTier.id, { screen_shake: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <Sparkles className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Анимация
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Добавьте визуальные эффекты к алерту
                          </p>
                        </div>
                      </div>
                      
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={currentTier.animation_enabled}
                          onChange={(e) => updateTier(currentTier.id, { animation_enabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-pink-600"></div>
                        <span className={`ml-3 text-sm font-semibold ${
                          currentTier.animation_enabled 
                            ? 'text-pink-600 dark:text-pink-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {currentTier.animation_enabled ? 'Включена' : 'Выключена'}
                        </span>
                      </label>
                    </div>
                    
                    {currentTier.animation_enabled && (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                            Выберите тип анимации
                          </label>
                          <div className="grid grid-cols-2 gap-4">
                            {ANIMATION_TYPES.map(animation => (
                              <button
                                key={animation.value}
                                type="button"
                                onClick={() => updateTier(currentTier.id, { animation_type: animation.value as any })}
                                className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                                  currentTier.animation_type === animation.value
                                    ? 'border-pink-500 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 shadow-lg'
                                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-pink-300 dark:hover:border-pink-500 hover:shadow-md'
                                }`}
                              >
                                <div className="text-3xl mb-2">{animation.icon}</div>
                                <div className="text-sm font-medium">{animation.label}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {currentTier.animation_type === 'gif' && (
                          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                              <Image className="w-4 h-4 inline mr-1" />
                              GIF или изображение
                            </label>
                            <div className="space-y-4">
                              <input
                                type="url"
                                value={currentTier.gif_url || ''}
                                onChange={(e) => updateTier(currentTier.id, { gif_url: e.target.value })}
                                placeholder="https://example.com/animation.gif"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                              />
                              
                              <div className="flex items-center justify-center py-2">
                                <span className="px-4 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm rounded-full">или</span>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <input
                                  type="file"
                                  accept=".gif,.png,.jpg,.jpeg,.webp"
                                  onChange={async (e) => {
                                     const file = e.target.files?.[0];
                                     if (file) {
                                       try {
                                         toast.info('Загружаем изображение...');
                                         const response = await alertAPI.uploadImage(file);
                                         updateTier(currentTier.id, { gif_url: response.data.file_url });
                                         await loadUserFiles();
                                         toast.success('Изображение загружено!');
                                       } catch (error: any) {
                                         const errorMessage = error.response?.data?.detail || 'Ошибка загрузки файла';
                                         toast.error(errorMessage);
                                       }
                                     }
                                   }}
                                  className="hidden"
                                  id={`image-upload-${currentTier.id}`}
                                />
                                <label
                                  htmlFor={`image-upload-${currentTier.id}`}
                                  className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl cursor-pointer transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center"
                                >
                                  <Image className="w-4 h-4 mr-2" />
                                  Загрузить файл
                                </label>
                                
                                {currentTier.gif_url && currentTier.gif_url.startsWith('/static/uploads/') && (
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      try {
                                        await alertAPI.deleteFile(currentTier.gif_url!);
                                        updateTier(currentTier.id, { gif_url: '' });
                                        await loadUserFiles();
                                        toast.success('Файл удален!');
                                      } catch (error: any) {
                                        const errorMessage = error.response?.data?.detail || 'Ошибка удаления файла';
                                        toast.error(errorMessage);
                                      }
                                    }}
                                    className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                                    title="Удалить файл"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                              
                              {!currentTier.gif_url && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                  <div className="flex items-center">
                                    <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                                    <p className="text-blue-800 dark:text-blue-200 text-sm">
                                      <strong>Совет:</strong> Используйте анимированные GIF для лучшего эффекта
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              {currentTier.gif_url && (
                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                                  <p className="text-gray-700 dark:text-gray-300 text-sm font-semibold mb-3">Предпросмотр:</p>
                                  <div className="flex justify-center">
                                    <img
                                      src={currentTier.gif_url}
                                      alt="Предпросмотр анимации"
                                      className="max-w-full max-h-40 rounded-lg shadow-md"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {!currentTier.animation_enabled && (
                      <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl p-6 text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Sparkles className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Включите анимацию, чтобы добавить визуальные эффекты к алерту
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          Шаблон текста
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Настройте отображение информации о донате
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Шаблон сообщения
                        </label>
                        <textarea
                          value={currentTier.text_template}
                          onChange={(e) => updateTier(currentTier.id, { text_template: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                          placeholder="Спасибо {donor_name} за донат {amount}₽! 💜"
                        />
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Доступные переменные:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                            <code className="text-blue-600 dark:text-blue-400 font-mono text-sm">{'{donor_name}'}</code>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Имя донатера</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                            <code className="text-green-600 dark:text-green-400 font-mono text-sm">{'{amount}'}</code>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Сумма доната</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                            <code className="text-purple-600 dark:text-purple-400 font-mono text-sm">{'{message}'}</code>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Сообщение</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                        <div className="flex items-center">
                          <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 mr-3" />
                          <div>
                            <p className="text-amber-800 dark:text-amber-200 text-sm font-medium mb-1">
                              Пример шаблона:
                            </p>
                            <code className="text-amber-700 dark:text-amber-300 text-sm bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">
                              Спасибо {'{donor_name}'} за {'{amount}'}₽! {'{message}'}
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                          <Save className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Готово к сохранению
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Настройки будут применены к уровню "{currentTier.name}"
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        type="submit"
                        loading={saving}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Сохранение...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Сохранить настройки
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 