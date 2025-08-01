'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Users, ArrowLeft, DollarSign } from 'lucide-react';

export default function StreamerRulesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
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
              <Users className="w-12 h-12 text-purple-400 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Правила для стримеров
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-6">
              Требования и ограничения для пользователей платформы
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
              <h2 className="text-2xl font-bold text-white mb-6">1. Общие требования</h2>
              <p className="text-gray-300 mb-4">
                1.1. Стримером может стать любой пользователь, достигший 18 лет и прошедший верификацию.
              </p>
              <p className="text-gray-300 mb-4">
                1.2. Запрещается использовать платформу для стриминга контента, нарушающего законодательство РФ.
              </p>
              <p className="text-gray-300 mb-6">
                1.3. Стример обязан соблюдать все правила платформы и пользовательское соглашение.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">2. Запрещенный контент</h2>
              <p className="text-gray-300 mb-4">
                2.1. Запрещается стримить контент, содержащий:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Насилие, жестокость или призывы к насилию</li>
                <li>Порнографические материалы</li>
                <li>Пропаганду наркотиков, алкоголя, табака</li>
                <li>Экстремистские материалы</li>
                <li>Мошенничество или обман</li>
                <li>Нарушение авторских прав</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">3. Правила поведения</h2>
              <p className="text-gray-300 mb-4">
                3.1. Стример обязан:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Быть вежливым и уважительным к зрителям</li>
                <li>Не использовать оскорбления и ненормативную лексику</li>
                <li>Не провоцировать конфликты</li>
                <li>Соблюдать правила платформы</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">4. Технические требования</h2>
              <p className="text-gray-300 mb-4">
                4.1. Минимальные требования для стрима:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Стабильное интернет-соединение (минимум 5 Мбит/с)</li>
                <li>Качественное видео (минимум 720p)</li>
                <li>Чистый звук без помех</li>
                <li>Стабильная работа OBS или другого софта</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">5. Монетизация и донаты</h2>
              <p className="text-gray-300 mb-4">
                5.1. Стример может получать донаты от зрителей через платформу.
              </p>
              <p className="text-gray-300 mb-4">
                5.2. Комиссия платформы составляет 5% от суммы доната.
              </p>
              <p className="text-gray-300 mb-4">
                5.3. Выплаты производятся еженедельно при достижении минимума 1000 рублей.
              </p>
              <p className="text-gray-300 mb-6">
                5.4. Запрещается просить донаты для незаконных целей.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">6. Безопасные сделки</h2>
              <p className="text-gray-300 mb-4">
                6.1. Стример может предлагать услуги через сервис «Безопасная сделка»:
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Персональные стримы и игровые сессии</li>
                <li>Обучение игровым навыкам и консультации</li>
                <li>Создание пользовательского контента</li>
                <li>Буст-услуги в играх</li>
                <li>Другие цифровые услуги</li>
              </ul>
              <p className="text-gray-300 mb-4">
                6.2. Комиссия за безопасные сделки составляет 10% от суммы сделки.
              </p>
              <p className="text-gray-300 mb-4">
                6.3. Стример обязан выполнить услугу в заявленные сроки и предоставить доказательства выполнения.
              </p>
              <p className="text-gray-300 mb-6">
                6.4. При невыполнении обязательств средства возвращаются покупателю, а стример может быть заблокирован.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">7. Настройки уведомлений</h2>
              <p className="text-gray-300 mb-4">
                6.1. Стример может настраивать уведомления о донатах в личном кабинете.
              </p>
              <p className="text-gray-300 mb-4">
                6.2. Доступны настройки звука, анимации и текста уведомлений.
              </p>
              <p className="text-gray-300 mb-6">
                6.3. Уведомления отображаются в OBS через браузерный источник.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">8. Нарушения и санкции</h2>
              <p className="text-gray-300 mb-4">
                7.1. За нарушение правил могут применяться санкции:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Предупреждение</li>
                <li>Временная блокировка (1-30 дней)</li>
                <li>Постоянная блокировка аккаунта</li>
                <li>Блокировка выплат</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">9. Контактная информация</h2>
          
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