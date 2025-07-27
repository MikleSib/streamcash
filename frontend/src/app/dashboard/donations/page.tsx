'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
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
  ChevronRight
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

      // Применяем фильтры
      if (filters.minAmount) params.min_amount = parseFloat(filters.minAmount);
      if (filters.maxAmount) params.max_amount = parseFloat(filters.maxAmount);
      if (filters.dateFrom) params.date_from = filters.dateFrom;
      if (filters.dateTo) params.date_to = filters.dateTo;
      if (filters.status) params.status = filters.status;
      if (filters.isAnonymous !== '') params.is_anonymous = filters.isAnonymous === 'true';

      const response = await donationAPI.getMy(params);
      setDonations(response.data);
      
      // Для подсчета общего количества можем сделать дополнительный запрос или получить из заголовков
      // setTotalCount(response.headers['x-total-count'] || response.data.length);
      
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
    setCurrentPage(1); // Сброс на первую страницу при изменении фильтров
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
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  // Фильтрация по поиску на клиенте
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          {/* Заголовок */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">История донатов</h1>
                <p className="mt-2 text-gray-600">
                  Просматривайте все {filters.asDonor ? 'отправленные' : 'полученные'} донаты
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Фильтры
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Экспорт
                </Button>
              </div>
            </div>
          </div>

          {/* Переключатель типа донатов */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="donationType"
                  checked={!filters.asDonor}
                  onChange={() => setFilters({ ...filters, asDonor: false })}
                  className="mr-2"
                />
                Полученные донаты
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="donationType"
                  checked={filters.asDonor}
                  onChange={() => setFilters({ ...filters, asDonor: true })}
                  className="mr-2"
                />
                Отправленные донаты
              </label>
            </div>
          </div>

          {/* Фильтры */}
          {showFilters && (
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Поиск
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Имя донатора, сообщение..."
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Мин. сумма (₽)
                  </label>
                  <input
                    type="number"
                    name="minAmount"
                    value={filters.minAmount}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Макс. сумма (₽)
                  </label>
                  <input
                    type="number"
                    name="maxAmount"
                    value={filters.maxAmount}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Без ограничений"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Статус
                  </label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Все статусы</option>
                    <option value="completed">Завершен</option>
                    <option value="pending">В обработке</option>
                    <option value="failed">Неудачно</option>
                    <option value="cancelled">Отменен</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Дата от
                  </label>
                  <input
                    type="date"
                    name="dateFrom"
                    value={filters.dateFrom}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Дата до
                  </label>
                  <input
                    type="date"
                    name="dateTo"
                    value={filters.dateTo}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Анонимность
                  </label>
                  <select
                    name="isAnonymous"
                    value={filters.isAnonymous}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Все</option>
                    <option value="false">Не анонимные</option>
                    <option value="true">Анонимные</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Очистить
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Список донатов */}
          <div className="overflow-hidden">
            {filteredDonations.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Донаты не найдены</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filters.asDonor ? 'Вы еще не отправляли донаты' : 'Вы еще не получали донаты'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredDonations.map((donation) => (
                  <div key={donation.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {donation.is_anonymous ? (
                              <User className="w-5 h-5 text-blue-600" />
                            ) : (
                              <User className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900">
                              {donation.is_anonymous ? 'Анонимный донат' : donation.donor_name || 'Неизвестный донатор'}
                            </p>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(donation.status)}`}>
                              {getStatusText(donation.status)}
                            </span>
                          </div>
                          
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(donation.created_at)}
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {formatMoney(donation.amount)}
                            </div>
                            {donation.message && (
                              <div className="flex items-center">
                                <MessageSquare className="w-4 h-4 mr-1" />
                                <span className="truncate max-w-xs">
                                  {donation.message}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Подробнее
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Страница {currentPage} из {totalPages}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 