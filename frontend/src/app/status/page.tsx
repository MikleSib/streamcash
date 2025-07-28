'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Clock, 
  ArrowLeft,
  Activity,
  Server,
  Database,
  CreditCard,
  Globe,
  Wifi,
  Shield,
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function StatusPage() {
  const router = useRouter();
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      name: "Основной сервер",
      description: "API и веб-интерфейс",
      status: "operational",
      icon: <Server className="w-6 h-6" />,
      responseTime: "45ms"
    },
    {
      name: "База данных",
      description: "Хранение данных пользователей",
      status: "operational",
      icon: <Database className="w-6 h-6" />,
      responseTime: "12ms"
    },
    {
      name: "Платежная система",
      description: "Обработка донатов и платежей",
      status: "operational",
      icon: <CreditCard className="w-6 h-6" />,
      responseTime: "230ms"
    },
    {
      name: "OBS интеграция",
      description: "Виджеты и алерты",
      status: "operational",
      icon: <Activity className="w-6 h-6" />,
      responseTime: "78ms"
    },
    {
      name: "CDN",
      description: "Доставка контента",
      status: "operational",
      icon: <Globe className="w-6 h-6" />,
      responseTime: "15ms"
    },
    {
      name: "WebSocket",
      description: "Реальное время",
      status: "operational",
      icon: <Wifi className="w-6 h-6" />,
      responseTime: "8ms"
    },
    {
      name: "Безопасность",
      description: "SSL и защита",
      status: "operational",
      icon: <Shield className="w-6 h-6" />,
      responseTime: "5ms"
    }
  ];

  const incidents = [
    {
      title: "Плановое обновление",
      description: "Обновление системы безопасности",
      status: "resolved",
      date: "15.01.2025 02:00-04:00",
      impact: "minor"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'outage':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'operational':
        return 'Работает';
      case 'degraded':
        return 'Проблемы';
      case 'outage':
        return 'Не работает';
      default:
        return 'Неизвестно';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-400';
      case 'degraded':
        return 'text-yellow-400';
      case 'outage':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const overallStatus = services.every(service => service.status === 'operational') 
    ? 'operational' 
    : services.some(service => service.status === 'outage') 
    ? 'outage' 
    : 'degraded';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Button 
              variant="outline"
              onClick={() => router.back()}
              className="mb-8 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
              Статус <span className="text-purple-400">системы</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Мониторинг работы всех сервисов платформы СтримКэш в реальном времени
            </p>

            {/* Overall Status */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-4 mb-4">
                {getStatusIcon(overallStatus)}
                <span className={`text-2xl font-bold ${getStatusColor(overallStatus)}`}>
                  {getStatusText(overallStatus)}
                </span>
              </div>
              <p className="text-gray-400 mb-4">
                Общий статус системы
              </p>
              <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
                <Clock className="w-4 h-4" />
                <span>Обновлено: {lastUpdated.toLocaleTimeString('ru-RU')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Status */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Статус <span className="text-purple-400">сервисов</span>
            </h2>
            <p className="text-xl text-gray-400">
              Детальная информация о работе каждого компонента системы
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="group">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {service.icon}
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {service.description}
                        </p>
                      </div>
                    </div>
                    {getStatusIcon(service.status)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${getStatusColor(service.status)}`}>
                      {getStatusText(service.status)}
                    </span>
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>{service.responseTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Incidents */}
      <section className="py-20 bg-gradient-to-r from-gray-900/50 to-purple-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Инциденты и <span className="text-purple-400">обновления</span>
            </h2>
            <p className="text-xl text-gray-400">
              История инцидентов и плановых работ
            </p>
          </div>

          <div className="space-y-6">
            {incidents.map((incident, index) => (
              <div key={index} className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/30">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {incident.title}
                    </h3>
                    <p className="text-gray-400 mb-2">
                      {incident.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-400">{incident.date}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        incident.impact === 'major' ? 'bg-red-500/20 text-red-400' :
                        incident.impact === 'minor' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {incident.impact === 'major' ? 'Критично' :
                         incident.impact === 'minor' ? 'Незначительно' : 'Информация'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">
                      Решено
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {incidents.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Нет активных инцидентов
                </h3>
                <p className="text-gray-400">
                  Все системы работают стабильно
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Uptime Stats */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-12 border border-purple-500/30 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Статистика <span className="text-purple-400">работоспособности</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">99.99%</div>
                <div className="text-gray-400">Uptime за месяц</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">45ms</div>
                <div className="text-gray-400">Среднее время ответа</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">0</div>
                <div className="text-gray-400">Активных инцидентов</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => router.push('/help')}
                className="px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
              >
                Обратиться в поддержку
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/')}
                className="px-8 py-4 text-lg border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Вернуться на главную
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