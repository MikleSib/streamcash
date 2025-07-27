'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { 
  Search, 
  Filter, 
  Heart, 
  ExternalLink, 
  Star,
  Users,
  TrendingUp,
  Eye,
  Gift,
  Sparkles
} from 'lucide-react';
import { streamerAPI } from '@/lib/api';

interface Streamer {
  id: number;
  display_name: string;
  stream_title?: string;
  stream_description?: string;
  donation_url: string;
  current_donations: number;
  donation_goal: number;
  min_donation_amount: number;
  is_verified: boolean;
  is_featured: boolean;
  user?: {
    username: string;
  };
}

export default function StreamersPage() {
  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [featuredStreamers, setFeaturedStreamers] = useState<Streamer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'featured' | 'verified'>('all');

  useEffect(() => {
    loadStreamers();
    loadFeaturedStreamers();
  }, []);

  const loadStreamers = async () => {
    try {
      const response = await streamerAPI.getAll();
      setStreamers(response.data);
    } catch (error) {
      console.error('Failed to load streamers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturedStreamers = async () => {
    try {
      const response = await streamerAPI.getFeatured();
      setFeaturedStreamers(response.data);
    } catch (error) {
      console.error('Failed to load featured streamers:', error);
    }
  };

  const filteredStreamers = streamers.filter(streamer => {
    const matchesSearch = streamer.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         streamer.stream_title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'featured' && streamer.is_featured) ||
                         (filter === 'verified' && streamer.is_verified);
    
    return matchesSearch && matchesFilter;
  });

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  };

  const StreamerCard = ({ streamer, featured = false }: { streamer: Streamer; featured?: boolean }) => (
    <div className={`group relative bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden ${
      featured ? 'ring-2 ring-purple-500/50' : ''
    }`}>
      {featured && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
            <Star className="w-3 h-3 mr-1" />
            Рекомендуем
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {streamer.display_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                  {streamer.display_name}
                </h3>
                {streamer.is_verified && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-gray-400 text-sm">@{streamer.user?.username}</p>
            </div>
          </div>
        </div>

        {streamer.stream_title && (
          <h4 className="text-white font-medium mb-2">{streamer.stream_title}</h4>
        )}

        {streamer.stream_description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {streamer.stream_description}
          </p>
        )}

        {/* Progress Bar */}
        {streamer.donation_goal > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Собрано</span>
              <span className="text-sm text-white font-medium">
                {formatMoney(streamer.current_donations)} / {formatMoney(streamer.donation_goal)}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage(streamer.current_donations, streamer.donation_goal)}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Gift className="w-4 h-4" />
              <span>от {formatMoney(streamer.min_donation_amount)}</span>
            </div>
          </div>

          <Link href={`/donate/${streamer.donation_url}`}>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
            >
              <Heart className="w-4 h-4 mr-2" />
              Донат
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Загружаем стримеров...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
            <span className="text-purple-300 text-sm font-medium">
              Поддержите любимых стримеров
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Наши <span className="text-purple-400">стримеры</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Откройте для себя талантливых создателей контента и поддержите их творчество
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Поиск стримеров..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Все стримеры</option>
              <option value="featured">Рекомендуемые</option>
              <option value="verified">Верифицированные</option>
            </select>
          </div>
        </div>

        {/* Featured Streamers */}
        {featuredStreamers.length > 0 && filter === 'all' && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Star className="w-6 h-6 text-purple-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Рекомендуемые стримеры</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStreamers.slice(0, 3).map((streamer) => (
                <StreamerCard key={streamer.id} streamer={streamer} featured />
              ))}
            </div>
          </div>
        )}

        {/* All Streamers */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Users className="w-6 h-6 text-purple-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">
                {filter === 'featured' ? 'Рекомендуемые' : 
                 filter === 'verified' ? 'Верифицированные' : 'Все стримеры'}
              </h2>
            </div>
            <div className="text-gray-400 text-sm">
              Найдено: {filteredStreamers.length}
            </div>
          </div>

          {filteredStreamers.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-800/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Стримеры не найдены
              </h3>
              <p className="text-gray-400 mb-6">
                Попробуйте изменить параметры поиска или фильтры
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Сбросить фильтры
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStreamers.map((streamer) => (
                <StreamerCard key={streamer.id} streamer={streamer} />
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl p-12 border border-purple-500/20">
            <TrendingUp className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Хотите стать стримером?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Присоединяйтесь к нашей платформе и начните зарабатывать на стримах
            </p>
            <Link href="/register">
              <Button className="px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200">
                <Sparkles className="w-5 h-5 mr-2" />
                Стать стримером
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 