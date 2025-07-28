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

export default function SecurityPolicyPage() {
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
              Политика безопасности
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
              <h2 className="text-2xl font-bold text-white mb-6">1. Общие принципы безопасности</h2>
              
              <p className="text-gray-300 mb-4">
                1.1. Безопасность данных пользователей является приоритетом для платформы СтримКэш.
              </p>

              <p className="text-gray-300 mb-4">
                1.2. Мы применяем многоуровневый подход к защите информации, включающий технические, 
                организационные и административные меры.
              </p>

              <p className="text-gray-300 mb-6">
                1.3. Наша политика безопасности соответствует международным стандартам и требованиям 
                российского законодательства.
              </p>

              <h2 className="text-2xl font-bold text-white mb-6">2. Защита персональных данных</h2>
              
              <p className="text-gray-300 mb-4">
                2.1. Мы защищаем персональные данные пользователей следующими способами:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Шифрование данных при передаче (TLS 1.3)</li>
                <li>Шифрование данных в состоянии покоя (AES-256)</li>
                <li>Регулярное обновление систем безопасности</li>
                <li>Ограничение доступа к данным</li>
                <li>Мониторинг подозрительной активности</li>
                <li>Регулярные аудиты безопасности</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">3. Безопасность платежей</h2>
              
              <p className="text-gray-300 mb-4">
                3.1. Мы обеспечиваем безопасность платежей:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Соответствие стандарту PCI DSS</li>
                <li>Использование токенизации карт</li>
                <li>3D Secure аутентификация</li>
                <li>Мониторинг мошеннических транзакций</li>
                <li>Автоматическое блокирование подозрительных операций</li>
                <li>Регулярные проверки платежных систем</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">4. Инфраструктурная безопасность</h2>
              
              <p className="text-gray-300 mb-4">
                4.1. Наша инфраструктура защищена:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Защищенные дата-центры с круглосуточной охраной</li>
                <li>Резервное копирование данных в реальном времени</li>
                <li>Системы обнаружения и предотвращения вторжений (IDS/IPS)</li>
                <li>Брандмауэры нового поколения</li>
                <li>DDoS защита</li>
                <li>Регулярные обновления серверов и ПО</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">5. Аутентификация и авторизация</h2>
              
              <p className="text-gray-300 mb-4">
                5.1. Система аутентификации включает:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Двухфакторную аутентификацию (2FA)</li>
                <li>Сильные пароли с требованиями сложности</li>
                <li>Ограничение попыток входа</li>
                <li>Автоматическую блокировку при подозрительной активности</li>
                <li>Сессии с автоматическим истечением</li>
                <li>Логирование всех действий пользователей</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">6. Мониторинг и обнаружение угроз</h2>
              
              <p className="text-gray-300 mb-4">
                6.1. Мы осуществляем непрерывный мониторинг:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Анализаторы безопасности в реальном времени</li>
                <li>Системы обнаружения аномалий</li>
                <li>Мониторинг сетевого трафика</li>
                <li>Анализ журналов событий</li>
                <li>Автоматические уведомления о подозрительной активности</li>
                <li>Регулярные отчеты по безопасности</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">7. Управление инцидентами</h2>
              
              <p className="text-gray-300 mb-4">
                7.1. При обнаружении инцидентов безопасности:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Немедленная изоляция затронутых систем</li>
                <li>Анализ и оценка ущерба</li>
                <li>Уведомление пользователей при необходимости</li>
                <li>Восстановление систем из резервных копий</li>
                <li>Документирование инцидента</li>
                <li>Принятие мер по предотвращению повторения</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">8. Безопасность разработки</h2>
              
              <p className="text-gray-300 mb-4">
                8.1. Мы следуем принципам безопасной разработки:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Код-ревью с фокусом на безопасность</li>
                <li>Автоматизированное тестирование безопасности</li>
                <li>Сканирование уязвимостей</li>
                <li>Обновление зависимостей</li>
                <li>Принцип минимальных привилегий</li>
                <li>Валидация всех входных данных</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">9. Обучение персонала</h2>
              
              <p className="text-gray-300 mb-4">
                9.1. Наш персонал регулярно проходит обучение по вопросам безопасности:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Ежегодные тренинги по информационной безопасности</li>
                <li>Обучение методам социальной инженерии</li>
                <li>Практические занятия по реагированию на инциденты</li>
                <li>Обновление знаний о новых угрозах</li>
                <li>Тестирование на фишинг</li>
                <li>Соблюдение политик безопасности</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">10. Соответствие стандартам</h2>
              
              <p className="text-gray-300 mb-4">
                10.1. Мы соответствуем следующим стандартам:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>PCI DSS (для обработки платежных карт)</li>
                <li>ISO 27001 (информационная безопасность)</li>
                <li>152-ФЗ (защита персональных данных)</li>
                <li>GDPR (для европейских пользователей)</li>
                <li>СОПБ (стандарты безопасности платежных систем)</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">11. Аудит и сертификация</h2>
              
              <p className="text-gray-300 mb-4">
                11.1. Мы регулярно проводим:
              </p>
              <ul className="text-gray-300 mb-6 list-disc list-inside space-y-2">
                <li>Внешние аудиты безопасности</li>
                <li>Тестирование на проникновение</li>
                <li>Оценку уязвимостей</li>
                <li>Проверку соответствия стандартам</li>
                <li>Анализ рисков</li>
                <li>Обновление политик безопасности</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-6">12. Контактная информация</h2>
              
              <p className="text-gray-300 mb-4">
                По вопросам безопасности обращайтесь:
              </p>
              <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                <p className="text-gray-300 mb-2">
                  <strong>Email:</strong> security@streamcash.ru
                </p>
                <p className="text-gray-300 mb-2">
                  <strong>Telegram:</strong> @streamcash_security
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