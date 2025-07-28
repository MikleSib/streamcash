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

export default function StreamerRulesPage() {
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
              Правила для стримеров
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
                1.1. Настоящие Правила для стримеров (далее — «Правила») устанавливают требования 
                и ограничения для пользователей платформы СтримКэш, использующих сервис для приема донатов.
              </p>

              <p className="text-gray-300 mb-4">
                1.2. Стример — это пользователь Платформы, который использует сервис для приема 
                добровольных пожертвований от зрителей во время стримов.
              </p>

              <p className="text-gray-300 mb-6">
                1.3. Соблюдение настоящих Правил является обязательным условием использования Платформы.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">2. Требования к стримерам</h2>
              
              <p className="text-gray-300 mb-4">
                2.1. Стример должен:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Быть не моложе 18 лет</li>
                <li>Предоставить достоверную информацию при регистрации</li>
                <li>Иметь действующий банковский счет или электронный кошелек</li>
                <li>Соблюдать законодательство Российской Федерации</li>
                <li>Не нарушать права третьих лиц</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">3. Запрещенный контент</h2>
              
              <p className="text-gray-300 mb-4">
                3.1. Запрещается использовать Платформу для:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Распространения контента для взрослых (18+)</li>
                <li>Пропаганды насилия, экстремизма, терроризма</li>
                <li>Распространения наркотических веществ</li>
                <li>Мошенничества и обмана зрителей</li>
                <li>Нарушения авторских прав</li>
                <li>Распространения вредоносного программного обеспечения</li>
                <li>Организации азартных игр</li>
                <li>Политической агитации</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">4. Правила поведения на стримах</h2>
              
              <p className="text-gray-300 mb-4">
                4.1. Во время стримов стример обязан:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Соблюдать общепринятые нормы морали и этики</li>
                <li>Не использовать ненормативную лексику в избытке</li>
                <li>Не оскорблять зрителей и других пользователей</li>
                <li>Не призывать к противоправным действиям</li>
                <li>Не распространять ложную информацию</li>
                <li>Не нарушать правила платформы, на которой ведется стрим</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">5. Обработка донатов</h2>
              
              <p className="text-gray-300 mb-4">
                5.1. Стример обязуется:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Не требовать донаты в принудительном порядке</li>
                <li>Не обещать услуги или товары в обмен на донаты</li>
                <li>Не использовать донаты для незаконной деятельности</li>
                <li>Своевременно обрабатывать запросы на возврат средств</li>
                <li>Предоставлять честную информацию о целях сбора средств</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">6. Технические требования</h2>
              
              <p className="text-gray-300 mb-4">
                6.1. Стример должен обеспечить:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Стабильное интернет-соединение</li>
                <li>Качественное видео и аудио</li>
                <li>Корректную настройку алертов донатов</li>
                <li>Регулярное обновление OBS и плагинов</li>
                <li>Резервные источники донатов</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">7. Модерация и жалобы</h2>
              
              <p className="text-gray-300 mb-4">
                7.1. Компания оставляет за собой право:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Модерировать контент стримеров</li>
                <li>Приостанавливать аккаунты за нарушения</li>
                <li>Отказывать в выплатах при подозрении на мошенничество</li>
                <li>Требовать дополнительные документы для верификации</li>
                <li>Блокировать доступ к Платформе</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">8. Выплаты и комиссии</h2>
              
              <p className="text-gray-300 mb-4">
                8.1. Условия выплат:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Минимальная сумма для вывода: 100 рублей</li>
                <li>Срок обработки: 1-3 рабочих дня</li>
                <li>Комиссия зависит от выбранного тарифного плана</li>
                <li>Выплаты производятся только на верифицированные счета</li>
                <li>Налоговые обязательства несет стример самостоятельно</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">9. Ответственность</h2>
              
              <p className="text-gray-300 mb-4">
                9.1. Стример несет полную ответственность за:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Содержание своих стримов</li>
                <li>Соблюдение авторских прав</li>
                <li>Уплату налогов с полученных донатов</li>
                <li>Действия своих модераторов</li>
                <li>Нарушения правил платформ для стриминга</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">10. Изменения в правилах</h2>
              
              <p className="text-gray-300 mb-4">
                10.1. Компания может изменять настоящие Правила.
              </p>

              <p className="text-gray-300 mb-6">
                10.2. Об изменениях стримеры уведомляются через Платформу или по email.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">11. Контактная информация</h2>
              
              <p className="text-gray-300 mb-4">
                По вопросам, связанным с настоящими Правилами, обращайтесь:
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