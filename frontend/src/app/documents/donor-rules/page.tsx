'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { CreditCard, ArrowLeft, DollarSign } from 'lucide-react';

export default function DonorRulesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-orange-600/20"></div>
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
              <CreditCard className="w-12 h-12 text-yellow-400 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Правила для донатеров
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-6">
              Условия и ограничения для совершения донатов
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
                1.1. Донатером может стать любой пользователь, достигший 18 лет и имеющий действующую банковскую карту.
              </p>
              <p className="text-gray-300 mb-4">
                1.2. Донаты являются добровольными пожертвованиями стримерам.
              </p>
              <p className="text-gray-300 mb-6">
                1.3. Совершая донат, вы соглашаетесь с правилами платформы.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">2. Способы оплаты</h2>
              <p className="text-gray-300 mb-4">
                2.1. Донаты принимаются через следующие способы оплаты:
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Банковские карты (МИР)</li>
                <li>Электронные кошельки (ЮMoney, Яндекс.Деньги)</li>
              </ul>
              <p className="text-gray-300 mb-6">
                2.2. Для безопасных сделок используются те же способы оплаты с дополнительной защитой средств.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">3. Минимальные суммы</h2>
              <p className="text-gray-300 mb-4">
                3.1. Минимальная сумма доната составляет 10 рублей.
              </p>
              <p className="text-gray-300 mb-4">
                3.2. Максимальная сумма за один донат — 50,000 рублей.
              </p>
              <p className="text-gray-300 mb-6">
                3.3. Лимиты могут быть изменены в зависимости от способа оплаты.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">4. Комиссии</h2>
              <p className="text-gray-300 mb-4">
                4.1. Комиссия платформы составляет 5% от суммы доната.
              </p>
              <p className="text-gray-300 mb-4">
                4.2. Комиссия за безопасные сделки составляет 10% от суммы сделки (включает все платёжные комиссии).
              </p>
              <p className="text-gray-300 mb-4">
                4.3. Дополнительные комиссии могут взиматься платежными системами.
              </p>
              <p className="text-gray-300 mb-6">
                4.4. Комиссии отображаются перед подтверждением платежа.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">5. Возврат средств</h2>
              <p className="text-gray-300 mb-4">
                5.1. Возврат средств возможен в следующих случаях:
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Техническая ошибка при обработке платежа</li>
                <li>Двойное списание средств</li>
                <li>Недоставка уведомления стримеру</li>
                <li>Нарушение правил стримером</li>
              </ul>
              <p className="text-gray-300 mb-4">
                5.2. Для безопасных сделок возврат средств гарантируется при:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Невыполнении услуги в заявленные сроки</li>
                <li>Несоответствии качества услуги описанию</li>
                <li>Нарушении условий сделки исполнителем</li>
                <li>Технических проблемах, препятствующих выполнению</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">6. Запрещенные действия</h2>
              <p className="text-gray-300 mb-4">
                6.1. Запрещается:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Использовать чужие банковские карты</li>
                <li>Совершать донаты с целью мошенничества</li>
                <li>Спамить донатами</li>
                <li>Использовать поддельные данные</li>
                <li>Нарушать правила стримера</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">7. Безопасность</h2>
              <p className="text-gray-300 mb-4">
                7.1. Все платежи обрабатываются через защищенные системы.
              </p>
              <p className="text-gray-300 mb-4">
                7.2. Данные карт не сохраняются на серверах платформы.
              </p>
              <p className="text-gray-300 mb-4">
                7.3. Используется SSL-шифрование для защиты данных.
              </p>
              <p className="text-gray-300 mb-6">
                7.4. Мониторинг подозрительной активности ведется 24/7.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">8. Уведомления</h2>
              <p className="text-gray-300 mb-4">
                8.1. После успешного доната стример получает уведомление.
              </p>
              <p className="text-gray-300 mb-4">
                8.2. Уведомление отображается в стриме согласно настройкам стримера.
              </p>
              <p className="text-gray-300 mb-4">
                8.3. Донатер получает подтверждение на email.
              </p>
              <p className="text-gray-300 mb-6">
                8.4. История донатов сохраняется в личном кабинете.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">9. Контактная информация</h2>
              <p className="text-gray-300 mb-4">
                <strong>Реквизиты счета</strong>
              </p>
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
                <li><a href="/documents" className="hover:text-purple-400 transition-colors">Юридическая информация</a></li>
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