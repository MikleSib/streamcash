'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { FileText, ArrowLeft, DollarSign } from 'lucide-react';

export default function UserAgreementPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
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
              <FileText className="w-12 h-12 text-blue-400 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Пользовательское соглашение
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-6">
              Условия использования сервиса СтримКэш для приема донатов
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <span>Обновлено: 16.01.2025</span>
              </div>
              <div className="flex items-center">
                <span>Версия: 2.0</span>
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
              <div className="bg-blue-600/10 border border-blue-600/20 rounded-xl p-6 mb-8">
                <p className="text-gray-300 text-center">
                  <strong>Российская Федерация, город Новосибирск</strong><br />
                  Опубликовано в сети Интернет по адресу: стримкэш.рф<br />
                  <strong>Дата публикации:</strong> 16 января 2025 г.<br />
                  <strong>Дата вступления в силу:</strong> 16 января 2025 г.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-white mb-6">1. Приветствие. Общая информация</h2>
              <p className="text-gray-300 mb-4">
                СтримКэш приветствует Вас и предоставляет право использования сервиса для приема донатов, 
                расположенного в сети Интернет на сайте стримкэш.рф в соответствии с условиями настоящего 
                Пользовательского соглашения.
              </p>
              <p className="text-gray-300 mb-4">
                Это Пользовательское соглашение является публичной офертой в соответствии со ст. 437 
                Гражданского кодекса Российской Федерации. Начиная использовать наш сервис, вы принимаете 
                все условия данного соглашения.
              </p>
              <p className="text-gray-300 mb-6">
                <strong>ПРОСИМ ВАС ВНИМАТЕЛЬНО ОЗНАКОМИТЬСЯ С УСЛОВИЯМИ НАСТОЯЩЕГО СОГЛАШЕНИЯ 
                ДО НАЧАЛА ИСПОЛЬЗОВАНИЯ СЕРВИСА СТРИМКЭШ.</strong>
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">2. Определения и термины</h2>
              <p className="text-gray-300 mb-4">
                <strong>«СтримКэш»</strong> — сервис для приема донатов, предоставляемый ИП Трофимовым М.В.<br />
                <strong>«Пользователь»</strong> — физическое лицо, использующее сервис СтримКэш<br />
                <strong>«Стример»</strong> — пользователь, который принимает донаты через наш сервис<br />
                <strong>«Донат»</strong> — добровольное пожертвование от зрителей стримеру<br />
                <strong>«Личный кабинет»</strong> — персональная страница пользователя на сайте<br />
                <strong>«Соглашение»</strong> — настоящее пользовательское соглашение
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">3. Описание сервиса</h2>
              <p className="text-gray-300 mb-4">
                СтримКэш — это сервис для приема донатов стримерами. Мы предоставляем:
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Прием платежей от зрителей банковскими картами и электронными кошельками</li>
                <li>Виджеты для отображения донатов в стриме</li>
                <li>Настройку уведомлений и анимаций</li>
                <li>Статистику и аналитику донатов</li>
                <li>Техническую поддержку пользователей</li>
              </ul>
              <p className="text-gray-300 mb-6">
                Мы работаем с Twitch, YouTube, VK Play Live, Rutube и другими стриминговыми платформами.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">4. Регистрация и использование</h2>
              <p className="text-gray-300 mb-4">
                4.1. Для использования сервиса необходимо зарегистрироваться и создать личный кабинет.
              </p>
              <p className="text-gray-300 mb-4">
                4.2. При регистрации вы обязуетесь предоставить достоверную информацию о себе.
              </p>
              <p className="text-gray-300 mb-4">
                4.3. Вы несете ответственность за сохранность данных для входа в личный кабинет.
              </p>
              <p className="text-gray-300 mb-6">
                4.4. Запрещается передавать доступ к аккаунту третьим лицам.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">5. Платежи и комиссии</h2>
              <p className="text-gray-300 mb-4">
                5.1. <strong>Комиссия сервиса:</strong> 3,5% + 15 рублей с каждого доната
              </p>
              <p className="text-gray-300 mb-4">
                5.2. <strong>Минимальная сумма вывода:</strong> 500 рублей
              </p>
              <p className="text-gray-300 mb-4">
                5.3. <strong>Сроки выплат:</strong> еженедельно по вторникам
              </p>
              <p className="text-gray-300 mb-4">
                5.4. Мы принимаем банковские карты Visa, MasterCard, МИР, а также ЮMoney и Тинькофф Pay.
              </p>
              <p className="text-gray-300 mb-6">
                5.5. Все платежи обрабатываются через лицензированные платежные системы с соблюдением 
                требований ЦБ РФ.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">6. Права и обязанности сторон</h2>
              <p className="text-gray-300 mb-4">
                <strong>СтримКэш обязуется:</strong>
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Обеспечивать работу сервиса 24/7</li>
                <li>Обрабатывать платежи в соответствии с законодательством РФ</li>
                <li>Выплачивать средства стримерам в установленные сроки</li>
                <li>Предоставлять техническую поддержку</li>
                <li>Защищать персональные данные пользователей</li>
              </ul>
              <p className="text-gray-300 mb-4">
                <strong>Пользователь обязуется:</strong>
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Использовать сервис в законных целях</li>
                <li>Предоставлять достоверную информацию</li>
                <li>Соблюдать требования налогового законодательства РФ</li>
                <li>Не нарушать права третьих лиц</li>
              </ul>
              <p className="text-gray-300 mb-6">
                <strong>Запрещается:</strong> использование сервиса для отмывания денег, мошенничества 
                или любой незаконной деятельности.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">7. Ответственность</h2>
              <p className="text-gray-300 mb-4">
                7.1. СтримКэш не несет ответственности за действия пользователей или технические сбои 
                в работе внешних сервисов.
              </p>
              <p className="text-gray-300 mb-4">
                7.2. Сервис предоставляется «как есть». Мы не гарантируем отсутствие технических проблем.
              </p>
              <p className="text-gray-300 mb-6">
                7.3. Максимальная ответственность СтримКэш ограничена суммой комиссии, полученной 
                от пользователя за последний месяц.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">8. Персональные данные</h2>
              <p className="text-gray-300 mb-4">
                8.1. Мы обрабатываем персональные данные в соответствии с ФЗ-152 «О персональных данных».
              </p>
              <p className="text-gray-300 mb-4">
                8.2. Данные используются только для предоставления услуг и соблюдения требований закона.
              </p>
              <p className="text-gray-300 mb-6">
                8.3. Мы не передаем персональные данные третьим лицам без вашего согласия, кроме случаев, 
                предусмотренных законом.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">9. Изменения соглашения</h2>
              <p className="text-gray-300 mb-4">
                9.1. СтримКэш имеет право изменять условия соглашения в любое время.
              </p>
              <p className="text-gray-300 mb-4">
                9.2. Об изменениях мы уведомляем на сайте не менее чем за 5 дней до вступления в силу.
              </p>
              <p className="text-gray-300 mb-6">
                9.3. Продолжение использования сервиса после изменений означает согласие с новыми условиями.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">10. Расторжение соглашения</h2>
              <p className="text-gray-300 mb-4">
                10.1. Любая сторона может расторгнуть соглашение в любое время без объяснения причин.
              </p>
              <p className="text-gray-300 mb-4">
                10.2. СтримКэш может заблокировать аккаунт при нарушении условий соглашения.
              </p>
              <p className="text-gray-300 mb-6">
                10.3. При расторжении все накопленные средства выплачиваются в течение 30 дней.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">11. Заключительные положения</h2>
              <p className="text-gray-300 mb-4">
                11.1. Настоящее соглашение регулируется законодательством Российской Федерации.
              </p>
              <p className="text-gray-300 mb-4">
                11.2. Все споры решаются в судах по месту регистрации СтримКэш.
              </p>
              <p className="text-gray-300 mb-6">
                11.3. Если какое-либо условие соглашения будет признано недействительным, 
                остальные условия остаются в силе.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">12. Контактная информация</h2>
              <p className="text-gray-300 mb-2">
                <strong>Сервис предоставляется:</strong><br />
                ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ ТРОФИМОВ МИХАИЛ ВЯЧЕСЛАВОВИЧ
              </p>
              <p className="text-gray-300 mb-2">
                <strong>Адрес:</strong><br />
                630048, РОССИЯ, НОВОСИБИРСКАЯ ОБЛ, Г НОВОСИБИРСК, УЛ ВЕРТКОВСКАЯ, Д 5/3, КВ 97
              </p>
              <p className="text-gray-300 mb-2">
                <strong>ИНН:</strong> 540438160180
              </p>
              <p className="text-gray-300 mb-2">
                <strong>ОГРНИП:</strong> 321547600158582
              </p>
              <p className="text-gray-300 mb-2">
                <strong>Email:</strong> support@floory-app.ru
              </p>
              <p className="text-gray-300 mb-2">
                <strong>Telegram:</strong> @streamcash_support
              </p>
              <p className="text-gray-300 mb-6">
                <strong>Сайт:</strong> стримкэш.рф
              </p>

              <div className="bg-gray-700/50 rounded-lg p-6 mt-8">
                <p className="text-gray-300 text-sm text-center">
                  <strong>Дата вступления в силу:</strong> 16 января 2025 года<br />
                  <strong>Последнее обновление:</strong> 16 января 2025 года
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