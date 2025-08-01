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
      <section className="relative overflow-hidden pt-20 pb-16 sm:pb-24 lg:pb-32">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/8 via-blue-500/8 to-purple-500/8"></div>
          <div className="absolute top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-5 sm:right-10 w-60 sm:w-96 h-60 sm:h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 w-56 sm:w-80 h-56 sm:h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-white mb-6 sm:mb-8 leading-tight">
              Зарабатывай на
              <br />
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                контенте
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed font-medium px-2">
              <span className="text-green-400 font-bold">Выгодная платформа</span> для донатов в России
              <br className="hidden sm:block" />
              <span className="text-base sm:text-lg text-gray-400 block sm:inline mt-2 sm:mt-0">Комиссия от 1% • Поддержка 24/7</span>
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 mb-10 sm:mb-16 px-2">
              <div className="flex items-center bg-white/5 backdrop-blur-xl px-3 sm:px-4 lg:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-white/10 shadow-lg hover:shadow-green-500/20 hover:border-green-400/30 transition-all duration-300">
                <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 text-green-400 mr-2 sm:mr-3" />
                <span className="text-white font-semibold text-sm sm:text-base">Самые низкие комиссии</span>
              </div>
              <div className="flex items-center bg-white/5 backdrop-blur-xl px-3 sm:px-4 lg:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-white/10 shadow-lg hover:shadow-blue-500/20 hover:border-blue-400/30 transition-all duration-300">
                <Shield className="w-4 sm:w-5 h-4 sm:h-5 text-blue-400 mr-2 sm:mr-3" />
                <span className="text-white font-semibold text-sm sm:text-base">Безопасные платежи</span>
              </div>
              <div className="flex items-center bg-white/5 backdrop-blur-xl px-3 sm:px-4 lg:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-white/10 shadow-lg hover:shadow-purple-500/20 hover:border-purple-400/30 transition-all duration-300">
                <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-purple-400 mr-2 sm:mr-3" />
                <span className="text-white font-semibold text-sm sm:text-base">Мгновенные алерты</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center mb-8 sm:mb-12 px-4">
              <Button 
                onClick={handleStartStreaming}
                className="group px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 text-lg sm:text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl sm:rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-green-500/30"
              >
                <Rocket className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3 group-hover:animate-bounce" />
                Начать зарабатывать
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/streamers')}
                className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 text-lg sm:text-xl font-semibold border-2 border-white/20 text-white hover:bg-white/10 rounded-xl sm:rounded-2xl backdrop-blur-xl transform hover:scale-105 transition-all duration-300"
              >
                <Heart className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                Поддержать стримера
              </Button>
            </div>
            
         
           

          </div>
        </div>
      </section>

      {/* Benefits & Stats Section */}
      <section className="py-16 sm:py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-12 sm:mb-16 lg:mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105">
                  <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 font-semibold text-xs sm:text-sm lg:text-base">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Commission & Tax Benefits */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Commission Block */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/10 hover:border-green-400/30 transition-all duration-500">
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
                  <div className="bg-green-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold animate-pulse">
                    ХИТ!
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center mb-6 sm:mb-8">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-6 shadow-2xl shadow-green-500/30">
                    <CreditCard className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">Минимальная комиссия</h3>
                    <p className="text-green-300 font-semibold text-sm sm:text-base lg:text-lg">Больше денег остается у вас</p>
                  </div>
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between p-4 sm:p-6 bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/10">
                    <span className="text-white font-semibold text-sm sm:text-base lg:text-lg">Стандартный тариф</span>
                    <span className="text-2xl sm:text-3xl font-black text-green-400">5%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl sm:rounded-2xl border-2 border-purple-400/40">
                    <div className="flex items-center">
                      <Crown className="w-5 sm:w-6 h-5 sm:h-6 text-purple-400 mr-2 sm:mr-3" />
                      <span className="text-white font-bold text-sm sm:text-base lg:text-lg">Подписка "Студия"</span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-purple-400">1%</span>
                  </div>
                </div>
                
                <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-green-500/10 rounded-xl sm:rounded-2xl border border-green-500/30">
                  <div className="flex items-center text-green-300 font-semibold text-sm sm:text-base">
                    <Check className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                    <span>Самые низкие комиссии на рынке</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Benefits Block */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/10 hover:border-blue-400/30 transition-all duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center mb-6 sm:mb-8">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-6 shadow-2xl shadow-blue-500/30">
                    <FileText className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">Налоговые льготы</h3>
                    <p className="text-blue-300 font-semibold text-sm sm:text-base lg:text-lg">Законно и выгодно</p>
                  </div>
                </div>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="p-4 sm:p-6 bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/10">
                    <div className="flex items-start">
                      <div className="w-6 sm:w-8 h-6 sm:h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-3 sm:mr-4 mt-1 flex-shrink-0">
                        <AlertCircle className="w-3 sm:w-4 h-3 sm:h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-base sm:text-lg mb-2 sm:mb-3">Освобождение от налогообложения</p>
                        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                          Согласно п.18.1 ст.217 Налогового кодекса РФ, не подлежат налогообложению 
                          доходы в денежной и натуральной формах, получаемые от физических лиц в порядке дарения.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-6">
                    <div className="p-4 sm:p-6 bg-blue-500/10 backdrop-blur-xl rounded-xl sm:rounded-2xl text-center border border-blue-500/20">
                      <Calculator className="w-6 sm:w-8 h-6 sm:h-8 text-blue-400 mx-auto mb-2 sm:mb-3" />
                      <p className="text-white font-black text-xl sm:text-2xl">0%</p>
                      <p className="text-blue-300 font-semibold text-xs sm:text-sm">Подоходный налог</p>
                    </div>
                    <div className="p-4 sm:p-6 bg-purple-500/10 backdrop-blur-xl rounded-xl sm:rounded-2xl text-center border border-purple-500/20">
                      <Banknote className="w-6 sm:w-8 h-6 sm:h-8 text-purple-400 mx-auto mb-2 sm:mb-3" />
                      <p className="text-white font-black text-xl sm:text-2xl">100%</p>
                      <p className="text-purple-300 font-semibold text-xs sm:text-sm">Остается у вас</p>
                    </div>
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
