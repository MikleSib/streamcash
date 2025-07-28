'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { 
  FileText, 
  Shield, 
  Users, 
  CreditCard, 
  Lock, 
  ArrowLeft,
  Download,
  ExternalLink,
  Calendar,
  CheckCircle,
  DollarSign
} from 'lucide-react';

export default function DocsPage() {
  const router = useRouter();

  const documents = [
    {
      title: "Пользовательское соглашение",
      description: "Основные условия использования платформы СтримКэш",
      icon: <FileText className="w-6 h-6 text-blue-400" />,
      lastUpdated: "15.01.2025",
      status: "Актуально",
      href: "/docs/user-agreement"
    },
    {
      title: "Политика конфиденциальности",
      description: "Как мы собираем, используем и защищаем ваши данные",
      icon: <Shield className="w-6 h-6 text-green-400" />,
      lastUpdated: "15.01.2025",
      status: "Актуально",
      href: "/docs/privacy-policy"
    },
    {
      title: "Правила для стримеров",
      description: "Требования и ограничения для пользователей платформы",
      icon: <Users className="w-6 h-6 text-purple-400" />,
      lastUpdated: "15.01.2025",
      status: "Актуально",
      href: "/docs/streamer-rules"
    },
    {
      title: "Правила для донатеров",
      description: "Условия и ограничения для совершения донатов",
      icon: <CreditCard className="w-6 h-6 text-yellow-400" />,
      lastUpdated: "15.01.2025",
      status: "Актуально",
      href: "/docs/donor-rules"
    },
    {
      title: "Политика безопасности",
      description: "Меры по защите платежей и персональных данных",
      icon: <Lock className="w-6 h-6 text-red-400" />,
      lastUpdated: "15.01.2025",
      status: "Актуально",
      href: "/docs/security-policy"
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
            <Button 
              variant="outline"
              onClick={() => router.back()}
              className="mb-8 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
              Документация <span className="text-purple-400">СтримКэш</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Официальные документы и правила использования платформы. 
              Ознакомьтесь с условиями перед началом работы
            </p>
          </div>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {documents.map((doc, index) => (
              <div key={index} className="group">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="flex items-start space-x-4 mb-6">
                    {doc.icon}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {doc.title}
                      </h3>
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors text-sm">
                        {doc.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400 text-sm">
                        Обновлено: {doc.lastUpdated}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm font-medium">
                        {doc.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline"
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Скачать PDF
                    </Button>
                    <Button 
                      onClick={() => router.push(doc.href)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Читать
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-20 bg-gradient-to-r from-gray-900/50 to-purple-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-8">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3">
                  Важная информация
                </h3>
                <p className="text-gray-300 mb-4">
                  Используя платформу СтримКэш, вы автоматически соглашаетесь с условиями 
                  пользовательского соглашения и политикой конфиденциальности. 
                  Рекомендуем внимательно ознакомиться со всеми документами.
                </p>
                <p className="text-gray-400 text-sm">
                  При возникновении вопросов по документам обращайтесь в службу поддержки.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-12 border border-purple-500/30">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Остались вопросы по документам?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Наша команда поддержки готова помочь разобраться с любыми вопросами
            </p>
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