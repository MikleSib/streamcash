'use client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Стримеры',
  description: 'Найдите и поддержите любимых стримеров на СтримКэш',
};

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
    <div className={`group relative transition-all duration-500 hover:transform hover:scale-105 ${featured ? 'scale-105' : ''}`}>
      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
        featured ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30' : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20'
      }`}></div>
      
      <div className={`relative bg-white/5 backdrop-blur-xl rounded-3xl border-2 transition-all duration-500 overflow-hidden ${
        featured 
          ? 'border-purple-400/40 shadow-2xl shadow-purple-500/20' 
          : 'border-white/10 hover:border-white/20 shadow-xl'
      }`}>
        {featured && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-2xl animate-pulse">
              <Star className="w-4 h-4 mr-2" />
              Рекомендуем
            </div>
          </div>
        )}

        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${
                featured ? 'from-purple-500 to-pink-500' : 'from-blue-500 to-purple-500'
              } rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-white font-black text-xl">
                  {streamer.display_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-black text-white group-hover:text-purple-300 transition-colors">
                    {streamer.display_name}
                  </h3>
                  {streamer.is_verified && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-400 font-medium">@{streamer.user?.username}</p>
              </div>
            </div>
          </div>

          {streamer.stream_title && (
            <h4 className="text-white font-bold text-lg mb-3">{streamer.stream_title}</h4>
          )}

          {streamer.stream_description && (
            <p className="text-gray-300 mb-6 line-clamp-2 leading-relaxed">
              {streamer.stream_description}
            </p>
          )}

          {/* Progress Bar */}
          {streamer.donation_goal > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white font-semibold">Собрано</span>
                <span className="text-white font-bold">
                  {formatMoney(streamer.current_donations)} / {formatMoney(streamer.donation_goal)}
                </span>
              </div>
              <div className="w-full bg-white/10 backdrop-blur-xl rounded-full h-3 border border-white/20">
                <div 
                  className={`bg-gradient-to-r ${
                    featured ? 'from-purple-500 to-pink-500' : 'from-blue-500 to-purple-500'
                  } h-3 rounded-full transition-all duration-500 shadow-lg`}
                  style={{ width: `${getProgressPercentage(streamer.current_donations, streamer.donation_goal)}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
              <Gift className="w-5 h-5 text-purple-400 mr-2" />
              <span className="text-white font-semibold">от {formatMoney(streamer.min_donation_amount)}</span>
            </div>

            <Link href={`/donate/${streamer.donation_url}`}>
              <Button 
                className={`group px-6 py-3 text-lg font-bold bg-gradient-to-r ${
                  featured 
                    ? 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-purple-500/30' 
                    : 'from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-blue-500/30'
                } rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl`}
              >
                <Heart className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Донат
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
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
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/8 via-blue-500/8 to-purple-500/8"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 left-1/2 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
         
            
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-tight">
              Наши
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                звёзды
              </span>
            </h1>
            
            <p className="text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed font-medium">
              Открой для себя талантливых создателей контента и поддержи их творчество
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-16">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Поиск стримеров..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-6 bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/30 text-lg font-medium"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center px-6 py-6 bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-2xl">
              <Filter className="w-6 h-6 text-gray-400 mr-4" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="bg-transparent text-white focus:outline-none text-lg font-medium cursor-pointer"
              >
                <option value="all" className="bg-black">Все стримеры</option>
                <option value="featured" className="bg-black">Рекомендуемые</option>
                <option value="verified" className="bg-black">Верифицированные</option>
              </select>
            </div>
          </div>
        </div>

        {/* Featured Streamers */}
        {featuredStreamers.length > 0 && filter === 'all' && (
          <div className="mb-20">
            <div className="flex items-center mb-12">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-6">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-black text-white">Звёзды платформы</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredStreamers.slice(0, 3).map((streamer) => (
                <StreamerCard key={streamer.id} streamer={streamer} featured />
              ))}
            </div>
          </div>
        )}

        {/* All Streamers */}
        <div>
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-black text-white">
                {filter === 'featured' ? 'Рекомендуемые' : 
                 filter === 'verified' ? 'Верифицированные' : 'Все стримеры'}
              </h2>
            </div>
            <div className="px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
              <span className="text-white font-bold">Найдено: {filteredStreamers.length}</span>
            </div>
          </div>

          {filteredStreamers.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-xl border border-white/10">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4">
                Стримеры не найдены
              </h3>
              <p className="text-xl text-gray-400 mb-10 max-w-md mx-auto">
                Попробуй изменить параметры поиска или фильтры
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl shadow-2xl shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
              >
                Сбросить фильтры
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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