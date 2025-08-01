'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { 
  Home, 
  Settings, 
  Gift, 
  User, 
  Bell,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  description?: string;
  badge?: string;
  subItems?: {
    name: string;
    href: string;
    description?: string;
  }[];
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
    description: 'Уровни и оформление',
    subItems: [
      {
        name: 'Донатный алерт',
        href: '/dashboard/settings',
        description: 'Настройка алертов'
      }
    ]
  }
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemName: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemName)) {
      newExpanded.delete(itemName);
    } else {
      newExpanded.add(itemName);
    }
    setExpandedItems(newExpanded);
  };

  const isItemActive = (item: SidebarItem) => {
    if (item.href === pathname) return true;
    if (item.subItems) {
      return item.subItems.some(subItem => subItem.href === pathname);
    }
    return false;
  };

  const isSubItemActive = (subItem: { href: string }) => {
    return pathname === subItem.href;
  };

  const getExpandedItems = () => {
    const expanded = new Set<string>();
    navigation.forEach(item => {
      if (item.subItems && isItemActive(item)) {
        expanded.add(item.name);
      }
    });
    return expanded;
  };

  const expandedItemsState = expandedItems.size > 0 ? expandedItems : getExpandedItems();

  return (
    <div className="fixed left-0 top-16 w-80 h-[calc(100vh-4rem)] bg-gray-900/80 backdrop-blur-md border-r border-gray-700/50 flex flex-col z-40">
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = isItemActive(item);
          const isExpanded = expandedItemsState.has(item.name);

          return (
            <div key={item.name}>
              <Link
                href={item.subItems ? '#' : item.href}
                onClick={item.subItems ? (e) => {
                  e.preventDefault();
                  toggleExpanded(item.name);
                } : undefined}
                className={`group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white shadow-lg border border-purple-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`p-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' 
                      : 'bg-gray-700/50 text-gray-400 group-hover:bg-gray-600/50 group-hover:text-white'
                  }`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    {item.description && (
                      <div className={`text-xs mt-0.5 ${
                        isActive ? 'text-purple-200' : 'text-gray-500 group-hover:text-gray-400'
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

                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl blur-lg"></div>
                )}
                
                {item.subItems ? (
                  <ChevronDown className={`w-4 h-4 transition-transform ${
                    isActive ? 'text-purple-400' : 'text-gray-500 group-hover:text-gray-400'
                  } ${isExpanded ? 'rotate-180' : ''}`} />
                ) : (
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    isActive ? 'text-purple-400' : 'text-gray-500 group-hover:text-gray-400'
                  } ${isActive ? 'rotate-90' : ''}`} />
                )}
              </Link>

              {item.subItems && isExpanded && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.subItems.map((subItem) => {
                    const isSubActive = isSubItemActive(subItem);
                    
                    return (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isSubActive
                            ? 'bg-purple-600/20 text-purple-200 border border-purple-500/30'
                            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{subItem.name}</div>
                            {subItem.description && (
                              <div className={`text-xs mt-0.5 ${
                                isSubActive ? 'text-purple-300' : 'text-gray-500'
                              }`}>
                                {subItem.description}
                              </div>
                            )}
                          </div>
                          {isSubActive && (
                            <ChevronRight className="w-3 h-3 text-purple-400" />
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
} 