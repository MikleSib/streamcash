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
      description: "Идеально для начинающих стримеров",
      features: [
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
      description: "Для профессиональных стримеров",
      features: [
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
      description: "Для команд и студий",
      features: [
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
      color: "from-orange-500 to-red-500"
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
                Выберите свой план
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
              Тарифы <span className="text-purple-400">СтримКэш</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Начните бесплатно и масштабируйтесь вместе с ростом вашей аудитории. 
              Все планы включают основные функции для успешного стриминга
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-12">
              <div className="bg-gray-800/50 rounded-lg p-1 border border-gray-700/50">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    billingPeriod === 'monthly'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Ежемесячно
                </button>
                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    billingPeriod === 'yearly'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Ежегодно
                  {billingPeriod === 'yearly' && (
                    <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                      -17%
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`relative ${plan.popular ? 'transform scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Популярный
                    </div>
                  </div>
                )}
                
                <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border transition-all duration-300 hover:transform hover:scale-105 ${
                  plan.popular 
                    ? 'border-purple-500/50 shadow-lg shadow-purple-500/25' 
                    : 'border-gray-700/50 hover:border-purple-500/30'
                }`}>
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      {plan.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-purple-400 mb-2">
                      {getCurrentPrice(plan)}
                    </div>
                    {getSavings(plan) && billingPeriod === 'yearly' && (
                      <div className="text-green-400 text-sm mb-2">
                        Экономия {getSavings(plan)}%
                      </div>
                    )}
                    <p className="text-gray-400">{plan.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-300">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
                        )}
                        <span className={feature.included ? '' : 'text-gray-500'}>{feature.text}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full py-3 transition-all duration-200 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                    onClick={() => router.push('/register')}
                  >
                    {plan.price.monthly === 'Бесплатно' ? 'Начать бесплатно' : 'Выбрать план'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
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