'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { 
  Check, 
  X, 
  Star, 
  Zap, 
  Shield, 
  Users, 
  BarChart3, 
  Settings, 
  Gift,
  Play,
  ArrowRight,
  Sparkles,
  Heart,
  DollarSign,
  Crown,
  Rocket,
  Building,
  Globe,
  Lock,
  Palette,
  Mic,
  Monitor,
  Smartphone,
  TrendingUp
} from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: "Стример",
      price: { monthly: "Бесплатно", yearly: "Бесплатно" },
      commission: "5%",
      description: "Идеально для начинающих стримеров",
      features: [
        { text: "Комиссия всего 5%", included: true, highlight: true },
        { text: "Неограниченные донаты", included: true },
        { text: "Алерты для OBS", included: true },
        { text: "Настройка внешнего вида", included: true },
        { text: "Мобильная страница донатов", included: true },
        { text: "Базовая аналитика", included: true },
        { text: "Поддержка по email", included: true },
        { text: "Расширенная аналитика", included: false },
        { text: "Кастомные звуки алертов", included: false },
        { text: "API для интеграций", included: false },
        { text: "Приоритетная поддержка", included: false },
        { text: "Убрать брендинг", included: false },
        { text: "Множественные аккаунты", included: false }
      ],
      popular: false,
      icon: <Rocket className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Профи",
      price: { monthly: "299₽/мес", yearly: "2990₽/год" },
      commission: "3%",
      description: "Для профессиональных стримеров",
      features: [
        { text: "Комиссия всего 3%", included: true, highlight: true },
        { text: "Неограниченные донаты", included: true },
        { text: "Алерты для OBS", included: true },
        { text: "Настройка внешнего вида", included: true },
        { text: "Мобильная страница донатов", included: true },
        { text: "Базовая аналитика", included: true },
        { text: "Поддержка по email", included: true },
        { text: "Расширенная аналитика", included: true },
        { text: "Кастомные звуки алертов", included: true },
        { text: "API для интеграций", included: true },
        { text: "Приоритетная поддержка", included: true },
        { text: "Убрать брендинг", included: true },
        { text: "Множественные аккаунты", included: false }
      ],
      popular: true,
      icon: <Crown className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Студия",
      price: { monthly: "999₽/мес", yearly: "9990₽/год" },
      commission: "1%",
      description: "Максимальная выгода для команд",
      features: [
        { text: "Комиссия всего 1% 🔥", included: true, highlight: true },
        { text: "Неограниченные донаты", included: true },
        { text: "Алерты для OBS", included: true },
        { text: "Настройка внешнего вида", included: true },
        { text: "Мобильная страница донатов", included: true },
        { text: "Базовая аналитика", included: true },
        { text: "Поддержка по email", included: true },
        { text: "Расширенная аналитика", included: true },
        { text: "Кастомные звуки алертов", included: true },
        { text: "API для интеграций", included: true },
        { text: "Приоритетная поддержка", included: true },
        { text: "Убрать брендинг", included: true },
        { text: "Множественные аккаунты", included: true }
      ],
      popular: false,
      icon: <Building className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500",
      bestValue: true
    }
  ];

  const features = [
    {
      icon: <Monitor className="w-6 h-6 text-purple-400" />,
      title: "OBS интеграция",
      description: "Готовые виджеты для всех планов"
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: "Мгновенные алерты",
      description: "Задержка менее 1 секунды"
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-400" />,
      title: "Безопасные платежи",
      description: "SSL шифрование и PCI DSS"
    },
    {
      icon: <Smartphone className="w-6 h-6 text-green-400" />,
      title: "Мобильные донаты",
      description: "Адаптивные страницы"
    }
  ];

  const getCurrentPrice = (plan: any) => {
    return plan.price[billingPeriod];
  };

  const getSavings = (plan: any) => {
    if (plan.price.monthly === "Бесплатно") return null;
    const monthly = parseInt(plan.price.monthly.replace('₽/мес', ''));
    const yearly = parseInt(plan.price.yearly.replace('₽/год', ''));
    const savings = (monthly * 12 - yearly) / (monthly * 12) * 100;
    return Math.round(savings);
  };

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
              Плати меньше
              <br />
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                зарабатывай больше
              </span>
            </h1>
            
            <p className="text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed font-medium">
              Самые низкие комиссии на рынке • Все функции в каждом плане
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-20">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-2 border border-white/10 shadow-2xl">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-10 py-4 rounded-xl text-lg font-bold transition-all duration-300 ${
                    billingPeriod === 'monthly'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-2xl transform scale-105 shadow-blue-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Ежемесячно
                </button>
                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-10 py-4 rounded-xl text-lg font-bold transition-all duration-300 relative ${
                    billingPeriod === 'yearly'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-2xl transform scale-105 shadow-green-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="flex items-center">
                    Ежегодно
                    <span className="ml-3 px-3 py-1 bg-green-400 text-black text-sm rounded-full font-black animate-pulse">
                      -17%
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-32 relative">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {plans.map((plan, index) => (
              <div key={index} className={`group relative ${plan.bestValue ? 'lg:scale-110' : ''}`}>
                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  plan.bestValue ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30' :
                  plan.popular ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30' :
                  'bg-gradient-to-br from-blue-500/20 to-cyan-500/20'
                }`}></div>
                
                {/* Top Badge */}
                {plan.popular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full text-sm font-bold flex items-center shadow-2xl">
                      <Star className="w-4 h-4 mr-2" />
                      Популярный
                    </div>
                  </div>
                )}
                
                {plan.bestValue && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full text-sm font-bold flex items-center shadow-2xl animate-pulse">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Лучшая цена
                    </div>
                  </div>
                )}
                
                <div className={`relative bg-white/5 backdrop-blur-xl rounded-3xl p-10 border-2 transition-all duration-500 hover:transform hover:scale-105 overflow-hidden ${
                  plan.bestValue ? 'border-green-400/40 shadow-2xl shadow-green-500/20' :
                  plan.popular ? 'border-purple-400/40 shadow-2xl shadow-purple-500/20' :
                  'border-white/10 hover:border-white/20 shadow-xl'
                }`}>
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                  </div>
                  
                  <div className="relative">
                    {/* Header */}
                    <div className="text-center mb-10">
                      <div className={`w-24 h-24 bg-gradient-to-br ${plan.color} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                        <div className="text-white">
                          {plan.icon}
                        </div>
                      </div>
                      
                      <h3 className="text-4xl font-black text-white mb-6">{plan.name}</h3>
                      
                      {/* Commission Badge */}
                      <div className={`inline-block px-8 py-4 rounded-2xl mb-6 backdrop-blur-xl shadow-2xl ${
                        plan.commission === '1%' 
                          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400/50'
                          : plan.commission === '3%'
                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-400/50'
                            : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-400/50'
                      }`}>
                        <span className={`text-2xl font-black ${
                          plan.commission === '1%' ? 'text-green-300' : plan.commission === '3%' ? 'text-purple-300' : 'text-blue-300'
                        }`}>
                          Комиссия {plan.commission}
                        </span>
                      </div>
                      
                      {/* Price */}
                      <div className="mb-6">
                        <div className={`text-6xl font-black mb-4 ${
                          plan.bestValue ? 'text-green-400' : plan.popular ? 'text-purple-400' : 'text-blue-400'
                        }`}>
                          {getCurrentPrice(plan)}
                        </div>
                        {getSavings(plan) && billingPeriod === 'yearly' && (
                          <div className="inline-block px-4 py-2 bg-green-500/20 backdrop-blur-xl border border-green-500/30 rounded-full">
                            <span className="text-green-400 font-bold">
                              Экономия {getSavings(plan)}%
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-300 text-xl font-medium">{plan.description}</p>
                    </div>

                    {/* Features List */}
                    <div className="mb-10">
                      <ul className="space-y-4">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className={`flex items-start p-3 rounded-xl transition-colors duration-300 ${
                            feature.highlight 
                              ? 'bg-green-500/10 border border-green-500/20 text-green-300 font-bold' 
                              : feature.included 
                                ? 'hover:bg-white/5' 
                                : 'opacity-60'
                          }`}>
                            {feature.included ? (
                              <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-4 mt-0.5">
                                <Check className="w-5 h-5 text-green-400" />
                              </div>
                            ) : (
                              <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mr-4 mt-0.5">
                                <X className="w-5 h-5 text-red-400" />
                              </div>
                            )}
                            <span className={`text-lg font-medium leading-7 ${
                              feature.included ? 'text-white' : 'text-gray-500 line-through'
                            }`}>
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <Button 
                      className={`group w-full py-6 text-xl font-black rounded-2xl transition-all duration-300 shadow-2xl ${
                        plan.bestValue
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-green-500/30 hover:scale-105'
                          : plan.popular
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-purple-500/30 hover:scale-105'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-blue-500/30 hover:scale-105'
                      }`}
                      onClick={() => router.push('/register')}
                    >
                      {plan.price.monthly === 'Бесплатно' ? (
                        <>
                          <Rocket className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                          Начать бесплатно
                        </>
                      ) : (
                        <>
                          <Crown className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                          Выбрать план
                        </>
                      )}
                    </Button>
                    
                    {/* Additional info */}
                    <div className="text-center mt-6">
                      <div className="inline-flex items-center px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
                        <span className="text-white font-semibold">
                          {plan.bestValue && "🔥 Максимальная экономия"}
                          {plan.popular && "⭐ Выбор большинства"}
                          {!plan.popular && !plan.bestValue && "✨ Идеально для старта"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom Notice */}
          <div className="text-center mt-32">
            <div className="inline-flex items-center px-10 py-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
              <div className="flex space-x-2 mr-6">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-150"></div>
              </div>
              <p className="text-white font-bold text-xl">
                💳 Мгновенные выплаты • 📞 Поддержка 24/7 • 🔒 Безопасные платежи
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Commission Comparison */}
      <section className="py-32 relative">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
          <div className="absolute top-20 left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
              Сравни и
              <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                сэкономь
              </span>
            </h2>
            <p className="text-2xl text-gray-400 max-w-3xl mx-auto">
              Почему тысячи стримеров выбирают СтримКэш
            </p>
          </div>

          <div className="space-y-6">
            {/* Competitors Row */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-red-500/20 shadow-xl">
              <div className="grid grid-cols-4 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-400">Конкуренты</h3>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-red-400 mb-2">10-15%</div>
                  <div className="text-gray-400 font-semibold">Комиссия</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-400 mb-2">8,500-9,000₽</div>
                  <div className="text-gray-400 font-semibold">Остается</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-500">—</div>
                </div>
              </div>
            </div>

            {/* StreamCash Plans */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/20 shadow-xl">
              <div className="grid grid-cols-4 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white">СтримКэш (Стример)</h3>
                  <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full mt-2 font-bold">
                    FREE
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-blue-400 mb-2">5%</div>
                  <div className="text-blue-300 font-semibold">Комиссия</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">9,500₽</div>
                  <div className="text-blue-300 font-semibold">Остается</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">+500-1,000₽</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 shadow-xl">
              <div className="grid grid-cols-4 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white">СтримКэш (Профи)</h3>
                  <div className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full mt-2 font-bold">
                    ПОПУЛЯРНЫЙ
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-purple-400 mb-2">3%</div>
                  <div className="text-purple-300 font-semibold">Комиссия</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">9,700₽</div>
                  <div className="text-purple-300 font-semibold">Остается</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">+700-1,200₽</div>
                </div>
              </div>
            </div>

            {/* Best Value - Studio Plan */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl p-8 border-2 border-green-400/40 shadow-2xl shadow-green-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10"></div>
              <div className="relative grid grid-cols-4 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-black text-white">СтримКэш (Студия)</h3>
                  <div className="inline-block px-3 py-1 bg-green-500/30 text-green-300 text-sm rounded-full mt-2 font-black animate-pulse">
                    ЛУЧШАЯ ЦЕНА
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-black text-green-400 mb-2">1%</div>
                  <div className="text-green-300 font-bold">Комиссия</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-green-400 mb-2">9,900₽</div>
                  <div className="text-green-300 font-bold">Остается</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-green-400">+900-1,400₽</div>
                </div>
              </div>
            </div>
            
            {/* Summary */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl text-center">
              <h3 className="text-3xl font-black text-green-400 mb-4">💰 Максимальная выгода</h3>
              <p className="text-xl text-white mb-2">
                С планом "Студия" экономия до <span className="text-green-400 font-black text-2xl">14,000₽/месяц</span>
              </p>
              <p className="text-gray-400 font-medium">
                При доходе 100,000₽/месяц
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Included */}
      <section className="py-20 bg-gradient-to-r from-gray-900/50 to-purple-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Все планы включают <span className="text-purple-400">основные функции</span>
            </h2>
            <p className="text-xl text-gray-400">
              Базовые возможности доступны даже на бесплатном плане
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300 text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Часто задаваемые <span className="text-purple-400">вопросы</span>
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Могу ли я изменить план в любое время?",
                answer: "Да, вы можете изменить план в любое время. При переходе на более дорогой план вы платите пропорционально оставшемуся времени. При переходе на более дешевый план разница возвращается на следующий период."
              },
              {
                question: "Есть ли ограничения на количество донатов?",
                answer: "Нет, все планы включают неограниченное количество донатов. Вы можете получать столько донатов, сколько хотите."
              },
              {
                question: "Могу ли я отменить подписку?",
                answer: "Да, вы можете отменить подписку в любое время в настройках аккаунта. После отмены вы сохраните доступ к функциям до конца оплаченного периода."
              },
              {
                question: "Какие способы оплаты поддерживаются?",
                answer: "Мы поддерживаем все основные способы оплаты: банковские карты, СБП, электронные кошельки и другие популярные методы."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/30">
                <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
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
              Готовы начать <span className="text-purple-400">зарабатывать</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Присоединяйтесь к тысячам стримеров, которые уже используют СтримКэш
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
                onClick={() => router.push('/features')}
                className="px-8 py-4 text-lg border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Zap className="w-5 h-5 mr-2" />
                Посмотреть возможности
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