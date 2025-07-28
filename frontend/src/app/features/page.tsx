'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { 
  Monitor, 
  Zap, 
  Smartphone, 
  Shield, 
  TrendingUp, 
  Mic, 
  Gift,
  Users,
  Settings,
  BarChart3,
  Play,
  Check,
  ArrowRight,
  Sparkles,
  Globe,
  Heart,
  DollarSign,
  Clock,
  Lock,
  Palette
} from 'lucide-react';

export default function FeaturesPage() {
  const router = useRouter();

  const features = [
    {
      icon: <Monitor className="w-8 h-8 text-purple-400" />,
      title: "OBS интеграция",
      description: "Готовые виджеты для OBS с настраиваемым дизайном и анимациями",
      details: [
        "Готовые шаблоны виджетов",
        "Настраиваемые анимации",
        "Поддержка всех версий OBS",
        "Простая установка через URL"
      ]
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Мгновенные алерты",
      description: "Алерты появляются на стриме сразу после доната",
      details: [
        "Задержка менее 3 секунд",
        "Настраиваемые звуки",
        "Кастомные анимации",
        "Поддержка изображений"
      ]
    },
    {
      icon: <Smartphone className="w-8 h-8 text-green-400" />,
      title: "Мобильные донаты",
      description: "Страницы для донатов с любых устройств",
      details: [
        "Адаптивный дизайн",
        "Быстрая загрузка",
        "Удобная оплата",
        "Поддержка всех браузеров"
      ]
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-400" />,
      title: "Безопасные платежи",
      description: "Интеграция с YooKassa, Сбербанк и другими платежными системами",
      details: [
        "SSL шифрование",
        "PCI DSS соответствие",
        "Множественные способы оплаты",
        "Автоматические возвраты"
      ]
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-pink-400" />,
      title: "Аналитика",
      description: "Подробная статистика донатов и активности ваших зрителей",
      details: [
        "Графики в реальном времени",
        "История донатов",
        "Топ донатеров",
        "Экспорт данных"
      ]
    },
    {
      icon: <Mic className="w-8 h-8 text-red-400" />,
      title: "Озвучка донатов",
      description: "Автоматическая озвучка сообщений донатеров через TTS",
      details: [
        "Множественные голоса",
        "Настраиваемая скорость",
        "Фильтрация контента",
        "Поддержка эмодзи"
      ]
    }
  ];

  const additionalFeatures = [
    {
      icon: <Users className="w-6 h-6 text-purple-400" />,
      title: "Управление донатерами",
      description: "Система лояльности и персональных сообщений"
    },
    {
      icon: <Settings className="w-6 h-6 text-blue-400" />,
      title: "Гибкие настройки",
      description: "Полный контроль над внешним видом и поведением"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-green-400" />,
      title: "Детальная статистика",
      description: "Анализ эффективности и рост аудитории"
    },
    {
      icon: <Globe className="w-6 h-6 text-yellow-400" />,
      title: "Мультиязычность",
      description: "Поддержка русского и английского языков"
    },
    {
      icon: <Clock className="w-6 h-6 text-pink-400" />,
      title: "Работает 24/7",
      description: "Стабильная работа без перебоев"
    },
    {
      icon: <Lock className="w-6 h-6 text-red-400" />,
      title: "Защита от спама",
      description: "Автоматическая фильтрация нежелательных донатов"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-purple-300 text-sm font-medium">
                Все возможности платформы
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
              Возможности <span className="text-purple-400">СтримКэш</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Профессиональные инструменты для создания незабываемого опыта 
              для ваших зрителей и максимизации доходов от стримов
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => router.push('/register')}
                className="px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-purple-500/25"
              >
                <Play className="w-5 h-5 mr-2" />
                Начать бесплатно
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/pricing')}
                className="px-8 py-4 text-lg border-gray-600 text-gray-300 hover:bg-gray-800 transform hover:scale-105 transition-all duration-200"
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Посмотреть тарифы
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Основные <span className="text-purple-400">возможности</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Все что нужно для профессионального стриминга и монетизации
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors mb-4">
                        {feature.description}
                      </p>
                      <ul className="space-y-2">
                        {feature.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-center text-gray-300">
                            <Check className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                            <span className="text-sm">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 bg-gradient-to-r from-gray-900/50 to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Дополнительные <span className="text-purple-400">функции</span>
            </h2>
            <p className="text-xl text-gray-400">
              Множество полезных инструментов для улучшения вашего стрима
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-3">
                    {feature.icon}
                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-12 border border-purple-500/30">
            <Heart className="w-16 h-16 text-pink-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Готовы использовать все <span className="text-purple-400">возможности</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Присоединяйтесь к тысячам стримеров, которые уже зарабатывают больше
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => router.push('/register')}
                className="px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
              >
                <Gift className="w-5 h-5 mr-2" />
                Создать аккаунт
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/pricing')}
                className="px-8 py-4 text-lg border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Посмотреть тарифы
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <DollarSign className="w-8 h-8 text-purple-400 mr-2" />
                <span className="text-xl font-bold text-white">СтримКэш</span>
              </div>
              <p className="text-gray-400">
                Лучшая платформа для донатов в России
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Продукт</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/features" className="hover:text-purple-400 transition-colors">Возможности</a></li>
                <li><a href="/pricing" className="hover:text-purple-400 transition-colors">Тарифы</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/docs" className="hover:text-purple-400 transition-colors">Документация</a></li>
                <li><a href="/help" className="hover:text-purple-400 transition-colors">Помощь</a></li>
                <li><a href="/status" className="hover:text-purple-400 transition-colors">Статус</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-purple-400 transition-colors">О нас</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 СтримКэш. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 