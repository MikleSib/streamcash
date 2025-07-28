'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { 
  ArrowLeft,
  Download,
  Calendar,
  FileText,
  DollarSign
} from 'lucide-react';

export default function UserAgreementPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Button 
              variant="outline"
              onClick={() => router.back()}
              className="mb-8 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к документам
            </Button>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
              Пользовательское соглашение
            </h1>
            
            <div className="flex items-center justify-center space-x-4 text-gray-400 mb-8">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Обновлено: 15.01.2025</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Версия 1.0</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Скачать PDF
              </Button>
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
                1.1. Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между 
                Индивидуальным предпринимателем Трофимовым Михаилом Вячеславовичем (далее — «Компания», «мы», «нас») 
                и пользователями платформы СтримКэш (далее — «Платформа», «Сервис»).
              </p>

              <p className="text-gray-300 mb-4">
                1.2. Используя Платформу, вы соглашаетесь с условиями настоящего Соглашения. 
                Если вы не согласны с какими-либо условиями, не используйте Платформу.
              </p>

              <p className="text-gray-300 mb-6">
                1.3. Компания оставляет за собой право изменять условия Соглашения. 
                Изменения вступают в силу с момента их публикации на Платформе.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">2. Описание сервиса</h2>
              
              <p className="text-gray-300 mb-4">
                2.1. СтримКэш — это платформа для приема донатов от зрителей стримеров, 
                предоставляющая инструменты для интеграции с OBS, настройки алертов и аналитики.
              </p>

              <p className="text-gray-300 mb-4">
                2.2. Платформа включает в себя:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Веб-интерфейс для настройки донатов</li>
                <li>Интеграцию с OBS для отображения алертов</li>
                <li>Систему обработки платежей</li>
                <li>Аналитические инструменты</li>
                <li>API для разработчиков</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">3. Регистрация и аккаунт</h2>
              
              <p className="text-gray-300 mb-4">
                3.1. Для использования Платформы необходимо создать аккаунт, 
                предоставив достоверную информацию о себе.
              </p>

              <p className="text-gray-300 mb-4">
                3.2. Вы несете ответственность за сохранность данных для входа в аккаунт 
                и за все действия, совершенные с использованием вашего аккаунта.
              </p>

              <p className="text-gray-300 mb-6">
                3.3. Запрещается передавать доступ к аккаунту третьим лицам.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">4. Правила использования</h2>
              
              <p className="text-gray-300 mb-4">
                4.1. При использовании Платформы запрещается:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Нарушать законодательство Российской Федерации</li>
                <li>Распространять вредоносное программное обеспечение</li>
                <li>Попытка взлома или нарушения работы Платформы</li>
                <li>Использование для мошеннических действий</li>
                <li>Нарушение прав интеллектуальной собственности</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">5. Платежи и комиссии</h2>
              
              <p className="text-gray-300 mb-4">
                5.1. Комиссия за обработку платежей составляет от 0% до 5% в зависимости от выбранного тарифного плана.
              </p>

              <p className="text-gray-300 mb-4">
                5.2. Выплаты производятся на банковские карты или электронные кошельки 
                в течение 1-3 рабочих дней после запроса.
              </p>

              <p className="text-gray-300 mb-6">
                5.3. Минимальная сумма для вывода составляет 100 рублей.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">6. Конфиденциальность</h2>
              
              <p className="text-gray-300 mb-4">
                6.1. Мы обязуемся защищать ваши персональные данные в соответствии с 
                Политикой конфиденциальности.
              </p>

              <p className="text-gray-300 mb-6">
                6.2. Мы не передаем ваши данные третьим лицам без вашего согласия, 
                за исключением случаев, предусмотренных законодательством.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">7. Ограничение ответственности</h2>
              
              <p className="text-gray-300 mb-4">
                7.1. Платформа предоставляется «как есть» без каких-либо гарантий.
              </p>

              <p className="text-gray-300 mb-4">
                7.2. Компания не несет ответственности за:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Потерю данных пользователей</li>
                <li>Прерывание работы сервиса</li>
                <li>Действия третьих лиц</li>
                <li>Косвенные убытки</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">8. Прекращение использования</h2>
              
              <p className="text-gray-300 mb-4">
                8.1. Вы можете прекратить использование Платформы в любое время, 
                удалив свой аккаунт.
              </p>

              <p className="text-gray-300 mb-6">
                8.2. Компания может приостановить или прекратить доступ к Платформе 
                в случае нарушения условий Соглашения.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">9. Контактная информация</h2>
              
              <p className="text-gray-300 mb-4">
                По всем вопросам, связанным с настоящим Соглашением, обращайтесь:
              </p>
              <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                <p className="text-gray-300 mb-2">
                  <strong>Email:</strong> support@streamcash.ru
                </p>
                <p className="text-gray-300 mb-2">
                  <strong>Telegram:</strong> @streamcash_support
                </p>
                <p className="text-gray-300">
                  <strong>Адрес:</strong> 630048, Россия, Новосибирская обл., г. Новосибирск, ул. Вертковская, д. 5/3, кв. 97
                </p>
              </div>

              <h2 className="text-2xl font-bold text-white mb-6">10. Заключительные положения</h2>
              
              <p className="text-gray-300 mb-4">
                10.1. Настоящее Соглашение регулируется законодательством Российской Федерации.
              </p>

              <p className="text-gray-300 mb-4">
                10.2. Если какое-либо положение Соглашения будет признано недействительным, 
                остальные положения сохраняют свою силу.
              </p>

              <p className="text-gray-300 mb-6">
                10.3. Соглашение вступает в силу с момента его принятия пользователем 
                и действует бессрочно.
              </p>

              <div className="border-t border-gray-700 pt-6 mt-8">
                <p className="text-gray-400 text-sm">
                  <strong>Дата вступления в силу:</strong> 15.01.2025<br />
                  <strong>Версия документа:</strong> 1.0
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