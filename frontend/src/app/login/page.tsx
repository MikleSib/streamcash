'use client';

import { useState, useEffect } from 'react';
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

export default function LoginPage() {
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
      text: "Интерфейс просто супер, настройка заняла 5 минут.",
      author: "Дмитрий", 
      role: "YouTube стример"
    },
    {
      text: "Поддержка ответила за 10 минут, проблема решена быстро!",
      author: "Анна",
      role: "VK Play стример"
    }
  ];

  const stats = [
    { icon: <Users className="w-5 h-5 text-blue-400" />, label: "10K+ стримеров" },
    { icon: <Zap className="w-5 h-5 text-yellow-400" />, label: "Мгновенные алерты" },
    { icon: <Star className="w-5 h-5 text-purple-400" />, label: "4.9/5 рейтинг" }
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
        {/* Left Side - Welcome & Stats */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 py-12">
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">
                С возвращением в <span className="text-purple-400">СтримКэш</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Продолжайте зарабатывать на своих стримах
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-gray-800/30 rounded-lg px-4 py-2 backdrop-blur-sm border border-gray-700/50">
                    {stat.icon}
                    <span className="text-gray-300 text-sm">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-6">
                Что говорят наши пользователи:
              </h3>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
                  <div className="flex items-start mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{testimonial.author}</p>
                      <p className="text-gray-400 text-xs">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
                  <LogIn className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Добро пожаловать
                </h2>
                <p className="text-gray-400">
                  Войдите в свой аккаунт для продолжения
                </p>
              </div>

              {successMessage && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <p className="text-green-400 text-sm">{successMessage}</p>
                </div>
              )}

              {errors.general && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{errors.general}</p>
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
                      className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Введите ваш email"
                      autoComplete="email"
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
                      className={`w-full pl-10 pr-12 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        errors.password ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Введите пароль"
                      autoComplete="current-password"
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

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-300">Запомнить меня</span>
                  </label>
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Забыли пароль?
                  </Link>
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 text-lg font-semibold"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Войти
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  Нет аккаунта?{' '}
                  <Link 
                    href="/register" 
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    Зарегистрироваться
                  </Link>
                </p>
              </div>
            </div>

            {/* Mobile Stats */}
            <div className="lg:hidden mt-8 flex flex-wrap gap-2 justify-center">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center space-x-2 bg-gray-800/30 rounded-lg px-3 py-2 backdrop-blur-sm border border-gray-700/50">
                  {stat.icon}
                  <span className="text-gray-300 text-xs">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 