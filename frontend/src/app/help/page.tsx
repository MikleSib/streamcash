'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
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
                href="mailto:support@floory-app.ru"
                className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-700/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer group"
              >
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <Mail className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <span className="text-white font-semibold group-hover:text-blue-300 transition-colors">Email</span>
                </div>
                <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">support@floory-app.ru</p>
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

      <Footer />
    </div>
  );
} 