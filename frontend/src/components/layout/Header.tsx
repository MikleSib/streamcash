'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';
import { 
  DollarSign, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  BarChart3,
  Gift,
  Zap,
  Shield
} from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navigation = [
    { name: 'Стримеры', href: '/streamers', icon: User },
    { name: 'Возможности', href: '/features', icon: Zap },
    { name: 'Безопасная сделка', href: '/documents/secure-deal', icon: Shield },
    { name: 'Тарифы', href: '/pricing', icon: BarChart3 },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                СтримКэш
              </span>
              <span className="text-xs text-purple-400 font-medium -mt-1">РФ</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-gray-300 hover:text-purple-400 transition-colors duration-200 group"
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800/50"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium">{user.username}</span>
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-700/50 py-2 z-50">
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <BarChart3 className="w-4 h-4 mr-3" />
                      Дашборд
                    </Link>
                    
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Настройки
                    </Link>
                    
                    <div className="border-t border-gray-700/50 my-2"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-700/50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Войти
                </Link>
                
                <Button
                  onClick={() => router.push('/register')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Регистрация
                </Button>
              </div>
            )}

            {/* Mobile menu button and mobile auth */}
            <div className="md:hidden flex items-center space-x-2">
              {user && (
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white transition-colors p-2"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800/50 py-4">
            <div className="flex flex-col space-y-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors py-2 px-2 rounded-lg hover:bg-gray-800/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
              
              {user && (
                <>
                  <div className="border-t border-gray-700/50 my-2"></div>
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors py-2 px-2 rounded-lg hover:bg-gray-800/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium">{user.username}</span>
                  </Link>
                  
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors py-2 px-2 rounded-lg hover:bg-gray-800/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span className="font-medium">Дашборд</span>
                  </Link>
                  
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors py-2 px-2 rounded-lg hover:bg-gray-800/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Настройки</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors py-2 px-2 rounded-lg hover:bg-gray-800/50 w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Выйти</span>
                  </button>
                </>
              )}
              
              {!user && (
                <>
                  <div className="border-t border-gray-700/50 my-2"></div>
                  <Link
                    href="/login"
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors py-2 px-2 rounded-lg hover:bg-gray-800/50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Войти</span>
                  </Link>
                  
                  <Button
                    onClick={() => {
                      router.push('/register');
                      setIsMenuOpen(false);
                    }}
                    className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium w-full"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Регистрация
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 