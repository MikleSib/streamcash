'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  Smartphone, 
  Globe, 
  Star,
  Play,
  Heart,
  DollarSign,
  Monitor,
  Mic,
  Gift,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function HomePage() {
  const router = useRouter();
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Мгновенные уведомления",
      description: "Алерты в OBS сразу после оплаты"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "100% безопасность",
      description: "Защищенные платежи через эквайнинг и платежные системы"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Мобильная версия",
      description: "Ваши зрители могут донатить с любого устройства"
    }
  ];

  const stats = [
    { number: "2", label: "Активных стримеров" },
    { number: "10К+", label: "Донатов в месяц" },
    { number: "99.99%", label: "Uptime" },
    { number: "До 0%", label: "Комиссия для стримеров" }
  ];



  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-purple-300 text-sm font-medium">
                Платформа для донатов в России
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
              Превратите поддержку<br />
              в <span className="text-purple-400">эмоции</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Самая быстрая платформа для донатов с мгновенными алертами, 
              красивыми виджетами и полным контролем над вашим стримом
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                onClick={() => router.push('/register')}
                className="px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-purple-500/25"
              >
                <Play className="w-5 h-5 mr-2" />
                Начать стримить
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/streamers')}
                className="px-8 py-4 text-lg border-gray-600 text-gray-300 hover:bg-gray-800 transform hover:scale-105 transition-all duration-200"
              >
                <Users className="w-5 h-5 mr-2" />
                Поддержать стримера
              </Button>
            </div>

            {/* Animated Feature Showcase */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="text-purple-400">
                  {features[currentFeature].icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {features[currentFeature].title}
              </h3>
              <p className="text-gray-300 text-lg">
                {features[currentFeature].description}
              </p>
              <div className="flex justify-center mt-6 space-x-2">
                {features.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentFeature ? 'bg-purple-400 w-6' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Все что нужно для <span className="text-purple-400">успешного стрима</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Профессиональные инструменты для создания незабываемого опыта для ваших зрителей
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Monitor className="w-8 h-8 text-purple-400" />,
                title: "OBS интеграция",
                description: "Готовые виджеты для OBS с настраиваемым дизайном и анимациями"
              },
              {
                icon: <Zap className="w-8 h-8 text-yellow-4я00" />,
                title: "Мгновенные алерты",
                description: "Алерты появляются на стриме сразу после доната"
              },
              {
                icon: <Smartphone className="w-8 h-8 text-green-400" />,
                title: "Мобильные донаты",
                description: "Страницы для донатов с любых устройств"
              },
              {
                icon: <Shield className="w-8 h-8 text-blue-400" />,
                title: "Безопасные платежи",
                description: "Интеграция с YooKassa, Сбербанк и другими платежными системами"
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-pink-400" />,
                title: "Аналитика",
                description: "Подробная статистика донатов и активности ваших зрителей"
              },
              {
                icon: <Mic className="w-8 h-8 text-red-400" />,
                title: "Озвучка донатов",
                description: "Автоматическая озвучка сообщений донатеров через TTS"
              }
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
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
              Готовы получать <span className="text-purple-400">донаты</span>?
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
                onClick={() => router.push('/streamers')}
                className="px-8 py-4 text-lg border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Посмотреть стримеров
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
                <li><a href="/documents" className="hover:text-purple-400 transition-colors">Документация</a></li>
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
