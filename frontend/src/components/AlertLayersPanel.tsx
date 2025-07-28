'use client';


import { Trash2, Layers, Type, Image as ImageIcon, Square } from 'lucide-react';

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

interface AlertLayersPanelProps {
  elements: AlertElement[];
  selectedElement: string | null;
  onElementSelect: (elementId: string | null) => void;
  onElementUpdate: (elementId: string, updates: Partial<AlertElement>) => void;
  onElementDelete: (elementId: string) => void;
  onElementAdd: (element: Omit<AlertElement, 'id'>) => void;
  onElementsReorder: (elements: AlertElement[]) => void;
  className?: string;
}

export function AlertLayersPanel({
  elements,
  selectedElement,
  onElementSelect,
  onElementUpdate,
  onElementDelete,
  onElementAdd,
  onElementsReorder,
  className = ''
}: AlertLayersPanelProps) {
  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Type className="w-4 h-4" />;
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'background':
        return <Square className="w-4 h-4" />;
      default:
        return <Square className="w-4 h-4" />;
    }
  };

  const getElementName = (element: AlertElement) => {
    switch (element.id) {
      case 'animation':
        return 'GIF анимация';
      case 'donor-info':
        return 'Имя и сумма';
      case 'message-text':
        return 'Сообщение';
      default:
        return element.id;
    }
  };

  const addNewTextElement = () => {
    const newElement: Omit<AlertElement, 'id'> = {
      type: 'text',
      x: 50,
      y: 75,
      width: 400,
      height: 50,
      visible: true,
      zIndex: Math.max(...elements.map(e => e.zIndex)) + 1,
      content: 'Дополнительный текст',
      fontSize: 20,
      color: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.3)',
      borderRadius: 6,
      padding: 10,
    };
    
    onElementAdd(newElement);
  };



  const canDelete = (elementId: string) => {
    return !['animation', 'donor-info', 'message-text'].includes(elementId);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg ${className}`}>
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Слои алерта</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Управление элементами
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={addNewTextElement}
              className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              title="Добавить текстовый элемент"
            >
              <Type className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => {
                const newElement: Omit<AlertElement, 'id'> = {
                  type: 'image',
                  x: 15,
                  y: 15,
                  width: 100,
                  height: 100,
                  visible: true,
                  zIndex: Math.max(...elements.map(e => e.zIndex)) + 1,
                  imageUrl: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
                };
                onElementAdd(newElement);
              }}
              className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
              title="Добавить GIF/изображение"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 max-h-96 overflow-y-auto">
        <div className="space-y-2">
          {sortedElements.map((element, index) => (
            <div
              key={element.id}
              className={`p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                selectedElement === element.id
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-md'
                  : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-purple-300 dark:hover:border-purple-500'
              }`}
              onClick={() => onElementSelect(element.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    selectedElement === element.id
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                  }`}>
                    {getElementIcon(element.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {getElementName(element)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                        z-index: {element.zIndex}
                      </span>
                    </div>
                    
                    {element.type === 'text' && element.content && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                        {element.content.replace('{donor_name}', 'Донатер').replace('{amount}', '100').replace('{message}', 'Привет!').substring(0, 20)}...
                      </p>
                    )}
                    
                    {element.type === 'image' && element.imageUrl && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                        {element.imageUrl.substring(0, 20)}...
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {canDelete(element.id) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Удалить этот элемент?')) {
                          onElementDelete(element.id);
                        }
                      }}
                      className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded transition-colors"
                      title="Удалить элемент"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {elements.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layers className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Нет элементов
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Начните добавлять элементы в ваш алерт
            </p>
            <button
              onClick={addNewTextElement}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
            >
              Добавить текст
            </button>
          </div>
        )}
      </div>
      
      <div className="px-4 pb-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex items-start">
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
            <div>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <strong>Совет:</strong> Кликайте на элементы для их выбора и настройки. 
                Используйте кнопки добавления для создания новых элементов.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 