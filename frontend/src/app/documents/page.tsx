'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { FileText, Shield, Users, CreditCard, Lock, DollarSign, ShieldCheck } from 'lucide-react';

export default function DocumentsPage() {
  const router = useRouter();

  const documents = [
    {
      title: "Пользовательское соглашение",
      description: "Основные условия использования платформы СтримКэш",
      icon: <FileText className="w-6 h-6 text-blue-400" />,
      lastUpdated: "15.01.2025",
      status: "Актуально",
      href: "/documents/user-agreement"
    },
    {
      title: "Политика конфиденциальности",
      description: "Как мы собираем, используем и защищаем ваши данные",
      icon: <Shield className="w-6 h-6 text-green-400" />,
      lastUpdated: "15.01.2025",
      status: "Актуально",
      href: "/documents/privacy-policy"
    },
    {
      title: "Правила для стримеров",
      description: "Требования и ограничения для пользователей платформы",
      icon: <Users className="w-6 h-6 text-purple-400" />,
      lastUpdated: "15.01.2025",
      status: "Актуально",
      href: "/documents/streamer-rules"
    },
    {
      title: "Правила для донатеров",
      description: "Условия и ограничения для совершения донатов",
      icon: <CreditCard className="w-6 h-6 text-yellow-400" />,
      lastUpdated: "15.01.2025",
      status: "Актуально",
      href: "/documents/donor-rules"
    },
    {
      title: "Политика безопасности",
      description: "Меры по защите платежей и персональных данных",
      icon: <Lock className="w-6 h-6 text-red-400" />,
      lastUpdated: "15.01.2025",
      status: "Актуально",
      href: "/documents/security-policy"
    },
    {
      title: "Правила сервиса «Безопасная сделка»",
      description: "Условия предоставления услуги безопасных транзакций",
      icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
      lastUpdated: "15.01.2025",
      status: "Актуально",
      href: "/documents/secure-deal"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Документация
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Все юридические документы и правила использования платформы СтримКэш
            </p>
          </div>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 w-full max-w-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {doc.icon}
                    <div>
                      <h3 className="text-lg font-semibold text-white">{doc.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{doc.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-400">
                    Обновлено: {doc.lastUpdated}
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {doc.status}
                  </span>
                </div>

                <button
                  onClick={() => router.push(doc.href)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Читать
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-16 bg-gray-800/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-yellow-400 mb-3">
              Важная информация
            </h3>
            <p className="text-gray-300">
              Все документы являются юридически обязательными. Рекомендуем внимательно ознакомиться с каждым документом перед использованием платформы.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Остались вопросы?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Наша команда поддержки готова помочь вам разобраться с любыми вопросами
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/help')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Получить помощь
            </button>
            <button
              onClick={() => router.push('/about')}
              className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            >
              О нас
            </button>
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

          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h5 className="text-white font-semibold mb-4">Реквизиты счета</h5>
                <div className="text-sm text-gray-400 space-y-1">
                  <p><strong>Название организации:</strong></p>
                  <p>ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ ТРОФИМОВ МИХАИЛ ВЯЧЕСЛАВОВИЧ</p>
                  <p><strong>Юридический адрес:</strong></p>
                  <p>630048, РОССИЯ, НОВОСИБИРСКАЯ ОБЛ, Г НОВОСИБИРСК, УЛ ВЕРТКОВСКАЯ, Д 5/3, КВ 97</p>
                  <p><strong>ИНН:</strong> 540438160180</p>
                  <p><strong>ОГРН/ОГРНИП:</strong> 321547600158582</p>
                </div>
              </div>
              <div>
                <h5 className="text-white font-semibold mb-4">Контакты</h5>
                <div className="text-sm text-gray-400 space-y-1">
                  <p><strong>Email:</strong> support@floory-app.ru</p>
                  <p><strong>Telegram:</strong> @streamcash_support</p>
                  <p><strong>Сайт:</strong> <a href="https://стримкэш.рф" className="hover:text-purple-400 transition-colors">стримкэш.рф</a></p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 СтримКэш. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 