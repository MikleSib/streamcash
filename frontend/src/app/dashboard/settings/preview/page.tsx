'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertPreview } from '@/components/AlertPreview';
import { AlertLayersPanel } from '@/components/AlertLayersPanel';
import { alertAPI } from '@/lib/api';
import { ArrowLeft, Save, TestTube, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/lib/toast';

interface AlertElement {
  id: string;
  type: 'text' | 'image' | 'background';
  x: number;
  y: number;
  width?: number;
  height?: number;
  visible: boolean;
  zIndex: number;
  
  content?: string;
  imageUrl?: string;
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
  padding?: number;
}

interface AlertTier {
  id: string;
  name: string;
  min_amount: number;
  max_amount?: number;
  
  sound_enabled: boolean;
  sound_file_url?: string;
  sound_volume: number;
  sound_start_time: number;
  sound_end_time?: number;
  
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
  
  elements?: AlertElement[];
}

export default function AlertPreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  
  const [tier, setTier] = useState<AlertTier | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  useEffect(() => {
    const tierData = searchParams.get('tier');
    if (tierData) {
      try {
        const parsedTier = JSON.parse(decodeURIComponent(tierData));
        setTier(parsedTier);
      } catch (error) {
        console.error('Ошибка парсинга данных тира:', error);
        router.push('/dashboard/settings');
        return;
      }
    } else {
      router.push('/dashboard/settings');
      return;
    }
    
    setLoading(false);
  }, [searchParams, router]);

  const handleTierUpdate = useCallback((updates: Partial<AlertTier>) => {
    setTier(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const handleSave = async () => {
    if (!tier) return;
    
    setSaving(true);
    try {
      // Отправляем только основные поля тира, исключая возможные лишние
      const tierData = {
        id: tier.id,
        name: tier.name,
        min_amount: tier.min_amount,
        max_amount: tier.max_amount,
        sound_enabled: tier.sound_enabled,
        sound_file_url: tier.sound_file_url,
        sound_volume: tier.sound_volume,
        sound_start_time: tier.sound_start_time,
        sound_end_time: tier.sound_end_time,
        visual_enabled: tier.visual_enabled,
        alert_duration: tier.alert_duration,
        text_color: tier.text_color,
        background_color: tier.background_color,
        font_size: tier.font_size,
        animation_enabled: tier.animation_enabled,
        animation_type: tier.animation_type,
        gif_url: tier.gif_url,
        text_template: tier.text_template,
        screen_shake: tier.screen_shake,
        highlight_color: tier.highlight_color,
        icon: tier.icon,
        color: tier.color,
        elements: tier.elements || []
      };
      
      await alertAPI.updateTier(tier.id, tierData);
      toast.success('Настройки сохранены!');
    } catch (error: any) {
      console.error('Ошибка сохранения:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Ошибка сохранения';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!tier) return;
    
    try {
      await alertAPI.testAlert(tier.min_amount);
      toast.success('Тест алерт отправлен!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Ошибка отправки тест алерта';
      toast.error(errorMessage);
    }
  };



  const handleBackToSettings = () => {
    if (tier) {
      const tierParam = encodeURIComponent(JSON.stringify(tier));
      router.push(`/dashboard/settings?tier=${tierParam}&updated=true`);
    } else {
      router.push('/dashboard/settings');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-white">Загрузка предпросмотра...</p>
        </div>
      </div>
    );
  }

  if (!tier) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Ошибка загрузки</h1>
          <Button onClick={() => router.push('/dashboard/settings')}>
            Вернуться к настройкам
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToSettings}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
              title="Вернуться к настройкам"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Предпросмотр алерта: {tier.name}
                </h1>
                <p className="text-gray-400 text-sm">
                  {tier.min_amount}₽{tier.max_amount ? ` — ${tier.max_amount}₽` : ' и выше'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleTest}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium flex items-center"
            >
              <TestTube className="w-4 h-4 mr-2" />
              Тест алерт
            </button>
            
            <Button
              onClick={handleSave}
              loading={saving}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <div className="xl:col-span-3">
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-4 border-b border-gray-700">
                <h2 className="text-lg font-bold text-white">Область предпросмотра</h2>
                <p className="text-gray-300 text-sm">
                  Перетаскивайте элементы для настройки их позиций
                </p>
              </div>
              
              <div className="p-6">
                <div
                  className="relative mx-auto bg-gradient-to-br from-gray-800 to-purple-800 rounded-xl overflow-hidden"
                  style={{
                    width: '800px',
                    height: '600px',
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="white" fill-opacity="0.05"%3E%3Cpath d="M20 20h20v20H20z"/%3E%3C/g%3E%3C/svg%3E")',
                  }}
                >
                  <AlertPreview
                    tier={tier}
                    onTierUpdate={handleTierUpdate}
                    isVisible={true}
                    className="h-full"
                    hideControls={true}
                    fullscreen={true}
                  />
                </div>
              </div>
            </div>
            
            {selectedElement && (() => {
              const element = (tier.elements || []).find(el => el.id === selectedElement);
              if (!element) return null;
              
              return (
                <div className="mt-6 bg-gray-800 rounded-xl border border-gray-700 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Настройки элемента: {
                      element.id === 'animation' ? 'GIF анимация' :
                      element.id === 'donor-info' ? 'Имя и сумма' :
                      element.id === 'message-text' ? 'Сообщение' :
                      element.id
                    }
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Позиция X (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={element.x}
                        onChange={(e) => {
                          const updatedElements = (tier.elements || []).map(el =>
                            el.id === selectedElement ? { ...el, x: parseFloat(e.target.value) } : el
                          );
                          handleTierUpdate({ elements: updatedElements });
                        }}
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Позиция Y (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={element.y}
                        onChange={(e) => {
                          const updatedElements = (tier.elements || []).map(el =>
                            el.id === selectedElement ? { ...el, y: parseFloat(e.target.value) } : el
                          );
                          handleTierUpdate({ elements: updatedElements });
                        }}
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Слой (z-index)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={element.zIndex}
                        onChange={(e) => {
                          const updatedElements = (tier.elements || []).map(el =>
                            el.id === selectedElement ? { ...el, zIndex: parseInt(e.target.value) } : el
                          );
                          handleTierUpdate({ elements: updatedElements });
                        }}
                        className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    
                    {element.type === 'text' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Ширина блока (px)
                          </label>
                          <input
                            type="number"
                            min="100"
                            max="600"
                            value={element.width || 200}
                            onChange={(e) => {
                              const updatedElements = (tier.elements || []).map(el =>
                                el.id === selectedElement ? { ...el, width: parseInt(e.target.value) } : el
                              );
                              handleTierUpdate({ elements: updatedElements });
                            }}
                            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Высота блока (px)
                          </label>
                          <input
                            type="number"
                            min="30"
                            max="200"
                            value={element.height || 60}
                            onChange={(e) => {
                              const updatedElements = (tier.elements || []).map(el =>
                                el.id === selectedElement ? { ...el, height: parseInt(e.target.value) } : el
                              );
                              handleTierUpdate({ elements: updatedElements });
                            }}
                            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Размер шрифта
                          </label>
                          <input
                            type="number"
                            min="10"
                            max="100"
                            value={element.fontSize || 24}
                            onChange={(e) => {
                              const updatedElements = (tier.elements || []).map(el =>
                                el.id === selectedElement ? { ...el, fontSize: parseInt(e.target.value) } : el
                              );
                              handleTierUpdate({ elements: updatedElements });
                            }}
                            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </>
                    )}
                    
                    {element.type === 'image' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Ширина (px)
                          </label>
                          <input
                            type="number"
                            min="50"
                            max="400"
                            value={element.width || 120}
                            onChange={(e) => {
                              const updatedElements = (tier.elements || []).map(el =>
                                el.id === selectedElement ? { ...el, width: parseInt(e.target.value) } : el
                              );
                              handleTierUpdate({ elements: updatedElements });
                            }}
                            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Высота (px)
                          </label>
                          <input
                            type="number"
                            min="50"
                            max="400"
                            value={element.height || 120}
                            onChange={(e) => {
                              const updatedElements = (tier.elements || []).map(el =>
                                el.id === selectedElement ? { ...el, height: parseInt(e.target.value) } : el
                              );
                              handleTierUpdate({ elements: updatedElements });
                            }}
                            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            URL изображения/GIF
                          </label>
                          <input
                            type="url"
                            value={element.imageUrl || ''}
                            onChange={(e) => {
                              const updatedElements = (tier.elements || []).map(el =>
                                el.id === selectedElement ? { ...el, imageUrl: e.target.value } : el
                              );
                              handleTierUpdate({ elements: updatedElements });
                            }}
                            placeholder="https://example.com/animation.gif"
                            className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
          
          <div className="xl:col-span-1">
            <AlertLayersPanel
              elements={tier.elements || []}
              selectedElement={selectedElement}
              onElementSelect={setSelectedElement}
              onElementUpdate={(elementId, updates) => {
                const updatedElements = (tier.elements || []).map(el =>
                  el.id === elementId ? { ...el, ...updates } : el
                );
                handleTierUpdate({ elements: updatedElements });
              }}
              onElementDelete={(elementId) => {
                const updatedElements = (tier.elements || []).filter(el => el.id !== elementId);
                handleTierUpdate({ elements: updatedElements });
                if (selectedElement === elementId) {
                  setSelectedElement(null);
                }
              }}
              onElementAdd={(newElement) => {
                const elementId = `element-${Date.now()}`;
                const elementWithId = { ...newElement, id: elementId };
                const updatedElements = [...(tier.elements || []), elementWithId];
                handleTierUpdate({ elements: updatedElements });
                setSelectedElement(elementId);
              }}
              onElementsReorder={(reorderedElements) => {
                handleTierUpdate({ elements: reorderedElements });
              }}
              className="h-fit max-h-[calc(100vh-200px)] overflow-hidden"
            />
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-6 right-6">
        <div className="bg-gray-800 border border-gray-600 rounded-xl p-4 shadow-lg">
          <div className="flex items-center space-x-3 text-sm text-gray-300">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Изменения сохраняются автоматически</span>
          </div>
        </div>
      </div>
    </div>
  );
} 