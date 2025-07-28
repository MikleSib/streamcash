'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ArrowLeft, DollarSign, Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.push('/documents')}
              className="flex items-center text-gray-400 hover:text-white transition-colors mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к документам
            </button>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-green-400 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Политика конфиденциальности
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-6">
              Как мы собираем, используем и защищаем ваши данные
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <span>Обновлено: 15.01.2025</span>
              </div>
              <div className="flex items-center">
                <span>Версия: 1.0</span>
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Актуально
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Document Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-white mb-6">1. Общие положения</h2>
              <p className="text-gray-300 mb-4">
                1.1. Настоящая Политика конфиденциальности (далее — «Политика») описывает, как платформа СтримКэш
                собирает, использует и защищает персональные данные пользователей.
              </p>
              <p className="text-gray-300 mb-4">
                1.2. Используя Платформу, вы соглашаетесь с условиями настоящей Политики.
              </p>
              <p className="text-gray-300 mb-6">
                1.3. Мы обязуемся защищать вашу конфиденциальность и соблюдать требования законодательства РФ.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">2. Собираемые данные</h2>
              <p className="text-gray-300 mb-4">
                2.1. Мы собираем следующие типы данных:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Персональные данные (имя, email, телефон)</li>
                <li>Данные для платежей (номер карты, реквизиты)</li>
                <li>Технические данные (IP-адрес, браузер, устройство)</li>
                <li>Данные об использовании сервиса</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">3. Цели использования данных</h2>
              <p className="text-gray-300 mb-4">
                3.1. Ваши данные используются для:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Предоставления услуг платформы</li>
                <li>Обработки платежей</li>
                <li>Улучшения качества сервиса</li>
                <li>Соблюдения законодательных требований</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">4. Защита данных</h2>
              <p className="text-gray-300 mb-4">
                4.1. Мы применяем следующие меры защиты:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Шифрование данных при передаче (SSL/TLS)</li>
                <li>Безопасное хранение в защищенных центрах</li>
                <li>Ограниченный доступ к данным</li>
                <li>Регулярные проверки безопасности</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">5. Передача данных третьим лицам</h2>
              <p className="text-gray-300 mb-4">
                5.1. Мы не передаем ваши данные третьим лицам, кроме случаев:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>С вашего явного согласия</li>
                <li>Для обработки платежей (платежные системы)</li>
                <li>По требованию законодательства</li>
                <li>Для защиты наших прав и безопасности</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">6. Ваши права</h2>
              <p className="text-gray-300 mb-4">
                6.1. Вы имеете право:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Получить информацию о собираемых данных</li>
                <li>Исправить неточные данные</li>
                <li>Удалить свои данные</li>
                <li>Отозвать согласие на обработку</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">7. Cookies и аналитика</h2>
              <p className="text-gray-300 mb-4">
                7.1. Мы используем cookies для улучшения работы сайта и аналитики.
              </p>
              <p className="text-gray-300 mb-4">
                7.2. Вы можете отключить cookies в настройках браузера.
              </p>
              <p className="text-gray-300 mb-6">
                7.3. Аналитические данные собираются анонимно.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">8. Контактная информация</h2>
     
              <p className="text-gray-300 mb-2">
                <strong>Название организации:</strong><br />
                ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ ТРОФИМОВ МИХАИЛ ВЯЧЕСЛАВОВИЧ
              </p>
              <p className="text-gray-300 mb-2">
                <strong>Юридический адрес организации:</strong><br />
                630048, РОССИЯ, НОВОСИБИРСКАЯ ОБЛ, Г НОВОСИБИРСК, УЛ ВЕРТКОВСКАЯ, Д 5/3, КВ 97
              </p>
              <p className="text-gray-300 mb-2">
                <strong>ИНН:</strong> 540438160180
              </p>
              <p className="text-gray-300 mb-2">
                <strong>ОГРН/ОГРНИП:</strong> 321547600158582
              </p>
              <p className="text-gray-300 mb-2">
                <strong>Email:</strong> support@floory-app.ru
              </p>
              <p className="text-gray-300 mb-6">
                <strong>Telegram:</strong> @streamcash_support
              </p>

              <div className="bg-gray-700/50 rounded-lg p-6 mt-8">
                <p className="text-gray-300 text-sm">
                  <strong>Дата вступления в силу:</strong> 15 января 2025 года
                </p>
                <p className="text-gray-300 text-sm mt-2">
                  <strong>Последнее обновление:</strong> 15 января 2025 года
                </p>
              </div>
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