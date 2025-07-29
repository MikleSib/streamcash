'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Move, RotateCcw, Eye, EyeOff, Download, Upload, Layers } from 'lucide-react';
import { AlertLayersPanel } from './AlertLayersPanel';

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
  
  visual_enabled: boolean;
  alert_duration: number;
  text_color: string;
  background_color: string;
  font_size: number;
  
  animation_enabled: boolean;
  animation_type: 'none' | 'gif' | 'confetti' | 'fireworks' | 'hearts' | 'sparkles';
  gif_url?: string;
  gif_urls?: string[];
  
  text_template: string;
  screen_shake: boolean;
  highlight_color?: string;
  
  icon: string;
  color: string;
  
  elements?: AlertElement[];
}

interface AlertPreviewProps {
  tier: AlertTier;
  onTierUpdate: (updates: Partial<AlertTier>) => void;
  isVisible: boolean;
  className?: string;
  hideControls?: boolean;
  fullscreen?: boolean;
}

export function AlertPreview({ tier, onTierUpdate, isVisible, className = '', hideControls = false, fullscreen = false }: AlertPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showLayersPanel, setShowLayersPanel] = useState(true);

  const defaultElements: AlertElement[] = [
    {
      id: 'animation',
      type: 'image',
      x: 50,
      y: 10,
      width: 120,
      height: 120,
      visible: tier.animation_enabled && (!!tier.gif_urls?.length || !!tier.gif_url),
      zIndex: 3,
      imageUrl: tier.gif_urls?.length ? tier.gif_urls[0] : (tier.gif_url || 'https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif'),
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
      content: '{donor_name} - {amount}₽',
      fontSize: 32,
      color: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.2)',
      borderRadius: 8,
      padding: 12,
    },
    {
      id: 'message-text',
      type: 'text',
      x: 50,
      y: 55,
      width: 600,
      height: 80,
      visible: true,
      zIndex: 1,
      content: '{message}',
      fontSize: 24,
      color: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.1)',
      borderRadius: 6,
      padding: 16,
    },
  ];

  const elements = tier.elements || defaultElements;

  const handleMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    if (elementId === 'background') return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const rect = previewRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const element = elements.find(el => el.id === elementId);
    if (!element) return;
    
    const elementX = (element.x / 100) * rect.width;
    const elementY = (element.y / 100) * rect.height;
    
    setDragOffset({
      x: e.clientX - rect.left - elementX,
      y: e.clientY - rect.top - elementY,
    });
    
    setDraggedElement(elementId);
    setSelectedElement(elementId);
  }, [elements]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggedElement || !previewRef.current) return;
    
    const rect = previewRef.current.getBoundingClientRect();
    const newX = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100;
    const newY = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100;
    
    const boundedX = Math.max(0, Math.min(100, newX));
    const boundedY = Math.max(0, Math.min(100, newY));
    
    const updatedElements = elements.map(el =>
      el.id === draggedElement 
        ? { ...el, x: boundedX, y: boundedY }
        : el
    );
    
    onTierUpdate({ elements: updatedElements });
  }, [draggedElement, dragOffset, elements, onTierUpdate]);

  const handleMouseUp = useCallback(() => {
    setDraggedElement(null);
  }, []);

  useEffect(() => {
    if (draggedElement) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedElement, handleMouseMove, handleMouseUp]);

  const updateElement = useCallback((elementId: string, updates: Partial<AlertElement>) => {
    const updatedElements = elements.map(el =>
      el.id === elementId ? { ...el, ...updates } : el
    );
    onTierUpdate({ elements: updatedElements });
  }, [elements, onTierUpdate]);

  const resetPositions = useCallback(() => {
    onTierUpdate({ elements: defaultElements });
    setSelectedElement(null);
  }, [onTierUpdate]);

  const exportLayout = useCallback(() => {
    const layout = JSON.stringify(elements, null, 2);
    const blob = new Blob([layout], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alert-layout-${tier.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [elements, tier.name]);

  const importLayout = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedElements = JSON.parse(event.target?.result as string);
        onTierUpdate({ elements: importedElements });
        setSelectedElement(null);
      } catch (error) {
        alert('Ошибка импорта макета. Проверьте файл.');
      }
    };
    reader.readAsText(file);
  }, [onTierUpdate]);

  const addElement = useCallback((newElement: Omit<AlertElement, 'id'>) => {
    const elementId = `element-${Date.now()}`;
    const elementWithId = { ...newElement, id: elementId };
    const updatedElements = [...elements, elementWithId];
    onTierUpdate({ elements: updatedElements });
    setSelectedElement(elementId);
  }, [elements, onTierUpdate]);

  const deleteElement = useCallback((elementId: string) => {
    const updatedElements = elements.filter(el => el.id !== elementId);
    onTierUpdate({ elements: updatedElements });
    if (selectedElement === elementId) {
      setSelectedElement(null);
    }
  }, [elements, onTierUpdate, selectedElement]);

  const reorderElements = useCallback((reorderedElements: AlertElement[]) => {
    onTierUpdate({ elements: reorderedElements });
  }, [onTierUpdate]);

  const renderPreviewElement = (element: AlertElement) => {
    const style = {
      position: 'absolute' as const,
      left: `${element.x}%`,
      top: `${element.y}%`,
      zIndex: element.zIndex,
      cursor: element.type === 'background' ? 'default' : 'move',
      transform: element.type === 'background' 
        ? (draggedElement === element.id ? 'scale(1.05)' : 'scale(1)')
        : (draggedElement === element.id 
          ? 'translate(-50%, -50%) scale(1.05)' 
          : 'translate(-50%, -50%) scale(1)'),
      transition: draggedElement === element.id ? 'none' : 'transform 0.2s ease, border-color 0.2s ease',
      border: selectedElement === element.id ? '2px solid #8b5cf6' : '2px solid transparent',
      borderRadius: '4px',
      opacity: element.visible ? 1 : 0.3,
    };



    if (element.type === 'text') {
      let sampleText = element.content || 'Пример текста';
      
      if (element.id === 'donor-info') {
        sampleText = sampleText
          .replace('{donor_name}', 'Донатер')
          .replace('{amount}', String(tier.min_amount));
      } else if (element.id === 'message-text') {
        sampleText = sampleText.replace('{message}', 'Спасибо за поддержку! 💜');
      } else {
        sampleText = sampleText
          .replace('{donor_name}', 'Донатер')
          .replace('{amount}', String(tier.min_amount))
          .replace('{message}', 'Привет!');
      }

      return (
        <div
          key={element.id}
          className="hover:shadow-lg hover:shadow-purple-500/30 transition-shadow duration-200"
          style={{
            ...style,
            fontSize: `${element.fontSize}px`,
            color: element.color,
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            padding: `${element.padding || 8}px`,
            backgroundColor: element.backgroundColor || 'transparent',
            borderRadius: `${element.borderRadius || 0}px`,
            width: element.width ? `${element.width}px` : 'auto',
            height: element.height ? `${element.height}px` : 'auto',
            minWidth: '100px',
            minHeight: '30px',
            maxWidth: element.width ? `${element.width}px` : '80%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            wordWrap: 'break-word',
            whiteSpace: element.width ? 'normal' : 'nowrap',
          }}
          onMouseDown={(e) => handleMouseDown(e, element.id)}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedElement(element.id);
          }}
        >
          {sampleText}
        </div>
      );
    }

    if (element.type === 'image' && element.imageUrl) {
      return (
        <img
          key={element.id}
          src={element.imageUrl}
          alt="Анимация алерта"
          style={{
            ...style,
            width: `${element.width}px`,
            height: `${element.height}px`,
            objectFit: 'contain',
            borderRadius: `${element.borderRadius || 0}px`,
            userSelect: 'none',
            pointerEvents: 'auto',
          }}
          className="hover:shadow-lg hover:shadow-purple-500/50 transition-shadow duration-200"
          onMouseDown={(e) => handleMouseDown(e, element.id)}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedElement(element.id);
          }}
          draggable={false}
        />
      );
    }

    return null;
  };

  const selectedElementData = elements.find(el => el.id === selectedElement);

  if (!isVisible) return null;

  if (fullscreen) {
    // Полноэкранный режим - только область предпросмотра
          return (
        <div
          ref={previewRef}
          className="relative w-full h-full bg-gradient-to-br from-gray-800 to-purple-800 rounded-xl overflow-hidden cursor-default"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="white" fill-opacity="0.05"%3E%3Cpath d="M20 20h20v20H20z"/%3E%3C/g%3E%3C/svg%3E")',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedElement(null);
            }
          }}
        >
          {elements.map(renderPreviewElement)}
          
          {selectedElement && selectedElementData && (
            <div className="absolute top-2 left-2 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg border border-gray-200 dark:border-gray-600 z-50">
              <div className="flex items-center space-x-2 text-sm">
                <Move className="w-4 h-4 text-purple-500" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedElementData.id === 'animation' ? 'GIF анимация' :
                   selectedElementData.id === 'donor-info' ? 'Имя и сумма' :
                   selectedElementData.id === 'message-text' ? 'Сообщение' :
                   selectedElementData.id}
                </span>
              </div>
            </div>
          )}
        </div>
      );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden ${className}`}>
      {!hideControls && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Предпросмотр алерта</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Перетаскивайте элементы для настройки позиций
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowLayersPanel(!showLayersPanel)}
                className={`p-2 rounded-lg transition-colors ${
                  showLayersPanel
                    ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                title="Показать/скрыть панель слоев"
              >
                <Layers className="w-4 h-4" />
              </button>
              
              <input
                type="file"
                accept=".json"
                onChange={importLayout}
                className="hidden"
                id="import-layout"
              />
              <label
                htmlFor="import-layout"
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors cursor-pointer"
                title="Импорт макета"
              >
                <Upload className="w-4 h-4" />
              </label>
              
              <button
                onClick={exportLayout}
                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                title="Экспорт макета"
              >
                <Download className="w-4 h-4" />
              </button>
              
              <button
                onClick={resetPositions}
                className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                title="Сбросить позиции"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className={`grid gap-6 ${showLayersPanel ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
          <div className={showLayersPanel ? 'lg:col-span-2' : 'col-span-1'}>
                    <div
          ref={previewRef}
          className="relative mx-auto bg-gradient-to-br from-gray-800 to-purple-800 rounded-xl overflow-hidden cursor-default"
          style={{
            width: '800px',
            height: '600px',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="white" fill-opacity="0.05"%3E%3Cpath d="M20 20h20v20H20z"/%3E%3C/g%3E%3C/svg%3E")',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedElement(null);
            }
          }}
        >
              {elements.map(renderPreviewElement)}
              
              {selectedElement && selectedElementData && (
                <div className="absolute top-2 left-2 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg border border-gray-200 dark:border-gray-600 z-50">
                  <div className="flex items-center space-x-2 text-sm">
                    <Move className="w-4 h-4 text-purple-500" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedElementData.id === 'main-text' ? 'Основной текст' :
                       selectedElementData.id === 'background' ? 'Фон' :
                       selectedElementData.id === 'animation' ? 'Анимация' :
                       selectedElementData.id}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {!hideControls && showLayersPanel && (
            <div className="lg:col-span-1">
              <AlertLayersPanel
                elements={elements}
                selectedElement={selectedElement}
                onElementSelect={setSelectedElement}
                onElementUpdate={updateElement}
                onElementDelete={deleteElement}
                onElementAdd={addElement}
                onElementsReorder={reorderElements}
              />
            </div>
          )}
        </div>

        {!hideControls && selectedElementData && selectedElementData.id !== 'background' && (
          <div className="mt-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
              Настройки элемента: {selectedElementData.id === 'animation' ? 'GIF анимация' : 
                                   selectedElementData.id === 'donor-info' ? 'Имя и сумма' : 
                                   selectedElementData.id === 'message-text' ? 'Сообщение' :
                                   selectedElementData.id}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Видимость
                </label>
                <button
                  onClick={() => updateElement(selectedElementData.id, { visible: !selectedElementData.visible })}
                  className={`p-2 rounded-lg transition-colors ${
                    selectedElementData.visible
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {selectedElementData.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              

              
              {selectedElementData.type === 'text' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ширина блока (px)
                    </label>
                    <input
                      type="number"
                      min="100"
                      max="600"
                      value={selectedElementData.width || 200}
                      onChange={(e) => updateElement(selectedElementData.id, { width: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Высота блока (px)
                    </label>
                    <input
                      type="number"
                      min="30"
                      max="200"
                      value={selectedElementData.height || 60}
                      onChange={(e) => updateElement(selectedElementData.id, { height: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Размер шрифта
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="100"
                      value={selectedElementData.fontSize || 24}
                      onChange={(e) => updateElement(selectedElementData.id, { fontSize: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Цвет текста
                    </label>
                    <input
                      type="color"
                      value={selectedElementData.color || '#ffffff'}
                      onChange={(e) => updateElement(selectedElementData.id, { color: e.target.value })}
                      className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Цвет фона блока
                    </label>
                    <input
                      type="color"
                      value={selectedElementData.backgroundColor || '#000000'}
                      onChange={(e) => updateElement(selectedElementData.id, { backgroundColor: e.target.value })}
                      className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Скругление углов
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={selectedElementData.borderRadius || 0}
                      onChange={(e) => updateElement(selectedElementData.id, { borderRadius: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </>
              )}
              
              {selectedElementData.type === 'image' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ширина (px)
                    </label>
                    <input
                      type="number"
                      min="20"
                      max="500"
                      value={selectedElementData.width || 120}
                      onChange={(e) => updateElement(selectedElementData.id, { width: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Высота (px)
                    </label>
                    <input
                      type="number"
                      min="20"
                      max="500"
                      value={selectedElementData.height || 120}
                      onChange={(e) => updateElement(selectedElementData.id, { height: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {!hideControls && (
          <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-center">
              <Move className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <strong>Совет:</strong> Кликните на элемент для выбора, затем перетащите его в нужное место. 
                Используйте панель настроек для точной настройки параметров.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 