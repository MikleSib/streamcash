'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { donationAPI } from '@/lib/api';
import { formatMoney } from '@/lib/utils';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  DollarSign,
  User,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  History,
  Sparkles
} from 'lucide-react';

interface Donation {
  id: number;
  amount: number;
  message?: string;
  donor_name?: string;
  donor_email?: string;
  is_anonymous: boolean;
  status: string;
  payment_method: string;
  created_at: string;
  updated_at?: string;
}

interface FilterState {
  search: string;
  minAmount: string;
  maxAmount: string;
  dateFrom: string;
  dateTo: string;
  status: string;
  isAnonymous: string;
  asDonor: boolean;
}

export default function DonationsHistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    minAmount: '',
    maxAmount: '',
    dateFrom: '',
    dateTo: '',
    status: '',
    isAnonymous: '',
    asDonor: false,
  });
  
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadDonations();
    }
  }, [user, authLoading, currentPage, filters]);

  const loadDonations = async () => {
    try {
      setLoading(true);
      
      const params: any = {
        skip: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
        as_donor: filters.asDonor,
      };

      if (filters.minAmount) params.min_amount = parseFloat(filters.minAmount);
      if (filters.maxAmount) params.max_amount = parseFloat(filters.maxAmount);
      if (filters.dateFrom) params.date_from = filters.dateFrom;
      if (filters.dateTo) params.date_to = filters.dateTo;
      if (filters.status) params.status = filters.status;
      if (filters.isAnonymous !== '') params.is_anonymous = filters.isAnonymous === 'true';

      const response = await donationAPI.getMy(params);
      setDonations(response.data);
      
    } catch (error) {
      console.error('Failed to load donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFilters({
        ...filters,
        [name]: target.checked,
      });
    } else {
      setFilters({
        ...filters,
        [name]: value,
      });
    }
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      minAmount: '',
      maxAmount: '',
      dateFrom: '',
      dateTo: '',
      status: '',
      isAnonymous: '',
      asDonor: false,
    });
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-300 border border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-300 border border-red-500/30';
      case 'cancelled':
        return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Завершен';
      case 'pending':
        return 'В обработке';
      case 'failed':
        return 'Неудачно';
      case 'cancelled':
        return 'Отменен';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredDonations = donations.filter(donation => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    return (
      donation.donor_name?.toLowerCase().includes(searchLower) ||
      donation.message?.toLowerCase().includes(searchLower) ||
      donation.amount.toString().includes(searchLower)
    );
  });

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-6"></div>
            <p className="text-gray-300 text-lg">Загружаем историю донатов...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return null;
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-5">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <History className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    История донатов
                  </h1>
                  <p className="text-gray-300 text-lg mt-1">
                    Просматривайте все {filters.asDonor ? 'отправленные' : 'полученные'} донаты
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-6 py-3 transition-all duration-200 ${
                    showFilters 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-gray-700/50 border border-gray-600/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Фильтры
                </Button>
                <Button className="px-6 py-3 bg-green-600 hover:bg-green-700">
                  <Download className="w-4 h-4 mr-2" />
                  Экспорт
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Type Toggle */}
        <div className="bg-gray-800/70 backdrop-blur-md rounded-xl border border-gray-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Тип донатов</h3>
          <div className="flex items-center space-x-6">
            <label className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="donationType"
                checked={!filters.asDonor}
                onChange={() => setFilters({ ...filters, asDonor: false })}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 mr-3 transition-all ${
                !filters.asDonor 
                  ? 'border-purple-500 bg-purple-500' 
                  : 'border-gray-500 group-hover:border-gray-400'
              }`}>
                {!filters.asDonor && (
                  <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                )}
              </div>
              <span className="text-gray-200 group-hover:text-white transition-colors">
                Полученные донаты
              </span>
            </label>
            
            <label className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="donationType"
                checked={filters.asDonor}
                onChange={() => setFilters({ ...filters, asDonor: true })}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 mr-3 transition-all ${
                filters.asDonor 
                  ? 'border-purple-500 bg-purple-500' 
                  : 'border-gray-500 group-hover:border-gray-400'
              }`}>
                {filters.asDonor && (
                  <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                )}
              </div>
              <span className="text-gray-200 group-hover:text-white transition-colors">
                Отправленные донаты
              </span>
            </label>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-800/70 backdrop-blur-md rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Фильтры поиска</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Поиск
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="pl-10 w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Имя донатора, сообщение..."
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Мин. сумма (₽)
                </label>
                <input
                  type="number"
                  name="minAmount"
                  value={filters.minAmount}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Макс. сумма (₽)
                </label>
                <input
                  type="number"
                  name="maxAmount"
                  value={filters.maxAmount}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Без ограничений"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Статус
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Все статусы</option>
                  <option value="completed">Завершен</option>
                  <option value="pending">В обработке</option>
                  <option value="failed">Неудачно</option>
                  <option value="cancelled">Отменен</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Дата от
                </label>
                <input
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Дата до
                </label>
                <input
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Анонимность
                </label>
                <select
                  name="isAnonymous"
                  value={filters.isAnonymous}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 bg-gray-700/70 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Все</option>
                  <option value="false">Не анонимные</option>
                  <option value="true">Анонимные</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <Button
                  onClick={clearFilters}
                  className="w-full px-4 py-3 bg-gray-600/50 border border-gray-500/50 text-gray-300 hover:bg-gray-500/50"
                >
                  Очистить
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Donations List */}
        <div className="bg-gray-800/70 backdrop-blur-md rounded-xl border border-gray-700/50 overflow-hidden">
          {filteredDonations.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Донаты не найдены</h3>
              <p className="text-gray-400 text-lg">
                {filters.asDonor ? 'Вы еще не отправляли донаты' : 'Вы еще не получали донаты'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700/50">
              {filteredDonations.map((donation) => (
                <div key={donation.id} className="p-6 hover:bg-gray-700/30 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                          {donation.is_anonymous ? (
                            <User className="w-7 h-7 text-purple-400" />
                          ) : (
                            <Sparkles className="w-7 h-7 text-purple-400" />
                          )}
                        </div>
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <p className="text-lg font-bold text-white">
                            {donation.is_anonymous ? 'Анонимный донат' : donation.donor_name || 'Неизвестный донатор'}
                          </p>
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(donation.status)}`}>
                            {getStatusText(donation.status)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-300">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                            {formatDate(donation.created_at)}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                            <span className="font-bold text-green-400">
                              {formatMoney(donation.amount)}
                            </span>
                          </div>
                        </div>
                        
                        {donation.message && (
                          <div className="mt-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                            <div className="flex items-start">
                              <MessageSquare className="w-4 h-4 mr-2 text-purple-400 mt-0.5" />
                              <p className="text-gray-200 text-sm">
                                {donation.message}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Button className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30">
                        <Eye className="w-4 h-4 mr-2" />
                        Подробнее
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-700/50 flex items-center justify-between bg-gray-800/50">
              <div className="text-sm text-gray-300">
                Страница {currentPage} из {totalPages}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-300 hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <Button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-300 hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed"  
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 