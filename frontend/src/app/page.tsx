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
  Target
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
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
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/8 via-blue-500/8 to-purple-500/8"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 left-1/2 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
           
         
            
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-tight">
              Зарабатывай на
              <br />
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                контенте
              </span>
            </h1>
            
            {/* Крупный блок с комиссией */}
            <div className="mb-12">
              <div className="inline-block bg-white/5 backdrop-blur-xl border-2 border-green-400/30 rounded-3xl px-12 py-8 mb-8 shadow-2xl shadow-green-400/20">
                <p className="text-5xl md:text-6xl font-black text-center text-white">
                  🚀 Комиссия всего <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent border-b-4 border-green-400/50">1%*</span>
                </p>
              </div>
              
          
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 mb-16">
              <div className="flex items-center bg-white/5 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/10 shadow-lg">
                <Check className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-white font-semibold">Настройка за 5 минут</span>
              </div>
              <div className="flex items-center bg-white/5 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/10 shadow-lg">
                <Shield className="w-5 h-5 text-blue-400 mr-3" />
                <span className="text-white font-semibold">Безопасные платежи</span>
              </div>
              <div className="flex items-center bg-white/5 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/10 shadow-lg">
                <Heart className="w-5 h-5 text-purple-400 mr-3" />
                <span className="text-white font-semibold">Поддержка 24/7</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center mb-12">
              <Button 
                onClick={handleStartStreaming}
                className="group px-12 py-6 text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-green-500/30"
              >
                <Rocket className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                Начать зарабатывать
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/streamers')}
                className="px-10 py-6 text-xl font-semibold border-2 border-white/20 text-white hover:bg-white/10 rounded-2xl backdrop-blur-xl transform hover:scale-105 transition-all duration-300"
              >
                <Heart className="w-5 h-5 mr-2" />
                Поддержать стримера
              </Button>
            </div>
            
           


          </div>
        </div>
      </section>

      {/* Benefits & Stats Section */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105">
                  <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 font-semibold">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Commission & Tax Benefits */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Commission Block */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 hover:border-green-400/30 transition-all duration-500">
                <div className="absolute top-6 right-6">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                    ХИТ!
                  </div>
                </div>
                
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center mr-6 shadow-2xl shadow-green-500/30">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white">Минимальная комиссия</h3>
                    <p className="text-green-300 font-semibold text-lg">Больше денег остается у вас</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                    <span className="text-white font-semibold text-lg">Стандартный тариф</span>
                    <span className="text-3xl font-black text-green-400">5%</span>
                  </div>
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border-2 border-purple-400/40">
                    <div className="flex items-center">
                      <Crown className="w-6 h-6 text-purple-400 mr-3" />
                      <span className="text-white font-bold text-lg">Подписка "Студия"</span>
                    </div>
                    <span className="text-3xl font-black text-purple-400">1%</span>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-green-500/10 rounded-2xl border border-green-500/30">
                  <div className="flex items-center text-green-300 font-semibold">
                    <Check className="w-5 h-5 mr-3" />
                    <span>Самые низкие комиссии на рынке</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Benefits Block */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 hover:border-blue-400/30 transition-all duration-500">
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center mr-6 shadow-2xl shadow-blue-500/30">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white">Налоговые льготы</h3>
                    <p className="text-blue-300 font-semibold text-lg">Законно и выгодно</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <AlertCircle className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg mb-3">Освобождение от налогообложения</p>
                        <p className="text-gray-300 leading-relaxed">
                          Согласно п.18.1 ст.217 Налогового кодекса РФ, не подлежат налогообложению 
                          доходы в денежной и натуральной формах, получаемые от физических лиц в порядке дарения.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-blue-500/10 backdrop-blur-xl rounded-2xl text-center border border-blue-500/20">
                      <Calculator className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                      <p className="text-white font-black text-2xl">0%</p>
                      <p className="text-blue-300 font-semibold">Подоходный налог</p>
                    </div>
                    <div className="p-6 bg-purple-500/10 backdrop-blur-xl rounded-2xl text-center border border-purple-500/20">
                      <Banknote className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                      <p className="text-white font-black text-2xl">100%</p>
                      <p className="text-purple-300 font-semibold">Остается у вас</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
              Все что нужно для
              <span className="block bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                успешного стрима
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Профессиональные инструменты для создания незабываемого опыта
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`}></div>
                
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="mt-6 h-1 w-0 bg-gradient-to-r from-green-400 to-blue-400 group-hover:w-full transition-all duration-500 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 via-blue-500/5 to-purple-500/10"></div>
          <div className="absolute top-20 left-20 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <div className="inline-flex items-center px-8 py-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8">
              <div className="flex space-x-2 mr-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-150"></div>
              </div>
              <span className="text-white font-bold text-lg">Готов начать зарабатывать?</span>
            </div>
            
            <h2 className="text-6xl md:text-7xl font-black text-white mb-8 leading-tight">
              Твой успех
              <br />
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                начинается сегодня
              </span>
            </h2>
            
            <p className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto font-medium leading-relaxed">
              Присоединяйся к тысячам успешных стримеров и начни зарабатывать больше уже сегодня
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-12">
            <Button 
              onClick={handleStartStreaming}
              className="group relative px-16 py-8 text-2xl font-black bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-3xl transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-green-500/30"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <Rocket className="w-8 h-8 mr-4 group-hover:animate-bounce" />
                Начать прямо сейчас
              </div>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-black text-green-400 mb-2">1%</div>
              <div className="text-gray-400 font-semibold">Минимальная комиссия</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-blue-400 mb-2">0₽</div>
              <div className="text-gray-400 font-semibold">За регистрацию</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-purple-400 mb-2">5 мин</div>
              <div className="text-gray-400 font-semibold">Настройка</div>
            </div>
          </div>
        </div>
      </section>





      {/* Footer */}
      <footer className="border-t border-white/10 py-16 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-2xl flex items-center justify-center mr-4">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black text-white">СтримКэш</span>
              </div>
              <p className="text-gray-400 font-medium leading-relaxed">
                #1 платформа для донатов в России. Зарабатывай больше с минимальными комиссиями.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Продукт</h4>
              <ul className="space-y-4">
                <li><a href="/features" className="text-gray-400 hover:text-green-400 transition-colors font-medium">Возможности</a></li>
                <li><a href="/pricing" className="text-gray-400 hover:text-green-400 transition-colors font-medium">Тарифы</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Поддержка</h4>
              <ul className="space-y-4">
                <li><a href="/documents" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Юридическая информация</a></li>
                <li><a href="/help" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Помощь</a></li>
                <li><a href="/status" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Статус</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Компания</h4>
              <ul className="space-y-4">
                <li><a href="/about" className="text-gray-400 hover:text-purple-400 transition-colors font-medium">О нас</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-16 pt-8 text-center">
            <p className="text-gray-400 font-medium">&copy; 2025 СтримКэш. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
