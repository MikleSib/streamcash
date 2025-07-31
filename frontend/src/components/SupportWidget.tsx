'use client';

import { useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, ExternalLink } from 'lucide-react';

export function SupportWidget() {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  
  const excludedPages = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];
  
  if (excludedPages.includes(pathname)) {
    return null;
  }

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <div 
          className={`transition-all duration-300 ease-in-out transform ${
            isHovered 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700/50 mb-4 min-w-[280px]">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-1">
                  Нужна помощь?
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  Мы всегда готовы помочь!
                </p>
                <a
                  href="https://t.me/MikhailTrofimov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Перейти в Telegram
                  <ExternalLink className="w-3 h-3 ml-2" />
                </a>
                <p className="text-gray-400 text-xs mt-3">
                  Ответим в течение 15 минут
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button 
            className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}