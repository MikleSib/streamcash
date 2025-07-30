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
    } else if (message === 'email_verified') {
      setSuccessMessage('Email успешно подтвержден! Теперь можете войти в аккаунт.');
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
      
      // Проверяем, является ли ошибка связанной с неподтвержденным email
      if (message.includes('Email not verified')) {
        // Перенаправляем на страницу подтверждения
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        return;
      }
      
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-600 border-t-transparent mx-auto mb-8"></div>
          <h3 className="text-xl font-semibold text-white mb-2">Загрузка...</h3>
          <p className="text-gray-300">Проверяем авторизацию</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 py-12">
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">
                Добро пожаловать в <span className="text-purple-400">СтримКэш</span>
              </h1>
              <p className="text-xl text-gray-300">
                Войдите в свой аккаунт и продолжайте зарабатывать
              </p>
            </div>

            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-200 mb-3">"{testimonial.text}"</p>
                      <div className="flex items-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-purple-300 text-sm font-medium">
                        {testimonial.author} • {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center space-x-2 text-purple-300">
              <Zap className="w-5 h-5" />
              <span className="text-sm">Мгновенная интеграция</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-10 border border-gray-700/60 shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 rounded-full mb-6 animate-pulse shadow-lg shadow-purple-500/50">
                  <LogIn className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Вход в аккаунт
                </h2>
                <p className="text-gray-300 text-lg">
                  Или{' '}
                  <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                    создайте новый аккаунт
                  </Link>
                </p>
              </div>

              {successMessage && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-400/20 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <p className="text-green-300 text-sm">{successMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-700/60 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 hover:bg-gray-700/70 ${
                        errors.email ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
                      }`}
                      placeholder="Введите ваш email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Пароль
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-12 py-3 bg-gray-700/60 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 hover:bg-gray-700/70 ${
                        errors.password ? 'border-red-500' : 'border-gray-600 hover:border-gray-500'
                      }`}
                      placeholder="Введите ваш пароль"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                  )}
                </div>

                {errors.general && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{errors.general}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 hover:from-purple-700 hover:via-purple-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 text-lg font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <LogIn className="w-5 h-5 mr-2 relative z-10" />
                  <span className="relative z-10">{loading ? 'Вход...' : 'Войти'}</span>
                </Button>
              </form>

              <div className="mt-8 text-center">
                <Link href="/forgot-password" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  Забыли пароль?
                </Link>
              </div>
            </div>

            {/* Mobile Features */}
            <div className="lg:hidden mt-8 space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <Zap className="w-5 h-5 text-purple-400" />
                <span className="text-gray-300">Мгновенная интеграция</span>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-600 border-t-transparent mx-auto mb-8"></div>
          <h3 className="text-xl font-semibold text-white mb-2">Загрузка...</h3>
          <p className="text-gray-300">Проверяем авторизацию</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
} 