'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn,
  CheckCircle,
  Star,
  Users,
  Zap
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

function LoginContent() {
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
      return;
    }

    const message = searchParams.get('message');
    if (message === 'registration_success') {
      setSuccessMessage('Регистрация успешна! Теперь можете войти в аккаунт.');
    }
  }, [user, authLoading, router, searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      router.push('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Ошибка входа. Проверьте данные.';
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  const testimonials = [
    {
      text: "Лучшая платформа для стримеров! Донаты приходят мгновенно.",
      author: "Мария",
      role: "Twitch стример"
    },
    {
      text: "Простая настройка и красивые алерты. Рекомендую всем!",
      author: "Алексей",
      role: "YouTube стример"
    },
    {
      text: "Отличная поддержка и быстрая интеграция с платежными системами.",
      author: "Елена",
      role: "TikTok стример"
    }
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <div className="flex min-h-screen">
        {/* Левая часть - Форма входа */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Вход в аккаунт
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Или{' '}
                <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                  создайте новый аккаунт
                </Link>
              </p>
            </div>

            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div className="ml-3">
                    <p className="text-sm text-green-800">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`appearance-none relative block w-full pl-10 pr-3 py-2 border ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                      placeholder="Введите ваш email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Пароль
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`appearance-none relative block w-full pl-10 pr-10 py-2 border ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                      placeholder="Введите ваш пароль"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </div>

              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-800">{errors.general}</p>
                </div>
              )}

              <div>
                <Button
                  type="submit"
                  loading={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {loading ? 'Вход...' : 'Войти'}
                </Button>
              </div>

              <div className="text-center">
                <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
                  Забыли пароль?
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Правая часть - Отзывы */}
        <div className="hidden lg:flex lg:flex-1 bg-indigo-600 items-center justify-center px-8">
          <div className="max-w-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Присоединяйтесь к тысячам стримеров
              </h3>
              <p className="text-indigo-100">
                Получайте донаты мгновенно с красивыми алертами
              </p>
            </div>

            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-indigo-400 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm mb-2">"{testimonial.text}"</p>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      </div>
                      <p className="text-indigo-200 text-xs mt-1">
                        {testimonial.author} • {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <div className="flex items-center justify-center space-x-2 text-indigo-200">
                <Zap className="w-5 h-5" />
                <span className="text-sm">Мгновенная интеграция</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
} 