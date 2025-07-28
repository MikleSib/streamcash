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

export default function PrivacyPolicyPage() {
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
              Политика конфиденциальности
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
                1.1. Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок 
                сбора, использования, хранения и защиты персональных данных пользователей платформы СтримКэш.
              </p>

              <p className="text-gray-300 mb-4">
                1.2. Оператором персональных данных является Индивидуальный предприниматель 
                Трофимов Михаил Вячеславович (ИНН: 540438160180).
              </p>

              <p className="text-gray-300 mb-6">
                1.3. Используя Платформу, вы соглашаетесь с условиями настоящей Политики.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">2. Собираемые данные</h2>
              
              <p className="text-gray-300 mb-4">
                2.1. Мы собираем следующие категории персональных данных:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Фамилия, имя, отчество</li>
                <li>Email адрес</li>
                <li>Номер телефона</li>
                <li>Данные банковских карт (обрабатываются платежными системами)</li>
                <li>IP адрес и данные браузера</li>
                <li>Данные об использовании сервиса</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">3. Цели обработки данных</h2>
              
              <p className="text-gray-300 mb-4">
                3.1. Ваши персональные данные обрабатываются в следующих целях:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Предоставление услуг платформы</li>
                <li>Обработка платежей и донатов</li>
                <li>Техническая поддержка</li>
                <li>Улучшение качества сервиса</li>
                <li>Соблюдение законодательных требований</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">4. Правовые основания обработки</h2>
              
              <p className="text-gray-300 mb-4">
                4.1. Обработка персональных данных осуществляется на следующих основаниях:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Согласие субъекта персональных данных</li>
                <li>Исполнение договора</li>
                <li>Выполнение юридических обязательств</li>
                <li>Охрана жизненно важных интересов</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">5. Передача данных третьим лицам</h2>
              
              <p className="text-gray-300 mb-4">
                5.1. Мы можем передавать ваши данные следующим категориям получателей:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Платежные системы (для обработки платежей)</li>
                <li>Хостинг-провайдеры (для хранения данных)</li>
                <li>Правоохранительные органы (по запросу)</li>
                <li>Суды (в рамках судебных разбирательств)</li>
              </ul>

              <p className="text-gray-300 mb-6">
                5.2. Передача данных осуществляется только в случаях, предусмотренных законодательством.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">6. Сроки хранения данных</h2>
              
              <p className="text-gray-300 mb-4">
                6.1. Персональные данные хранятся в течение срока, необходимого для достижения целей обработки.
              </p>

              <p className="text-gray-300 mb-4">
                6.2. Данные обновляются или удаляются при:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Отзыве согласия на обработку</li>
                <li>Удалении аккаунта пользователя</li>
                <li>Истечении срока хранения</li>
                <li>Достижении целей обработки</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">7. Безопасность данных</h2>
              
              <p className="text-gray-300 mb-4">
                7.1. Мы принимаем следующие меры для защиты ваших данных:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Шифрование данных при передаче (SSL/TLS)</li>
                <li>Регулярное обновление систем безопасности</li>
                <li>Ограничение доступа к данным</li>
                <li>Мониторинг безопасности</li>
                <li>Резервное копирование данных</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">8. Права субъектов персональных данных</h2>
              
              <p className="text-gray-300 mb-4">
                8.1. Вы имеете право:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Получать информацию об обработке ваших данных</li>
                <li>Требовать уточнения, блокирования или уничтожения данных</li>
                <li>Отзывать согласие на обработку</li>
                <li>Обжаловать действия или бездействие оператора</li>
                <li>Требовать прекращения обработки данных</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">9. Cookies и технологии отслеживания</h2>
              
              <p className="text-gray-300 mb-4">
                9.1. Мы используем cookies для:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Аутентификации пользователей</li>
                <li>Запоминания настроек</li>
                <li>Анализа использования сайта</li>
                <li>Улучшения пользовательского опыта</li>
              </ul>

              <p className="text-gray-300 mb-6">
                9.2. Вы можете отключить cookies в настройках браузера, но это может повлиять на функциональность сайта.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">10. Международная передача данных</h2>
              
              <p className="text-gray-300 mb-4">
                10.1. Данные обрабатываются на территории Российской Федерации.
              </p>

              <p className="text-gray-300 mb-6">
                10.2. В случае международной передачи данных мы обеспечиваем соответствующий уровень защиты.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">11. Изменения в политике</h2>
              
              <p className="text-gray-300 mb-4">
                11.1. Мы оставляем за собой право изменять настоящую Политику.
              </p>

              <p className="text-gray-300 mb-6">
                11.2. Об изменениях пользователи уведомляются через Платформу или по email.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">12. Контактная информация</h2>
              
              <p className="text-gray-300 mb-4">
                По вопросам, связанным с обработкой персональных данных, обращайтесь:
              </p>
              <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                <p className="text-gray-300 mb-2">
                  <strong>Email:</strong> privacy@streamcash.ru
                </p>
                <p className="text-gray-300 mb-2">
                  <strong>Адрес:</strong> 630048, Россия, Новосибирская обл., г. Новосибирск, ул. Вертковская, д. 5/3, кв. 97
                </p>
                <p className="text-gray-300">
                  <strong>ИНН:</strong> 540438160180
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