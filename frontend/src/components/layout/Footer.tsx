'use client';

import { DollarSign } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 sm:py-12 lg:py-16 bg-black/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          <div className="space-y-4 sm:space-y-6 sm:col-span-2 md:col-span-1">
            <div className="flex items-center">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4">
                <DollarSign className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-black text-white">СтримКэш</span>
            </div>
            <p className="text-gray-400 font-medium leading-relaxed text-sm sm:text-base">
              Зарабатывай больше с минимальными комиссиями.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 sm:mb-6 text-base sm:text-lg">Продукт</h4>
            <ul className="space-y-2 sm:space-y-4">
              <li><a href="/features" className="text-gray-400 hover:text-green-400 transition-colors font-medium text-sm sm:text-base">Возможности</a></li>
              <li><a href="/pricing" className="text-gray-400 hover:text-green-400 transition-colors font-medium text-sm sm:text-base">Тарифы</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 sm:mb-6 text-base sm:text-lg">Поддержка</h4>
            <ul className="space-y-2 sm:space-y-4">
              <li><a href="/help" className="text-gray-400 hover:text-blue-400 transition-colors font-medium text-sm sm:text-base">Помощь</a></li>
              <li><a href="/status" className="text-gray-400 hover:text-blue-400 transition-colors font-medium text-sm sm:text-base">Статус</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 sm:mb-6 text-base sm:text-lg">Компания</h4>
            <ul className="space-y-2 sm:space-y-4">
              <li><a href="/about" className="text-gray-400 hover:text-purple-400 transition-colors font-medium text-sm sm:text-base">О нас</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 sm:mt-12 pt-8 sm:pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <h5 className="text-white font-bold mb-4 sm:mb-6 text-base sm:text-lg">Реквизиты счета</h5>
              <div className="text-xs sm:text-sm text-gray-400 space-y-2 sm:space-y-3 leading-relaxed">
                <p><strong className="text-gray-300 font-semibold">Название организации:</strong></p>
                <p className="break-words">ИНДИВИДУАЛЬНЫЙ ПРЕДПРИНИМАТЕЛЬ ТРОФИМОВ МИХАИЛ ВЯЧЕСЛАВОВИЧ</p>
                <p><strong className="text-gray-300 font-semibold">Юридический адрес:</strong></p>
                <p className="break-words">630048, РОССИЯ, НОВОСИБИРСКАЯ ОБЛ, Г НОВОСИБИРСК, УЛ ВЕРТКОВСКАЯ, Д 5/3, КВ 97</p>
                <p><strong className="text-gray-300 font-semibold">ИНН:</strong> 540438160180</p>
                <p><strong className="text-gray-300 font-semibold">ОГРН/ОГРНИП:</strong> 321547600158582</p>
              </div>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4 sm:mb-6 text-base sm:text-lg">Контакты</h5>
              <div className="text-xs sm:text-sm text-gray-400 space-y-2 sm:space-y-3 leading-relaxed">
                <p><strong className="text-gray-300 font-semibold">Email:</strong> <a href="mailto:support@floory-app.ru" className="hover:text-blue-400 transition-colors break-words">support@floory-app.ru</a></p>
                <p><strong className="text-gray-300 font-semibold">Telegram:</strong> <a href="https://t.me/streamcash_support" className="hover:text-blue-400 transition-colors">@streamcash_support</a></p>
                <p><strong className="text-gray-300 font-semibold">Сайт:</strong> <a href="https://стримкэш.рф" className="hover:text-blue-400 transition-colors break-words">стримкэш.рф</a></p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8">
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8">
              <a href="/documents/user-agreement" className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium text-sm sm:text-base">
                Пользовательское соглашение
              </a>
              <a href="/documents/privacy-policy" className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium text-sm sm:text-base">
                Политика конфиденциальности
              </a>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-400 font-medium text-sm sm:text-base">&copy; 2025 СтримКэш. Все права защищены.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}