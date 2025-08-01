'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
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
  Palette,
  ExternalLink,
  Bell,
  Target,
  Trophy,
  Music,
  Eye,
  CreditCard,
  Headphones,
  MessageSquare,
  Star,
  Flame,
  Calendar,
  PieChart,
  Volume2,
  FileText,
  Webhook,
  Gamepad2,
  Coffee,
  Coins,
  Rocket
} from 'lucide-react';

export default function FeaturesPage() {
  const router = useRouter();

  const mainFeatures = [
    {
      icon: <ExternalLink className="w-10 h-10 text-purple-400" />,
      title: "Страница стримера",
      description: "Персональная страница для приема донатов и заказов на музыку",
      details: [
        "Уникальная ссылка для донатов (стримкэш.рф/ваш_ник)",
        "Прием заказов на музыку с указанием цены",
        "Возможность добавить описание и правила",
        "Настраиваемый дизайн и фон страницы",
        "Отображение цели сбора средств",
        "Последние донаты и топ донатеров"
      ],
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Bell className="w-10 h-10 text-yellow-400" />,
      title: "Уведомления о донатах",
      description: "Виджеты алертов для отображения донатов, подписок и других событий",
      details: [
        "Алерты о новых донатах с именем и суммой",
        "Уведомления о новых фолловерах и подписчиках",
        "Алерты о битсах и рейдах",
        "Настраиваемые звуки для каждого типа события",
        "Анимации появления и исчезновения",
        "Поддержка GIF и изображений в алертах"
      ],
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Settings className="w-10 h-10 text-blue-400" />,
      title: "Личный кабинет стримера",
      description: "Полноценная панель управления для настройки всех функций",
      details: [
        "Настройка виджетов и их внешнего вида",
        "Статистика доходов в реальном времени",
        "История всех донатов с фильтрацией",
        "Вывод средств на банковскую карту",
        "Управление заказами на музыку",
        "Настройки уведомлений и звуков"
      ],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Trophy className="w-10 h-10 text-green-400" />,
      title: "ТОП донатеров",
      description: "Виджет для отображения самых щедрых поддерживающих на стриме",
      details: [
        "Топ донатеров за день, неделю, месяц или год",
        "Рейтинг по общей сумме донатов",
        "Отображение лучших донатов по размеру",
        "Настраиваемое количество позиций в топе",
        "Автоматическое обновление рейтинга",
        "Красивое оформление с аватарками"
      ],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Target className="w-10 h-10 text-red-400" />,
      title: "Полоска цели на стриме",
      description: "Виджет для сбора средств на конкретную цель с отображением прогресса",
      details: [
        "Установка цели сбора с описанием",
        "Прогресс-бар с процентами выполнения",
        "Отображение собранной суммы и цели",
        "Автоматическое обновление прогресса",
        "Настраиваемые цвета и стили",
        "Уведомления при достижении цели"
      ],
      gradient: "from-red-500 to-pink-500"
    },
    {
      icon: <Music className="w-10 h-10 text-indigo-400" />,
      title: "Заказы музыки",
      description: "Система заказов треков с возможностью установки цены",
      details: [
        "Прием заказов на проигрывание музыки",
        "Установка минимальной цены за заказ",
        "Очередь заказанных треков",
        "Модерация заказов перед воспроизведением",
        "Поиск треков через Spotify/YouTube",
        "История всех заказанных композиций"
      ],
      gradient: "from-indigo-500 to-purple-500"
    }
  ];

  const additionalFeatures = [
    {
      icon: <Volume2 className="w-6 h-6 text-purple-400" />,
      title: "TTS Озвучка",
      description: "Автоматическая озвучка сообщений донатеров разными голосами"
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-blue-400" />,
      title: "Чат-бот интеграция",
      description: "Уведомления о донатах в Twitch/YouTube чате"
    },
    {
      icon: <PieChart className="w-6 h-6 text-green-400" />,
      title: "Детальная аналитика",
      description: "Графики доходов, топ часы для донатов, средний чек"
    },
    {
      icon: <Webhook className="w-6 h-6 text-yellow-400" />,
      title: "API и Webhook",
      description: "Интеграция с внешними сервисами и ботами"
    },
    {
      icon: <Shield className="w-6 h-6 text-red-400" />,
      title: "Защита от спама",
      description: "Фильтрация нежелательного контента и блокировка"
    },
    {
      icon: <Gamepad2 className="w-6 h-6 text-indigo-400" />,
      title: "Игровые интеграции",
      description: "Мини-игры для донатеров: рулетка, слоты, предсказания"
    },
    {
      icon: <Coffee className="w-6 h-6 text-orange-400" />,
      title: "Поддержка контента",
      description: "Виджет 'Купить кофе' и разовые поддержки"
    },
    {
      icon: <Calendar className="w-6 h-6 text-pink-400" />,
      title: "Планировщик стримов",
      description: "Расписание стримов и уведомления подписчикам"
    },
    {
      icon: <Coins className="w-6 h-6 text-cyan-400" />,
      title: "Виртуальная валюта",
      description: "Система очков и наград для активных донатеров"
    },
    {
      icon: <Eye className="w-6 h-6 text-emerald-400" />,
      title: "Счетчик зрителей",
      description: "Виджет отображения текущего количества зрителей"
    },
    {
      icon: <Star className="w-6 h-6 text-violet-400" />,
      title: "Система рейтингов",
      description: "Рейтинг стримеров по активности донатов"
    },
    {
      icon: <FileText className="w-6 h-6 text-teal-400" />,
      title: "Экспорт данных",
      description: "Выгрузка статистики в Excel/CSV для отчетности"
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pb-24 lg:pb-32">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5"></div>
          <div className="absolute top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-5 sm:right-10 w-60 sm:w-96 h-60 sm:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-56 sm:w-80 h-56 sm:h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white mb-6 sm:mb-8 leading-tight">
              Зарабатывай
              <br />
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                как профи
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-400 mb-10 sm:mb-16 max-w-4xl mx-auto font-medium px-2">
              Все инструменты для успешного стриминга в одном месте
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center max-w-md sm:max-w-none mx-auto">
              <Button 
                onClick={() => router.push('/register')}
                className="group px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 text-lg sm:text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl sm:rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-green-500/25"
              >
                <Play className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3 group-hover:animate-pulse" />
                Попробовать бесплатно
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/pricing')}
                className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 text-lg sm:text-xl font-semibold border-2 border-white/20 text-white hover:bg-white/10 rounded-xl sm:rounded-2xl backdrop-blur-xl transform hover:scale-105 transition-all duration-300"
              >
                Тарифы
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-16 sm:py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 sm:mb-8">
              Что мы
              <span className="block bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                предлагаем?
              </span>
            </h2>
          </div>

          {/* Interactive Feature Cards */}
          <div className="space-y-16 sm:space-y-20 lg:space-y-32">
            {mainFeatures.map((feature, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-8 lg:gap-16`}>
                
                {/* Feature Content */}
                <div className="flex-1 space-y-6 sm:space-y-8">
                  <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
                    <div className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full mr-2 sm:mr-3 bg-gradient-to-r ${feature.gradient}`}></div>
                    <span className="text-white font-semibold text-sm sm:text-base">Функция #{index + 1}</span>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
                    {feature.title}
                  </h3>
                  
                  <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {feature.details.slice(0, 4).map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
                        <div className="flex-shrink-0 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-400 rounded-full mt-2 sm:mt-3"></div>
                        <span className="text-gray-300 font-medium text-sm sm:text-base">{detail}</span>
                      </div>
                    ))}
                  </div>
                  
                  {feature.details.length > 4 && (
                    <div className="flex flex-wrap gap-2 pt-4">
                      {feature.details.slice(4).map((detail, detailIndex) => (
                        <div key={detailIndex} className="px-3 sm:px-4 py-1 sm:py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
                          <span className="text-gray-300 text-xs sm:text-sm font-medium">{detail}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Feature Visual */}
                <div className="flex-1 flex justify-center w-full">
                  <div className={`relative w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${feature.gradient} p-1 shadow-2xl`}>
                    <div className="w-full h-full rounded-2xl sm:rounded-3xl bg-black/80 backdrop-blur-xl flex items-center justify-center">
                      <div className="text-center">
                        <div className={`w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-2xl`}>
                          <div className="text-white">
                            {React.cloneElement(feature.icon, { className: "w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12" })}
                          </div>
                        </div>
                        <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">{feature.title}</h4>
                        <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-green-400 to-blue-400 mx-auto rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-16 sm:py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 sm:mb-8">
              И это еще
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                не всё
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-2">
              Десятки дополнительных функций для максимальной эффективности
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="h-full p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105 hover:bg-white/10">
                  
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-green-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                  
                  <div className="relative">
                    <div className="mb-4 sm:mb-6">
                      <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                        {React.cloneElement(feature.icon, { className: "w-6 sm:w-8 h-6 sm:h-8" })}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                        {feature.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed text-sm sm:text-base">
                      {feature.description}
                    </p>
                    
                    {/* Bottom accent line */}
                    <div className="mt-4 sm:mt-6 h-1 w-0 bg-gradient-to-r from-green-400 to-blue-400 group-hover:w-full transition-all duration-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 via-blue-500/5 to-purple-500/10"></div>
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-96 h-48 sm:h-96 bg-green-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-48 sm:w-96 h-48 sm:h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8 sm:mb-12">
            <div className="inline-flex items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-6 sm:mb-8">
              <div className="flex space-x-2 mr-3 sm:mr-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-150"></div>
              </div>
              <span className="text-white font-bold text-sm sm:text-base lg:text-lg">Готов начать?</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 sm:mb-8 leading-tight">
              Твой успех
              <br />
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                начинается здесь
              </span>
            </h2>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto font-medium leading-relaxed px-2">
              Присоединяйся к профессиональным стримерам и начни зарабатывать больше уже сегодня
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center mb-8 sm:mb-12 px-4">
            <Button 
              onClick={() => router.push('/register')}
              className="group relative px-8 sm:px-12 lg:px-16 py-4 sm:py-6 lg:py-8 text-lg sm:text-xl lg:text-2xl font-black bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-2xl sm:rounded-3xl transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-green-500/30"
            >
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <Rocket className="w-6 sm:w-8 h-6 sm:h-8 mr-3 sm:mr-4 group-hover:animate-bounce" />
                Начать бесплатно
              </div>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-green-400 mb-2">1%</div>
              <div className="text-gray-400 font-semibold text-sm sm:text-base">Минимальная комиссия</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-blue-400 mb-2">0₽</div>
              <div className="text-gray-400 font-semibold text-sm sm:text-base">За регистрацию</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-purple-400 mb-2">∞</div>
              <div className="text-gray-400 font-semibold text-sm sm:text-base">Возможностей</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 