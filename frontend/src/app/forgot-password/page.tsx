'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { 
  Mail, 
  ArrowLeft,
  Shield,
  Check
} from 'lucide-react';
import { authAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function ForgotPasswordPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email обязателен');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Некорректный email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authAPI.forgotPassword({ email });
      setEmailSent(true);
    } catch (error: any) {
      console.error('Forgot password error:', error);
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else {
        setError('Произошла ошибка. Попробуйте снова.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  if (emailSent) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Код отправлен!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Мы отправили код для сброса пароля на<br />
              <span className="font-medium text-gray-900">{email}</span>
            </p>
            
            <p className="text-sm text-gray-500 mb-6">
              Проверьте папку "Спам", если письмо не пришло в течение нескольких минут.
            </p>
            
            <Link href="/reset-password">
              <Button className="w-full mb-4">
                Ввести код
              </Button>
            </Link>
            
            <Link 
              href="/login" 
              className="text-purple-600 hover:text-purple-700 text-sm font-medium"
            >
              Вернуться к входу
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Забыли пароль?
            </h1>
            <p className="text-gray-600">
              Введите email и мы отправим код для восстановления доступа
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email адрес
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                    error ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="example@email.com"
                  disabled={loading}
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="w-4 h-4 text-red-500 mr-1">⚠</span>
                  {error}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              loading={loading}
              className="w-full py-3"
            >
              {loading ? 'Отправляем...' : 'Отправить код'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/login" 
              className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Вернуться к входу
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Нет аккаунта?{' '}
              <Link href="/register" className="text-purple-600 hover:text-purple-700 font-medium">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}