'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { 
  Mail, 
  MessageCircle, 
  ArrowLeft,
  HelpCircle,
  FileText,
  DollarSign
} from 'lucide-react';

export default function HelpPage() {
  const router = useRouter();



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Button 
              variant="outline"
              onClick={() => router.back()}
              className="mb-8 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
              Помощь и <span className="text-purple-400">поддержка</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Наша команда поддержки готова помочь вам с любыми вопросами. 
              Выберите удобный способ связи
            </p>
          </div>
        </div>
      </section>



      {/* Contact Info */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-12 border border-purple-500/30 text-center">
            
    
            <p className="text-xl text-gray-300 mb-8">
              Наша команда работает 24/7 и готова помочь вам в любое время
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <a 
                href="mailto:support@streamcash.ru"
                className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-700/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer group"
              >
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <Mail className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <span className="text-white font-semibold group-hover:text-blue-300 transition-colors">Email</span>
                </div>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">support@streamcash.ru</p>
              </a>
              <a 
                href="https://t.me/streamcash_support"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-700/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer group"
              >
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <MessageCircle className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                  <span className="text-white font-semibold group-hover:text-cyan-300 transition-colors">Telegram</span>
                </div>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">@streamcash_support</p>
              </a>
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