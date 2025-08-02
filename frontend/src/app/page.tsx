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
  ChevronDown,
  CreditCard,
  FileText,
  Check,
  Crown,
  Calculator,
  AlertCircle,
  Banknote,
  Trophy,
  Rocket,
  Award,
  Target
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
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
      description: "Защищенные платежи через эквайринг и платежные системы"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Мобильная версия",
      description: "Ваши зрители могут донатить с любого устройства"
    }
  ];

  const stats = [
    { number: "169+", label: "Активных стримеров" },
    { number: "1К+", label: "Донатов в месяц" },
    { number: "99.99%", label: "Uptime" },
    { number: "1%", label: "Минимальная комиссия" }
  ];

  const handleStartStreaming = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/register');
    }
  };

  const handleCreateAccount = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/register');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/фон.png" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        {/* Graphics Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <img 
            src="/графика над фоном.png" 
            alt="Graphics" 
            className="w-full h-full object-cover opacity-80"
          />
        </div>
        
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="relative min-h-[85vh] flex items-center">
            {/* Left Content */}
            <div className="text-left lg:pl-8 lg:max-w-2xl xl:max-w-3xl relative z-10 pt-8 pb-8 sm:pt-0 sm:pb-0">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-4 sm:mb-6 leading-tight">
                Зарабатывай
                <br />
                на <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">контенте</span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-3 sm:mb-4 leading-relaxed font-medium">
                <span className="text-green-400 font-bold">Выгодная платформа</span> для донатов в России
              </p>
              
              <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-8">
                Комиссия от 1% • Поддержка 24/7
              </p>
              
              <div className="flex flex-col sm:flex-wrap sm:flex-row gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="flex items-center bg-white/10 backdrop-blur-lg px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-white/20">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-white font-semibold text-sm sm:text-base">Самые низкие комиссии</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-lg px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-white/20">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-white font-semibold text-sm sm:text-base">Безопасные платежи</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-lg px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-white/20">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mr-2 sm:mr-3 flex-shrink-0" />
                  <span className="text-white font-semibold text-sm sm:text-base">Мгновенные алерты</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button 
                  onClick={handleStartStreaming}
                  className="group px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold bg-green-500 hover:bg-green-600 rounded-lg sm:rounded-xl transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-green-500/30"
                >
                  <Rocket className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:animate-bounce" />
                  Начать зарабатывать
                </Button>
              </div>
            </div>
            
            {/* Right Content - Character Image */}
            <div className="absolute bottom-0 right-0 z-0 pointer-events-none hidden md:block">
              <img 
                src="/человек.png" 
                alt="Streamer character" 
                className="w-auto h-[1000px] lg:h-[1400px] xl:h-[1600px] 2xl:h-[3600px] object-contain object-right-bottom drop-shadow-2xl"
                style={{ transform: 'translateX(9%) translateY(-17%) scale(1.4)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits & Stats Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32 bg-black">
        {/* Glow background как в Hero Section */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-1/3 h-56 bg-purple-700/30 rounded-full blur-3xl opacity-40" />
          <div className="absolute top-20 right-1/4 w-1/3 h-56 bg-blue-700/20 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 left-1/2 w-1/2 h-40 bg-purple-900/30 rounded-full blur-3xl opacity-20 -translate-x-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-16 sm:mb-20 lg:mb-24">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-900/70 backdrop-blur-lg rounded-2xl p-6 border border-gray-400/20 text-center">
                <div className="text-4xl sm:text-5xl font-bold text-purple-400 mb-3">
                  {stat.number}
                </div>
                <div className="text-gray-300 font-medium text-sm sm:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Commission & Tax Benefits */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Commission Block */}
            <div className="bg-gray-900/70 backdrop-blur-lg rounded-2xl p-8 border border-gray-400/20">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Минимальная комиссия</h3>
                  <div className='flex items-center gap-2 mt-1'>
                    <span className="bg-green-500/20 text-green-300 text-sm font-semibold px-2 py-1 rounded-md">От 1% до 5%</span>
                    <p className="text-gray-300 text-sm">Больше денег остается у вас</p>
                  </div>
                </div>
              </div>
              
              <h4 className="text-lg font-semibold text-white mt-8 mb-4">Тарифы и их комиссии:</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 text-center border border-gray-600/30">
                  <h5 className="text-base font-medium text-white mb-1">Старт</h5>
                  <div className="text-2xl font-semibold text-white">5%</div>
                </div>
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 text-center border border-gray-600/30">
                  <h5 className="text-base font-medium text-white mb-1">Про</h5>
                  <div className="text-2xl font-semibold text-white">3%</div>
                </div>
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 text-center border border-gray-600/30">
                  <h5 className="text-base font-medium text-white mb-1">Студия</h5>
                  <div className="text-2xl font-semibold text-white">1%</div>
                </div>
              </div>
            </div>

            {/* Tax Benefits Block */}
            <div className="bg-gray-900/70 backdrop-blur-lg rounded-2xl p-8 border border-gray-400/20">
                <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Налоговые льготы</h3>
                        <p className="text-gray-400 text-sm mt-1">Законно и выгодно</p>
                    </div>
                </div>

                <div className="space-y-4 mt-8">
                    <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg border border-gray-600/30">
                        <div className="flex items-start">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <AlertCircle className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-white font-semibold text-base mb-1">Освобождение от налогообложения</p>
                            <p className="text-gray-400 leading-snug text-sm">
                            Согласно п.18.1 ст.217 Налогового кодекса РФ, не подлежат налогообложению доходы в денежной и натуральной формах, получаемые от физических лиц в порядке дарения.
                            </p>
                        </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg text-center border border-gray-600/30">
                            <Calculator className="w-7 h-7 text-blue-400 mx-auto mb-2" />
                            <p className="text-white font-semibold text-xl">0%</p>
                            <p className="text-blue-400 font-medium text-xs">Подоходный налог</p>
                        </div>
                        <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg text-center border border-gray-600/30">
                            <Gift className="w-7 h-7 text-purple-400 mx-auto mb-2" />
                            <p className="text-white font-semibold text-xl">100%</p>
                            <p className="text-purple-400 font-medium text-xs">Остается у вас</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terms & Conditions */}
      <section className="py-16 sm:py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 sm:mb-8">
              Условия использования
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                платформы
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-2">
              Прозрачные условия и выгодные тарифы для всех стримеров
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {/* Стартовый тариф */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-yellow-400/30 transition-all duration-500 hover:transform hover:scale-105 h-full flex flex-col">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-2xl shadow-yellow-500/30">
                    <Target className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Старт</h3>
                  <p className="text-gray-400 text-sm sm:text-base">Для новых стримеров</p>
                </div>

                <div className="text-center mb-6 sm:mb-8">
                  <div className="text-4xl sm:text-5xl font-black text-yellow-400 mb-2">5%</div>
                  <p className="text-gray-300 font-semibold text-sm sm:text-base">комиссия с доната</p>
                </div>

                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-1">
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-400 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Неограниченные донаты</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-400 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Алерты для OBS</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-400 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Настройка внешнего вида</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-400 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Мобильная страница донатов</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-400 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Базовая аналитика</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-400 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Поддержка по email</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="bg-yellow-500/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-yellow-500/20 mb-4 sm:mb-6">
                    <p className="text-yellow-300 text-xs sm:text-sm font-semibold text-center">
                      Действует с первого доната
                    </p>
                  </div>

                  <button
                  onClick={() => router.push('/register')}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base"
                  >
                    Начать бесплатно
                  </button>
                </div>
              </div>
            </div>

            {/* Продвинутый тариф */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-blue-400/30 transition-all duration-500 hover:transform hover:scale-105 h-full flex flex-col">
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                  <div className="bg-blue-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold">
                    ПОПУЛЯРНЫЙ
                  </div>
                </div>

                <div className="text-center mb-6 sm:mb-8">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-2xl shadow-blue-500/30">
                    <Trophy className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Про</h3>
                  <p className="text-gray-400 text-sm sm:text-base">Для активных стримеров</p>
                </div>

                <div className="text-center mb-6 sm:mb-8">
                  <div className="text-4xl sm:text-5xl font-black text-blue-400 mb-2">3%</div>
                  <p className="text-gray-300 font-semibold text-sm sm:text-base">комиссия с доната</p>
                </div>

                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-1">
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-400 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Все функции тарифа "Старт"</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-400 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Расширенная аналитика</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-400 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Кастомные звуки алертов</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-400 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">API для интеграций</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-400 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Приоритетная поддержка</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-400 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Убрать брендинг</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="bg-blue-500/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-blue-500/20 mb-4 sm:mb-6">
                    <p className="text-blue-300 text-xs sm:text-sm font-semibold text-center">
                      При обороте 50к+ ₽/месяц<br/>
                      или подписка "Профи" 299₽/месяц
                    </p>
                  </div>

                  <button
                  onClick={() => router.push('/pricing')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base"
                  >
                    Подробнее о тарифах
                  </button>
                </div>
              </div>
            </div>

            {/* Премиум тариф */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-purple-400/40 hover:border-purple-400/60 transition-all duration-500 hover:transform hover:scale-105 h-full flex flex-col">
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold">
                    ВИП
                  </div>
                </div>

                <div className="text-center mb-6 sm:mb-8">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-2xl shadow-purple-500/30">
                    <Crown className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Студия</h3>
                  <p className="text-gray-400 text-sm sm:text-base">Для топ-стримеров</p>
                </div>

                <div className="text-center mb-6 sm:mb-8">
                  <div className="text-4xl sm:text-5xl font-black text-purple-400 mb-2">1%</div>
                  <p className="text-gray-300 font-semibold text-sm sm:text-base">комиссия с доната</p>
                </div>

                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-1">
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-400 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Все функции тарифа "Про"</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-400 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Множественные аккаунты</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-400 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Персональный менеджер</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-400 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Белый лейбл</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="bg-purple-500/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-purple-500/20 mb-4 sm:mb-6">
                    <p className="text-purple-300 text-xs sm:text-sm font-semibold text-center">
                      При обороте 200к+ ₽/месяц<br/>
                      или подписка "Студия" 999₽/месяц
                    </p>
                  </div>

                  <button
                  onClick={() => router.push('/pricing')}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 text-sm sm:text-base"
                  >
                    Оформить подписку
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Дополнительная информация */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center mb-3 sm:mb-0 sm:mr-4">
                  <Calculator className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-white">Как рассчитывается оборот?</h3>
              </div>
              <div className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base">
                <p>• Учитывается сумма всех донатов за календарный месяц</p>
                <p>• Переход на новый тариф происходит автоматически</p>
                <p>• При снижении оборота тариф остается прежним до конца месяца</p>
                <p>• Подписка дает фиксированную комиссию независимо от оборота</p>
                <p>• Все суммы указаны без учета комиссии платежных систем</p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center mb-3 sm:mb-0 sm:mr-4">
                  <AlertCircle className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-white">Важная информация</h3>
              </div>
              <div className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base">
                <p>• Минимальная сумма доната: 1 рубль</p>
                <p>• Выплаты производятся ежедневно</p>
                <p>• Комиссия платежных систем: 2.8-3.5%</p>
                <p>• Подписки можно оформить в личном кабинете</p>
                <p>• Техподдержка работает круглосуточно</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 sm:mb-8">
              Все что нужно для
              <span className="block bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                успешного стрима
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-2">
              Профессиональные инструменты для создания незабываемого опыта
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Monitor className="w-8 h-8 text-purple-400" />,
                title: "OBS интеграция",
                description: "Готовые виджеты для OBS с настраиваемым дизайном и анимациями",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: <Zap className="w-8 h-8 text-yellow-400" />,
                title: "Мгновенные алерты",
                description: "Алерты появляются на стриме сразу после доната",
                gradient: "from-yellow-500 to-orange-500"
              },
              {
                icon: <Smartphone className="w-8 h-8 text-green-400" />,
                title: "Мобильные донаты",
                description: "Страницы для донатов с любых устройств",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: <Shield className="w-8 h-8 text-blue-400" />,
                title: "Безопасные платежи",
                description: "Интеграция с YooKassa, Сбербанк и другими платежными системами",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-pink-400" />,
                title: "Аналитика",
                description: "Подробная статистика донатов и активности ваших зрителей",
                gradient: "from-pink-500 to-rose-500"
              },
              {
                icon: <Mic className="w-8 h-8 text-red-400" />,
                title: "Озвучка донатов",
                description: "Автоматическая озвучка сообщений донатеров через TTS",
                gradient: "from-red-500 to-pink-500"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 rounded-xl sm:rounded-2xl blur-xl transition-opacity duration-500`}></div>
                
                <div className="relative bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105">
                  <div className={`w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 group-hover:text-green-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed text-sm sm:text-base">
                    {feature.description}
                  </p>
                  
                  <div className="mt-4 sm:mt-6 h-1 w-0 bg-gradient-to-r from-green-400 to-blue-400 group-hover:w-full transition-all duration-500 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Final CTA */}
      <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 via-blue-500/5 to-purple-500/10"></div>
          <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-96 h-48 sm:h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-48 sm:w-96 h-48 sm:h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8 sm:mb-12">
            <div className="inline-flex items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-6 sm:mb-8">
              <div className="flex space-x-2 mr-3 sm:mr-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-150"></div>
              </div>
              <span className="text-white font-bold text-sm sm:text-base lg:text-lg">Готов начать зарабатывать?</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 sm:mb-8 leading-tight">
              Твой успех
              <br />
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                начинается сегодня
              </span>
            </h2>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto font-medium leading-relaxed px-2">
              Присоединяйся к тысячам успешных стримеров и начни зарабатывать больше уже сегодня
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center mb-8 sm:mb-12 px-4">
            <Button 
              onClick={handleStartStreaming}
              className="group relative px-8 sm:px-12 lg:px-16 py-4 sm:py-6 lg:py-8 text-lg sm:text-xl lg:text-2xl font-black bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-2xl sm:rounded-3xl transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-green-500/30"
            >
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <Rocket className="w-6 sm:w-8 h-6 sm:h-8 mr-3 sm:mr-4 group-hover:animate-bounce" />
                Начать прямо сейчас
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
              <div className="text-3xl sm:text-4xl font-black text-purple-400 mb-2">5 мин</div>
              <div className="text-gray-400 font-semibold text-sm sm:text-base">Настройка</div>
            </div>
          </div>
        </div>
      </section>





      <Footer />
    </div>
  );
}
