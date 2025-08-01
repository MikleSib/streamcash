'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { FileText, Shield, Users, CreditCard, Lock, DollarSign } from 'lucide-react';

export default function DocumentsPage() {
  const router = useRouter();

  const documents = [
    {
      title: "Пользовательское соглашение",
      description: "Условия использования сервиса СтримКэш для приема донатов",
      icon: <FileText className="w-6 h-6 text-blue-400" />,
      lastUpdated: "16.01.2025",
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

  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-12 sm:pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Юридическая информация
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-2">
              Все юридические документы и правила использования платформы СтримКэш
            </p>
          </div>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 w-full"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-3 mb-4">
                  <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                    {doc.icon}
                    <h3 className="text-lg font-semibold text-white sm:hidden">{doc.title}</h3>
                  </div>
                  <div className="flex-1">
                    <h3 className="hidden sm:block text-lg font-semibold text-white mb-1">{doc.title}</h3>
                    <p className="text-sm text-gray-400">{doc.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4">
                  <div className="text-sm text-gray-400">
                    Обновлено: {doc.lastUpdated}
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 self-start sm:self-auto">
                    {doc.status}
                  </span>
                </div>

                <button
                  onClick={() => router.push(doc.href)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 sm:py-2 px-4 rounded-lg transition-colors duration-200 text-base sm:text-sm"
                >
                  Читать
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-12 sm:py-16 bg-gray-800/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-yellow-400 mb-3">
              Важная информация
            </h3>
            <p className="text-sm sm:text-base text-gray-300">
              Все документы являются юридически обязательными. Рекомендуем внимательно ознакомиться с каждым документом перед использованием платформы.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
            Остались вопросы?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 px-2">
            Наша команда поддержки готова помочь вам разобраться с любыми вопросами
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <button
              onClick={() => router.push('/help')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 sm:px-8 rounded-lg transition-colors duration-200 text-base"
            >
              Получить помощь
            </button>
            <button
              onClick={() => router.push('/about')}
              className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 sm:px-8 rounded-lg transition-colors duration-200 text-base"
            >
              О нас
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 sm:py-12 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center mb-4">
                <DollarSign className="w-6 sm:w-8 h-6 sm:h-8 text-purple-400 mr-2" />
                <span className="text-lg sm:text-xl font-bold text-white">СтримКэш</span>
              </div>
              <p className="text-sm sm:text-base text-gray-400">
                 
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Продукт</h4>
              <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li><a href="/features" className="hover:text-purple-400 transition-colors">Возможности</a></li>
                <li><a href="/pricing" className="hover:text-purple-400 transition-colors">Тарифы</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Поддержка</h4>
              <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li><a href="/documents" className="hover:text-purple-400 transition-colors">Юридическая информация</a></li>
                <li><a href="/help" className="hover:text-purple-400 transition-colors">Помощь</a></li>
                <li><a href="/status" className="hover:text-purple-400 transition-colors">Статус</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Компания</h4>
              <ul className="space-y-1 sm:space-y-2 text-gray-400 text-sm sm:text-base">
                <li><a href="/about" className="hover:text-purple-400 transition-colors">О нас</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h5 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Реквизиты счета</h5>
                <div className="text-xs sm:text-sm text-gray-400 space-y-1 sm:space-y-2">
                  <p><strong className="text-gray-300">Название организации:</strong></p>
                  <p className="break-words">ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ ТРОФИМОВ МИХАИЛ ВЯЧЕСЛАВОВИЧ</p>
                  <p><strong className="text-gray-300">Юридический адрес:</strong></p>
                  <p className="break-words">630048, РОССИЯ, НОВОСИБИРСКАЯ ОБЛ, Г НОВОСИБИРСК, УЛ ВЕРТКОВСКАЯ, Д 5/3, КВ 97</p>
                  <p><strong className="text-gray-300">ИНН:</strong> 540438160180</p>
                  <p><strong className="text-gray-300">ОГРН/ОГРНИП:</strong> 321547600158582</p>
                </div>
              </div>
              <div>
                <h5 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Контакты</h5>
                <div className="text-xs sm:text-sm text-gray-400 space-y-1 sm:space-y-2">
                  <p><strong className="text-gray-300">Email:</strong> <a href="mailto:support@floory-app.ru" className="hover:text-purple-400 transition-colors break-words">support@floory-app.ru</a></p>
                  <p><strong className="text-gray-300">Telegram:</strong> <a href="https://t.me/streamcash_support" className="hover:text-purple-400 transition-colors">@streamcash_support</a></p>
                  <p><strong className="text-gray-300">Сайт:</strong> <a href="https://стримкэш.рф" className="hover:text-purple-400 transition-colors break-words">стримкэш.рф</a></p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-xs sm:text-sm">&copy; 2025 СтримКэш. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 