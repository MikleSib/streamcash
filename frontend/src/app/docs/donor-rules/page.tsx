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

export default function DonorRulesPage() {
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
              Правила для донатеров
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
                1.1. Настоящие Правила для донатеров (далее — «Правила») устанавливают условия 
                и ограничения для пользователей платформы СтримКэш, совершающих добровольные пожертвования.
              </p>

              <p className="text-gray-300 mb-4">
                1.2. Донатер — это пользователь Платформы, который совершает добровольные 
                пожертвования стримерам через сервис СтримКэш.
              </p>

              <p className="text-gray-300 mb-6">
                1.3. Донат — это добровольное пожертвование, не являющееся оплатой за товары или услуги.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">2. Требования к донатерам</h2>
              
              <p className="text-gray-300 mb-4">
                2.1. Донатер должен:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Быть не моложе 18 лет или иметь согласие родителей/опекунов</li>
                <li>Использовать только собственные средства для донатов</li>
                <li>Не нарушать законодательство Российской Федерации</li>
                <li>Не использовать украденные или мошеннические средства</li>
                <li>Соблюдать правила платформы и стримера</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">3. Условия совершения донатов</h2>
              
              <p className="text-gray-300 mb-4">
                3.1. Донат является добровольным актом поддержки стримера.
              </p>

              <p className="text-gray-300 mb-4">
                3.2. Минимальная сумма доната: 10 рублей.
              </p>

              <p className="text-gray-300 mb-4">
                3.3. Максимальная сумма доната: 50,000 рублей за один раз.
              </p>

              <p className="text-gray-300 mb-6">
                3.4. Донатер может указать сообщение к донату (до 200 символов).
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">4. Запрещенные действия</h2>
              
              <p className="text-gray-300 mb-4">
                4.1. Запрещается:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Использовать чужие банковские карты без разрешения</li>
                <li>Совершать донаты с целью мошенничества</li>
                <li>Отправлять оскорбительные или нецензурные сообщения</li>
                <li>Спамить донатами</li>
                <li>Использовать донаты для рекламы</li>
                <li>Нарушать авторские права в сообщениях</li>
                <li>Призывать к противоправным действиям</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">5. Обработка платежей</h2>
              
              <p className="text-gray-300 mb-4">
                5.1. Платежи обрабатываются через защищенные платежные системы.
              </p>

              <p className="text-gray-300 mb-4">
                5.2. Комиссия за обработку платежа составляет от 0% до 5%.
              </p>

              <p className="text-gray-300 mb-4">
                5.3. Донатер получает чек на email после успешного платежа.
              </p>

              <p className="text-gray-300 mb-6">
                5.4. В случае технических проблем платеж может быть задержан или отменен.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">6. Возврат средств</h2>
              
              <p className="text-gray-300 mb-4">
                6.1. Возврат средств возможен в следующих случаях:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Техническая ошибка при обработке платежа</li>
                <li>Двойное списание средств</li>
                <li>Несанкционированное использование карты</li>
                <li>Нарушение стримером правил платформы</li>
                <li>Отмена стрима сразу после доната</li>
              </ul>

              <p className="text-gray-300 mb-4">
                6.2. Для возврата средств необходимо обратиться в поддержку в течение 30 дней.
              </p>

              <p className="text-gray-300 mb-6">
                6.3. Возврат производится на ту же карту, с которой был совершен платеж.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">7. Безопасность</h2>
              
              <p className="text-gray-300 mb-4">
                7.1. Мы обеспечиваем безопасность платежей:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Шифрование всех данных</li>
                <li>Соответствие стандарту PCI DSS</li>
                <li>Мониторинг подозрительных транзакций</li>
                <li>Защита от мошенничества</li>
                <li>Регулярные проверки безопасности</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">8. Ответственность донатера</h2>
              
              <p className="text-gray-300 mb-4">
                8.1. Донатер несет ответственность за:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Содержание сообщений к донатам</li>
                <li>Использование собственных средств</li>
                <li>Соблюдение правил стримера</li>
                <li>Неразглашение данных для входа в аккаунт</li>
                <li>Своевременное обращение в поддержку при проблемах</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">9. Ограничения</h2>
              
              <p className="text-gray-300 mb-4">
                9.1. Компания оставляет за собой право:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Ограничивать доступ к сервису</li>
                <li>Блокировать подозрительные аккаунты</li>
                <li>Отменять подозрительные транзакции</li>
                <li>Требовать дополнительную верификацию</li>
                <li>Изменять лимиты на донаты</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">10. Налогообложение</h2>
              
              <p className="text-gray-300 mb-4">
                10.1. Донатер не несет налоговых обязательств по донатам.
              </p>

              <p className="text-gray-300 mb-6">
                10.2. Налоговые обязательства по полученным донатам несет стример.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">11. Контактная информация</h2>
              
              <p className="text-gray-300 mb-4">
                По вопросам, связанным с донатами, обращайтесь:
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