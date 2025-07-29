'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ArrowLeft, Shield, DollarSign } from 'lucide-react';

export default function SecureDealPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-green-600/20"></div>
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
              <Shield className="w-12 h-12 text-blue-400 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Правила сервиса «Безопасная сделка»
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-6">
              Защита средств при проведении сделок через платформу СтримКэш
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

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-white mb-6">1. Общие положения</h2>
              <p className="text-gray-300 mb-4">
                1.1. Настоящие правила регулируют отношения между платформой СтримКэш 
                и пользователями при использовании сервиса «Безопасная сделка».
              </p>
              <p className="text-gray-300 mb-4">
                1.2. Сервис «Безопасная сделка» позволяет донатерам и покупателям 
                безопасно оплачивать услуги стримеров с гарантией возврата средств при невыполнении условий.
              </p>
              <p className="text-gray-300 mb-6">
                1.3. Используя данный сервис, вы соглашаетесь с настоящими правилами 
                и принимаете все условия использования платформы СтримКэш.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">2. Типы безопасных сделок на СтримКэш</h2>
              <p className="text-gray-300 mb-4">
                2.1. Мы предоставляем сервис безопасной сделки для следующих услуг:
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Персональные стримы и игровые сессии</li>
                <li>Обучение игровым навыкам и консультации</li>
                <li>Создание пользовательского контента</li>
                <li>Буст-услуги в играх</li>
                <li>Другие цифровые услуги, согласованные со стримером</li>
              </ul>
              <p className="text-gray-300 mb-6">
                2.2. Для обычных донатов (пожертвований без конкретных обязательств) 
                сервис безопасной сделки не применяется.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">3. Процесс безопасной сделки</h2>
              <p className="text-gray-300 mb-4">
                3.1. Пошаговый процесс:
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Покупатель выбирает услугу и оплачивает её через наш сайт</li>
                <li>Мы уведомляем стримера о новом заказе и замораживаем средства</li>
                <li>Стример выполняет услугу в согласованные сроки</li>
                <li>Покупатель подтверждает получение услуги или подаёт жалобу</li>
                <li>После подтверждения мы переводим деньги стримеру</li>
                <li>При обоснованной жалобе возвращаем средства покупателю</li>
              </ul>
              
              <p className="text-gray-300 mb-6">
                3.2. Мы выступаем посредником и гарантом выполнения обязательств с обеих сторон.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">4. Требования к участникам</h2>
              <p className="text-gray-300 mb-4">4.1. Для покупателей:</p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Регистрация на платформе СтримКэш</li>
                <li>Чёткое описание требований к услуге</li>
                <li>Своевременная обратная связь по результатам</li>
              </ul>
              
              <p className="text-gray-300 mb-4">4.2. Для стримеров:</p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Верифицированный аккаунт на СтримКэш</li>
                <li>Детальное описание предлагаемых услуг</li>
                <li>Соблюдение заявленных сроков выполнения</li>
                <li>Предоставление доказательств выполнения работы</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">5. Сроки и стоимость услуг</h2>
              <p className="text-gray-300 mb-4">
                5.1. Диапазон сумм для безопасных сделок: от 500 до 50 000 рублей.
              </p>
              <p className="text-gray-300 mb-4">
                5.2. Стандартные сроки выполнения услуг:
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Игровые сессии и стримы: до 48 часов с момента оплаты</li>
                <li>Обучение и консультации: до 7 дней</li>
                <li>Создание контента: до 14 дней</li>
                <li>Буст-услуги: согласно договорённости (до 30 дней)</li>
              </ul>
              <p className="text-gray-300 mb-6">
                5.3. Конкретные сроки указываются стримером при создании предложения услуги.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">6. Условия расторжения сделок</h2>
              <p className="text-gray-300 mb-4">
                6.1. Сделка может быть расторгнута в следующих случаях:
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Взаимное согласие сторон</li>
                <li>Невыполнение обязательств исполнителем в установленный срок</li>
                <li>Нарушение условий сделки любой из сторон</li>
                <li>Технические проблемы, препятствующие выполнению</li>
              </ul>
              <p className="text-gray-300 mb-6">
                6.2. При расторжении средства возвращаются заказчику в течение 3-5 рабочих дней.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">7. Комиссии и тарифы</h2>
              <p className="text-gray-300 mb-4">
                7.1. Комиссия за использование сервиса «Безопасная сделка»:
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Комиссия ЮKassa: от 3% до 4,5% в зависимости от способа оплаты</li>
                <li>Комиссия платформы СтримКэш: 2% от суммы сделки</li>
                <li>Все комиссии оплачиваются заказчиком</li>
              </ul>
              <p className="text-gray-300 mb-6">
                7.2. Подключение сервиса безопасной сделки — бесплатно.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">8. Удержание и возврат средств</h2>
              <p className="text-gray-300 mb-4">
                8.1. Условия удержания вознаграждения платформы:
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>При успешном завершении сделки комиссия удерживается полностью</li>
                <li>При отмене сделки по вине исполнителя комиссия не возвращается</li>
                <li>При отмене по вине заказчика комиссия возвращается частично (50%)</li>
                <li>При технических сбоях комиссия возвращается полностью</li>
              </ul>
              <p className="text-gray-300 mb-6">
                8.2. Возврат средств производится тем же способом, которым была произведена оплата.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">9. Гарантии и ответственность</h2>
              <p className="text-gray-300 mb-4">
                9.1. Платформа СтримКэш гарантирует:
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Техническую работоспособность сервиса безопасной сделки</li>
                <li>Соблюдение сроков заморозки и разморозки средств</li>
                <li>Конфиденциальность данных участников сделок</li>
                <li>Поддержку пользователей при возникновении споров</li>
              </ul>
              <p className="text-gray-300 mb-4">
                9.2. Платформа не несёт ответственности за:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Качество предоставляемых услуг или товаров</li>
                <li>Соблюдение сроков выполнения работ исполнителем</li>
                <li>Действия третьих лиц, включая платёжные системы</li>
                <li>Форс-мажорные обстоятельства</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">10. Разрешение споров</h2>
              <p className="text-gray-300 mb-4">
                10.1. При возникновении споров между участниками сделки:
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Стороны должны попытаться урегулировать спор самостоятельно</li>
                <li>При невозможности достижения соглашения обращаются в службу поддержки</li>
                <li>Платформа выступает посредником в разрешении споров</li>
                <li>Окончательное решение принимается на основе предоставленных доказательств</li>
              </ul>
              <p className="text-gray-300 mb-6">
                10.2. Срок рассмотрения споров составляет до 14 рабочих дней.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">11. Контактная информация</h2>
              <p className="text-gray-300 mb-4">
                По вопросам работы сервиса «Безопасная сделка» обращайтесь:
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

              <div className="bg-blue-600/10 border border-blue-600/20 rounded-xl p-6 mt-8">
                <h3 className="text-xl font-semibold text-blue-400 mb-3">
                  Партнёрство с ЮKassa
                </h3>
                <p className="text-gray-300 mb-4">
                  Сервис «Безопасная сделка» предоставляется в партнёрстве с ЮKassa — 
                  лицензированной платёжной системой (лицензия Банка России № 3510-К).
                </p>
                <p className="text-gray-300">
                  Подробная информация о сервисе доступна на официальном сайте: 
                  <a href="https://yookassa.ru/secure-deal/" className="text-blue-400 hover:text-blue-300 transition-colors ml-1" target="_blank" rel="noopener noreferrer">
                    yookassa.ru/secure-deal
                  </a>
                </p>
              </div>

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