'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { alertAPI } from '@/lib/api';
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
  TestTube
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

// Дефолтные тиры убраны - настройки создаются при регистрации и хранятся в БД

const ANIMATION_TYPES = [
  { value: 'none', label: 'Без анимации', icon: '❌' },
  { value: 'sparkles', label: 'Искры', icon: '✨' },
  { value: 'confetti', label: 'Конфетти', icon: '🎊' },
  { value: 'fireworks', label: 'Фейерверк', icon: '🎆' },
  { value: 'hearts', label: 'Сердечки', icon: '💖' },
  { value: 'gif', label: 'Своя GIF', icon: '🎬' }
];

const SOUND_PRESETS = [
  { value: '/sounds/ding.mp3', label: 'Динь' },
  { value: '/sounds/coin.mp3', label: 'Монетка' },
  { value: '/sounds/notification.mp3', label: 'Уведомление' },
  { value: '/sounds/success.mp3', label: 'Успех' },
  { value: '/sounds/fanfare.mp3', label: 'Фанфары' },
  { value: '/sounds/applause.mp3', label: 'Аплодисменты' }
];

export default function AlertSettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<AlertSettings>({
    alerts_enabled: true,
    tiers: [],
    show_anonymous: true,
    min_display_time: 2,
    max_display_time: 15
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [previewTier, setPreviewTier] = useState<string | null>(null);
  const [userFiles, setUserFiles] = useState<{audio_files: any[], image_files: any[]}>({audio_files: [], image_files: []});

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadSettings();
      loadUserFiles();
    }
  }, [user, authLoading]);

  const loadSettings = async () => {
    try {
      const response = await alertAPI.getSettings();
      // Всегда используем данные с сервера
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

  const updateTier = (tierId: string, updates: Partial<AlertTier>) => {
    setSettings(prev => ({
      ...prev,
      tiers: prev.tiers.map(tier => 
        tier.id === tierId ? { ...tier, ...updates } : tier
      )
    }));
  };

  const addNewTier = async () => {
    try {
      setSaving(true);
      const response = await alertAPI.createTier();
      setSettings(response.data);
      setActiveTab(response.data.tiers.length - 1);
      setMessage('Новый уровень создан! 🎉');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Произошла ошибка при создании уровня';
      setMessage(errorMessage);
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
      
      setMessage('Уровень удален! 🗑️');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Произошла ошибка при удалении уровня';
      setMessage(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!settings.tiers[activeTab]) {
      setMessage('Нет выбранного уровня для сохранения');
      return;
    }
    
    setSaving(true);
    setMessage('');

    try {
      const currentTier = settings.tiers[activeTab];
      const response = await alertAPI.updateTier(currentTier.id, currentTier);
      setSettings(response.data);
      setMessage('Уровень успешно сохранен! 🎉');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Произошла ошибка при сохранении';
      setMessage(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGeneralSettings = async () => {
    setSaving(true);
    setMessage('');

    try {
      // Сохраняем только общие настройки (не тиры)
      const generalSettings = {
        alerts_enabled: settings.alerts_enabled,
        show_anonymous: settings.show_anonymous,
        banned_words: settings.banned_words,
        min_display_time: settings.min_display_time,
        max_display_time: settings.max_display_time
      };
      
      const response = await alertAPI.updateSettings(generalSettings);
      setSettings(response.data);
      setMessage('Общие настройки сохранены! 🎉');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Произошла ошибка при сохранении общих настроек';
      setMessage(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const testAlert = (tier: AlertTier) => {
    // Переходим на страницу теста с указанным tier
    router.push(`/dashboard/settings/test?tier=${tier.id}`);
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
    const isPreview = previewTier === tier.id;
    
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
        className={`cursor-pointer rounded-xl p-4 border-2 transition-all duration-300 ${
          isActive 
            ? 'border-purple-500 bg-purple-500/10' 
            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
        } ${isPreview ? 'animate-pulse ring-2 ring-purple-400' : ''}`}
        onClick={() => setActiveTab(index)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${colorClasses[tier.color as keyof typeof colorClasses]} flex items-center justify-center`}>
              {getIconComponent(tier.icon)}
            </div>
            <div>
              <h3 className="text-white font-bold">{tier.name}</h3>
              <p className="text-gray-400 text-sm">
                {tier.min_amount}₽ {tier.max_amount ? `- ${tier.max_amount}₽` : '+ и выше'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                testAlert(tier);
              }}
              className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              title="Тест алерта"
            >
              <Play className="w-4 h-4 text-white" />
            </button>
            
            {settings.tiers.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTier(tier.id);
                }}
                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                title="Удалить уровень"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className={`px-2 py-1 rounded ${tier.sound_enabled ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'}`}>
            {tier.sound_enabled ? '🔊 Звук' : '🔇 Без звука'}
          </div>
          <div className={`px-2 py-1 rounded ${tier.animation_enabled ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-500/20 text-gray-400'}`}>
            {tier.animation_enabled ? '✨ Анимация' : '❌ Без анимации'}
          </div>
          <div className={`px-2 py-1 rounded ${tier.screen_shake ? 'bg-red-500/20 text-red-300' : 'bg-gray-500/20 text-gray-400'}`}>
            {tier.screen_shake ? '📳 Тряска' : '🚫 Без тряски'}
          </div>
        </div>
      </div>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-6"></div>
            <p className="text-gray-300 text-lg">Загружаем настройки алертов...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentTier = settings.tiers[activeTab];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Настройки алертов</h1>
              <p className="text-gray-200">Настройте разные алерты для разных сумм донатов</p>
            </div>
          </div>

          {/* Global Toggle */}
          <div className="bg-gray-800/70 backdrop-blur-md rounded-xl border border-gray-700/50 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Включить алерты</h3>
                  <p className="text-gray-400 text-sm">Показывать уведомления о донатах</p>
                </div>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.alerts_enabled}
                  onChange={(e) => setSettings({...settings, alerts_enabled: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('успешно') 
                ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
                : 'bg-red-500/20 border border-red-500/30 text-red-300'
            }`}>
              {message}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Tiers List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/70 backdrop-blur-md rounded-xl border border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Уровни алертов</h2>
                <button
                  onClick={addNewTier}
                  className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                  title="Добавить уровень"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
              
              <div className="space-y-4">
                {settings.tiers.map((tier, index) => (
                  <TierCard key={tier.id} tier={tier} index={index} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Tier Settings */}
          <div className="lg:col-span-2">
            {currentTier && (
              <div className="bg-gray-800/70 backdrop-blur-md rounded-xl border border-gray-700/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${
                      currentTier.color === 'gray' ? 'from-gray-600 to-gray-800' :
                      currentTier.color === 'purple' ? 'from-purple-600 to-purple-800' :
                      currentTier.color === 'red' ? 'from-red-600 to-red-800' :
                      currentTier.color === 'yellow' ? 'from-yellow-600 to-orange-600' :
                      currentTier.color === 'blue' ? 'from-blue-600 to-blue-800' :
                      'from-green-600 to-green-800'
                    } flex items-center justify-center`}>
                      {getIconComponent(currentTier.icon)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{currentTier.name}</h2>
                      <p className="text-gray-300">Настройки для этого уровня</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => testAlert(currentTier)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                  >
                    <TestTube className="w-4 h-4" />
                    <span className="text-white font-medium">Тест</span>
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                  {/* Basic Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-purple-400" />
                      Основные настройки
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Название уровня
                        </label>
                        <input
                          type="text"
                          value={currentTier.name}
                          onChange={(e) => updateTier(currentTier.id, { name: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Минимальная сумма (₽)
                        </label>
                        <input
                          type="number"
                          value={currentTier.min_amount}
                          onChange={(e) => updateTier(currentTier.id, { min_amount: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Максимальная сумма (₽)
                        </label>
                        <input
                          type="number"
                          value={currentTier.max_amount || ''}
                          onChange={(e) => updateTier(currentTier.id, { max_amount: e.target.value ? parseInt(e.target.value) : undefined })}
                          placeholder="Не ограничено"
                          className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Длительность показа (сек)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={currentTier.alert_duration}
                          onChange={(e) => updateTier(currentTier.id, { alert_duration: parseInt(e.target.value) || 1 })}
                          className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sound Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Volume2 className="w-5 h-5 mr-2 text-green-400" />
                      Звуковые настройки
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-200">Включить звук</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={currentTier.sound_enabled}
                            onChange={(e) => updateTier(currentTier.id, { sound_enabled: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                      
                      {currentTier.sound_enabled && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                              Громкость: {Math.round(currentTier.sound_volume * 100)}%
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={currentTier.sound_volume}
                              onChange={(e) => updateTier(currentTier.id, { sound_volume: parseFloat(e.target.value) })}
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                              Звуковой файл
                            </label>
                            <div className="space-y-3">
                              <select
                                value={currentTier.sound_file_url || ''}
                                onChange={(e) => updateTier(currentTier.id, { sound_file_url: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                              >
                                <option value="">Выберите звук</option>
                                {SOUND_PRESETS.map(sound => (
                                  <option key={sound.value} value={sound.value}>
                                    {sound.label}
                                  </option>
                                ))}
                              </select>
                              
                              <div className="flex items-center space-x-2">
                                <input
                                  type="file"
                                  accept=".mp3,.wav,.ogg"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      try {
                                        setMessage('Загружаем аудио файл...');
                                        const response = await alertAPI.uploadAudio(file);
                                        updateTier(currentTier.id, { sound_file_url: response.data.file_url });
                                        await loadUserFiles();
                                        setMessage('Аудио файл загружен! 🎵');
                                        setTimeout(() => setMessage(''), 3000);
                                      } catch (error: any) {
                                        const errorMessage = error.response?.data?.detail || 'Ошибка загрузки файла';
                                        setMessage(errorMessage);
                                      }
                                    }
                                  }}
                                  className="hidden"
                                  id={`audio-upload-${currentTier.id}`}
                                />
                                <label
                                  htmlFor={`audio-upload-${currentTier.id}`}
                                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer transition-colors"
                                >
                                  <Upload className="w-4 h-4" />
                                  <span className="text-sm text-white">Загрузить MP3</span>
                                </label>
                                
                                {currentTier.sound_file_url && currentTier.sound_file_url.startsWith('/static/uploads/') && (
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      try {
                                        await alertAPI.deleteFile(currentTier.sound_file_url!);
                                        updateTier(currentTier.id, { sound_file_url: '' });
                                        await loadUserFiles();
                                        setMessage('Файл удален! 🗑️');
                                        setTimeout(() => setMessage(''), 3000);
                                      } catch (error: any) {
                                        const errorMessage = error.response?.data?.detail || 'Ошибка удаления файла';
                                        setMessage(errorMessage);
                                      }
                                    }}
                                    className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                    title="Удалить файл"
                                  >
                                    <Trash2 className="w-4 h-4 text-white" />
                                  </button>
                                )}
                              </div>
                              
                              {currentTier.sound_file_url && (
                                <audio controls className="w-full">
                                  <source src={currentTier.sound_file_url} type="audio/mpeg" />
                                  Ваш браузер не поддерживает аудио элемент.
                                </audio>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Visual Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Eye className="w-5 h-5 mr-2 text-blue-400" />
                      Визуальные настройки
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Цвет текста
                        </label>
                        <input
                          type="color"
                          value={currentTier.text_color}
                          onChange={(e) => updateTier(currentTier.id, { text_color: e.target.value })}
                          className="w-full h-12 bg-gray-700/70 border border-gray-600 rounded-lg cursor-pointer"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Цвет фона
                        </label>
                        <input
                          type="color"
                          value={currentTier.background_color}
                          onChange={(e) => updateTier(currentTier.id, { background_color: e.target.value })}
                          className="w-full h-12 bg-gray-700/70 border border-gray-600 rounded-lg cursor-pointer"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Размер шрифта (px)
                        </label>
                        <input
                          type="number"
                          min="12"
                          max="72"
                          value={currentTier.font_size}
                          onChange={(e) => updateTier(currentTier.id, { font_size: parseInt(e.target.value) || 12 })}
                          className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-200">Тряска экрана</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={currentTier.screen_shake}
                            onChange={(e) => updateTier(currentTier.id, { screen_shake: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Animation Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                      Анимация и эффекты
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-200">Включить анимацию</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={currentTier.animation_enabled}
                            onChange={(e) => updateTier(currentTier.id, { animation_enabled: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                      
                      {currentTier.animation_enabled && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">
                              Тип анимации
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {ANIMATION_TYPES.map(animation => (
                                <button
                                  key={animation.value}
                                  type="button"
                                  onClick={() => updateTier(currentTier.id, { animation_type: animation.value as any })}
                                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                                    currentTier.animation_type === animation.value
                                      ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                                      : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                                  }`}
                                >
                                  <div className="text-2xl mb-1">{animation.icon}</div>
                                  <div className="text-xs">{animation.label}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          {currentTier.animation_type === 'gif' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-200 mb-2">
                                GIF/Изображение
                              </label>
                              <div className="space-y-3">
                                <input
                                  type="url"
                                  value={currentTier.gif_url || ''}
                                  onChange={(e) => updateTier(currentTier.id, { gif_url: e.target.value })}
                                  placeholder="https://example.com/animation.gif"
                                  className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                
                                <div className="flex items-center justify-center">
                                  <span className="text-gray-400 text-sm">или</span>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="file"
                                    accept=".gif,.png,.jpg,.jpeg,.webp"
                                                                         onChange={async (e) => {
                                       const file = e.target.files?.[0];
                                       if (file) {
                                         try {
                                           setMessage('Загружаем изображение...');
                                           const response = await alertAPI.uploadImage(file);
                                           updateTier(currentTier.id, { gif_url: response.data.file_url });
                                           await loadUserFiles();
                                           setMessage('Изображение загружено! 🖼️');
                                           setTimeout(() => setMessage(''), 3000);
                                         } catch (error: any) {
                                           const errorMessage = error.response?.data?.detail || 'Ошибка загрузки файла';
                                           setMessage(errorMessage);
                                         }
                                       }
                                     }}
                                    className="hidden"
                                    id={`image-upload-${currentTier.id}`}
                                  />
                                  <label
                                    htmlFor={`image-upload-${currentTier.id}`}
                                    className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg cursor-pointer transition-colors"
                                  >
                                    <Image className="w-4 h-4" />
                                    <span className="text-sm text-white">Загрузить файл</span>
                                  </label>
                                  
                                  {currentTier.gif_url && currentTier.gif_url.startsWith('/static/uploads/') && (
                                    <button
                                      type="button"
                                                                             onClick={async () => {
                                         try {
                                           await alertAPI.deleteFile(currentTier.gif_url!);
                                           updateTier(currentTier.id, { gif_url: '' });
                                           await loadUserFiles();
                                           setMessage('Файл удален! 🗑️');
                                           setTimeout(() => setMessage(''), 3000);
                                         } catch (error: any) {
                                           const errorMessage = error.response?.data?.detail || 'Ошибка удаления файла';
                                           setMessage(errorMessage);
                                         }
                                       }}
                                      className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                      title="Удалить файл"
                                    >
                                      <Trash2 className="w-4 h-4 text-white" />
                                    </button>
                                  )}
                                </div>
                                
                                {currentTier.gif_url && (
                                  <div className="bg-gray-700/50 rounded-lg p-3">
                                    <p className="text-gray-300 text-sm mb-2">Предпросмотр:</p>
                                    <img
                                      src={currentTier.gif_url}
                                      alt="Предпросмотр"
                                      className="max-w-full max-h-32 rounded-lg mx-auto block"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Text Template */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Type className="w-5 h-5 mr-2 text-yellow-400" />
                      Шаблон текста
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Шаблон сообщения
                      </label>
                      <textarea
                        value={currentTier.text_template}
                        onChange={(e) => updateTier(currentTier.id, { text_template: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Используйте {donor_name}, {amount}, {message}"
                      />
                      <p className="text-gray-400 text-sm mt-2">
                        Доступные переменные: <code>{'{donor_name}'}</code>, <code>{'{amount}'}</code>, <code>{'{message}'}</code>
                      </p>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                    <div className="text-gray-400 text-sm">
                      Изменения сохраняются для выбранного уровня
                    </div>
                    
                    <Button
                      type="submit"
                      loading={saving}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      Сохранить настройки
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* File Management Section */}
        <div className="mt-8">
          <div className="bg-gray-800/70 backdrop-blur-md rounded-xl border border-gray-700/50 p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-blue-400" />
              Управление файлами
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Audio Files */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Music className="w-5 h-5 mr-2 text-green-400" />
                  Аудио файлы ({userFiles.audio_files.length})
                </h3>
                
                {userFiles.audio_files.length > 0 ? (
                  <div className="space-y-3">
                    {userFiles.audio_files.map((file, index) => (
                      <div key={index} className="bg-gray-700/50 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">
                            {file.url.split('/').pop()}
                          </p>
                          <p className="text-gray-400 text-sm">
                            Используется в: {file.tier_name}
                          </p>
                          <audio controls className="w-full mt-2">
                            <source src={file.url} type="audio/mpeg" />
                          </audio>
                        </div>
                        
                        <button
                          onClick={async () => {
                            try {
                              await alertAPI.deleteFile(file.url);
                              await loadUserFiles();
                              setMessage('Аудио файл удален! 🗑️');
                              setTimeout(() => setMessage(''), 3000);
                            } catch (error: any) {
                              const errorMessage = error.response?.data?.detail || 'Ошибка удаления файла';
                              setMessage(errorMessage);
                            }
                          }}
                          className="ml-3 p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                          title="Удалить файл"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    Загруженных аудио файлов пока нет
                  </p>
                )}
              </div>

              {/* Image Files */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Image className="w-5 h-5 mr-2 text-purple-400" />
                  Изображения ({userFiles.image_files.length})
                </h3>
                
                {userFiles.image_files.length > 0 ? (
                  <div className="space-y-3">
                    {userFiles.image_files.map((file, index) => (
                      <div key={index} className="bg-gray-700/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">
                              {file.url.split('/').pop()}
                            </p>
                            <p className="text-gray-400 text-sm">
                              Используется в: {file.tier_name}
                            </p>
                          </div>
                          
                          <button
                            onClick={async () => {
                              try {
                                await alertAPI.deleteFile(file.url);
                                await loadUserFiles();
                                setMessage('Изображение удалено! 🗑️');
                                setTimeout(() => setMessage(''), 3000);
                              } catch (error: any) {
                                const errorMessage = error.response?.data?.detail || 'Ошибка удаления файла';
                                setMessage(errorMessage);
                              }
                            }}
                            className="ml-3 p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            title="Удалить файл"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                        
                        <img
                          src={file.url}
                          alt="Предпросмотр"
                          className="max-w-full max-h-24 rounded-lg mx-auto block"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    Загруженных изображений пока нет
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 