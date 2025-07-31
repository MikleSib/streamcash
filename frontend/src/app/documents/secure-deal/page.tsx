'use client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Безопасная сделка',
  description: 'Информация о безопасных сделках на СтримКэш',
};

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

              <h2 className="text-2xl font-bold text-white mb-6">6. Наши гарантии покупателям</h2>
              <p className="text-gray-300 mb-4">
                6.1. Мы гарантируем полный возврат средств, если:
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Стример не выполнил услугу в заявленный срок</li>
                <li>Качество услуги не соответствует описанию</li>
                <li>Стример нарушил условия сделки</li>
                <li>Услуга не была предоставлена по техническим причинам</li>
              </ul>
              <p className="text-gray-300 mb-4">
                6.2. Возврат средств НЕ производится, если:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Покупатель изменил требования после начала выполнения</li>
                <li>Покупатель не вышел на связь в назначенное время</li>
                <li>Претензии касаются субъективной оценки качества</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">7. Наши обязательства перед стримерами</h2>
              <p className="text-gray-300 mb-4">
                7.1. Мы обязуемся:
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Перевести оплату в течение 24 часов после подтверждения выполнения</li>
                <li>Защищать интересы стримера при необоснованных жалобах</li>
                <li>Предоставлять техническую поддержку в процессе сделки</li>
                <li>Сохранять конфиденциальность персональных данных</li>
              </ul>
              <p className="text-gray-300 mb-6">
                7.2. Комиссия СтримКэш составляет 10% от суммы сделки (включает все платёжные комиссии).
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">8. Запрещённые действия</h2>
              <p className="text-gray-300 mb-4">
                8.1. Пользователям запрещается:
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Использовать сервис для незаконных действий</li>
                <li>Предоставлять заведомо ложную информацию об услугах</li>
                <li>Нарушать права интеллектуальной собственности</li>
                <li>Оскорблять других пользователей платформы</li>
                <li>Обходить системы безопасности платформы</li>
              </ul>
              <p className="text-gray-300 mb-6">
                8.2. За нарушение правил мы можем заблокировать аккаунт без возврата средств.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">9. Как подать жалобу или претензию</h2>
              <p className="text-gray-300 mb-4">
                9.1. Для подачи жалобы необходимо:
              </p>
              <ul className="text-gray-300 mb-4 list-disc list-inside space-y-2">
                <li>Обратиться в поддержку в течение 48 часов после окончания услуги</li>
                <li>Предоставить детальное описание проблемы</li>
                <li>Приложить скриншоты или другие доказательства</li>
                <li>Указать номер сделки и данные стримера</li>
              </ul>
              <p className="text-gray-300 mb-6">
                9.2. Мы рассматриваем все жалобы в течение 3 рабочих дней и принимаем справедливое решение.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">10. Изменения в правилах</h2>
              <p className="text-gray-300 mb-4">
                10.1. Мы оставляем за собой право изменять настоящие правила.
              </p>
              <p className="text-gray-300 mb-4">
                10.2. О существенных изменениях мы уведомляем пользователей 
                за 7 дней до вступления изменений в силу.
              </p>
              <p className="text-gray-300 mb-6">
                10.3. Продолжение использования сервиса после изменений 
                означает согласие с новыми правилами.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">11. Контакты службы поддержки</h2>
              <p className="text-gray-300 mb-4">
                По всем вопросам, связанным с безопасными сделками, обращайтесь к нам:
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

              <div className="bg-green-600/10 border border-green-600/20 rounded-xl p-6 mt-8">
                <h3 className="text-xl font-semibold text-green-400 mb-3">
                  Техническое обеспечение
                </h3>
                <p className="text-gray-300 mb-4">
                  Для обработки платежей и заморозки средств мы используем технологии ЮKassa — 
                  лицензированной платёжной системы (лицензия Банка России № 3510-К).
                </p>
                <p className="text-gray-300">
                  Это обеспечивает максимальную безопасность ваших денежных средств 
                  и соответствие всем требованиям российского законодательства.
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