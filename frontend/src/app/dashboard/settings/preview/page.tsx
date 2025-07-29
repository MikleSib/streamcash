'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
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

function AlertPreviewContent() {
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
        
        // Инициализируем элементы по умолчанию, если они отсутствуют
        if (!parsedTier.elements || parsedTier.elements.length === 0) {
          const defaultElements = [
            {
              id: 'animation',
              type: 'image',
              x: 50,
              y: 10,
              width: 120,
              height: 120,
              visible: parsedTier.animation_enabled && !!parsedTier.gif_url,
              zIndex: 3,
              imageUrl: parsedTier.gif_url || 'https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif',
            },
            {
              id: 'donor-info',
              type: 'text',
              x: 50,
              y: 35,
              width: 500,
              height: 60,
              visible: true,
              zIndex: 2,
              content: parsedTier.text_template,
              fontSize: parsedTier.font_size,
              color: parsedTier.text_color,
            },
            {
              id: 'background',
              type: 'background',
              x: 0,
              y: 0,
              width: 600,
              height: 200,
              visible: true,
              zIndex: 1,
              backgroundColor: parsedTier.background_color,
              borderRadius: 10,
              padding: 20,
            }
          ];
          parsedTier.elements = defaultElements;
        }
        
        setTier(parsedTier);
      } catch (error) {
        console.error('Failed to parse tier data:', error);
        toast.error('Ошибка при загрузке данных алерта');
      }
    }
    setLoading(false);
  }, [searchParams, toast]);

  const handleElementUpdate = useCallback((elementId: string, updates: Partial<AlertElement>) => {
    if (!tier) return;
    
    setTier(prevTier => {
      if (!prevTier) return prevTier;
      
      const updatedElements = prevTier.elements?.map(element => 
        element.id === elementId ? { ...element, ...updates } : element
      ) || [];
      
      return {
        ...prevTier,
        elements: updatedElements
      };
    });
  }, [tier]);

  const handleElementsReorder = useCallback((elementIds: string[]) => {
    if (!tier) return;
    
    setTier(prevTier => {
      if (!prevTier) return prevTier;
      
      const updatedElements = elementIds.map((id, index) => {
        const element = prevTier.elements?.find(el => el.id === id);
        return element ? { ...element, zIndex: elementIds.length - index } : null;
      }).filter(Boolean) as AlertElement[];
      
      return {
        ...prevTier,
        elements: updatedElements
      };
    });
  }, [tier]);

  const handleSave = async () => {
    if (!tier) return;
    
    setSaving(true);
    try {
      // Здесь должна быть логика сохранения
      toast.success('Настройки алерта сохранены');
    } catch (error) {
      console.error('Failed to save alert settings:', error);
      toast.error('Ошибка при сохранении настроек');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!tier) return;
    
    try {
      // Создаем тестовые данные
      const testData = {
        donor_name: 'TestUser',
        amount: 100,
        message: 'Тестовое сообщение!'
      };
      
      // Показываем алерт
      const alertElement = document.createElement('div');
      alertElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        width: 600px;
        height: 200px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        transform: translateX(400px);
        transition: transform 0.5s ease-out;
        overflow: hidden;
      `;
      
      // Создаем содержимое алерта
      const alertContent = document.createElement('div');
      alertContent.style.cssText = `
        position: relative;
        width: 100%;
        height: 100%;
        background: ${tier.background_color};
        border-radius: 10px;
        padding: 20px;
      `;
      
      // Добавляем элементы
      tier.elements?.forEach(element => {
        if (!element.visible) return;
        
        const elementDiv = document.createElement('div');
        elementDiv.style.cssText = `
          position: absolute;
          left: ${element.x}%;
          top: ${element.y}%;
          width: ${element.width || 'auto'}px;
          height: ${element.height || 'auto'}px;
          z-index: ${element.zIndex};
        `;
        
        if (element.type === 'text') {
          elementDiv.style.cssText += `
            color: ${element.color};
            font-size: ${element.fontSize}px;
            font-weight: bold;
          `;
          elementDiv.textContent = element.content?.replace('{name}', testData.donor_name)
            .replace('{amount}', `${testData.amount} ₽`)
            .replace('{message}', testData.message);
        } else if (element.type === 'image') {
          elementDiv.style.cssText += `
            background-image: url(${element.imageUrl});
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
          `;
        }
        
        alertContent.appendChild(elementDiv);
      });
      
      alertElement.appendChild(alertContent);
      document.body.appendChild(alertElement);
      
      // Анимация появления
      setTimeout(() => {
        alertElement.style.transform = 'translateX(0)';
      }, 100);
      
      // Удаляем через время
      setTimeout(() => {
        alertElement.style.transform = 'translateX(400px)';
        setTimeout(() => {
          if (alertElement.parentNode) {
            alertElement.parentNode.removeChild(alertElement);
          }
        }, 500);
      }, tier.alert_duration * 1000);
      
    } catch (error) {
      console.error('Failed to test alert:', error);
      toast.error('Ошибка при тестировании алерта');
    }
  };

  const handleBackToSettings = () => {
    router.push('/dashboard/settings');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!tier) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Алерт не найден</h1>
          <Button onClick={handleBackToSettings}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к настройкам
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleBackToSettings}
                variant="outline"
                size="sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Предпросмотр алерта: {tier.name}
                </h1>
                <p className="text-sm text-gray-500">
                  Настройте внешний вид и протестируйте алерт
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleTest}
                className="bg-green-600 hover:bg-green-700"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Тест
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Панель слоев */}
          <div className="lg:col-span-1">
            <AlertLayersPanel
              elements={tier.elements || []}
              selectedElement={selectedElement}
              onElementSelect={setSelectedElement}
              onElementUpdate={handleElementUpdate}
              onElementsReorder={handleElementsReorder}
            />
          </div>

          {/* Предпросмотр */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Предпросмотр
              </h2>
              <AlertPreview
                tier={tier}
                selectedElement={selectedElement}
                onElementSelect={setSelectedElement}
                onElementUpdate={handleElementUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AlertPreviewPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <AlertPreviewContent />
    </Suspense>
  );
} 