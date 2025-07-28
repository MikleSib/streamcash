'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  Settings, 
  Gift, 
  User, 
  Bell,
  ChevronRight
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  description?: string;
  badge?: string;
}

const navigation: SidebarItem[] = [
  {
    name: 'Обзор',
    href: '/dashboard',
    icon: Home,
    description: 'Статистика и общая информация'
  },
  {
    name: 'Донаты',
    href: '/dashboard/donations',
    icon: Gift,
    description: 'История донатов'
  },
  {
    name: 'Настройка стримера',
    href: '/dashboard/streamer-setup',
    icon: User,
    description: 'Профиль и ссылки'
  },
  {
    name: 'Настройки алертов',
    href: '/dashboard/settings',
    icon: Bell,
    description: 'Уровни и оформление'
  }
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-16 w-80 h-[calc(100vh-4rem)] bg-gray-900/80 backdrop-blur-md border-r border-gray-700/50 flex flex-col z-40">
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isExactMatch = pathname === item.href;
          const active = isExactMatch;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                active
                  ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white shadow-lg border border-purple-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className={`p-2 rounded-lg transition-colors ${
                  active 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' 
                    : 'bg-gray-700/50 text-gray-400 group-hover:bg-gray-600/50 group-hover:text-white'
                }`}>
                  <item.icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  {item.description && (
                    <div className={`text-xs mt-0.5 ${
                      active ? 'text-purple-200' : 'text-gray-500 group-hover:text-gray-400'
                    }`}>
                      {item.description}
                    </div>
                  )}
                </div>
              </div>

              {item.badge && (
                <span className="px-2 py-1 text-xs font-medium bg-purple-600 text-white rounded-full">
                  {item.badge}
                </span>
              )}

              {active && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl blur-lg"></div>
              )}
              
              <ChevronRight className={`w-4 h-4 transition-transform ${
                active ? 'text-purple-400' : 'text-gray-500 group-hover:text-gray-400'
              } ${active ? 'rotate-90' : ''}`} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 