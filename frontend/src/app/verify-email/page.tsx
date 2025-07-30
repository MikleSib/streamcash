'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { 
  Mail, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { authAPI } from '@/lib/api';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '').slice(0, 6);
    const newCode = [...code];
    
    for (let i = 0; i < 6; i++) {
      newCode[i] = pastedData[i] || '';
    }
    setCode(newCode);
    
    if (pastedData.length === 6) {
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setMessage('Введите 6-значный код');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      await authAPI.verifyEmail({
        email: email,
        code: verificationCode
      });
      
      setMessage('Email успешно подтвержден! Перенаправляем на страницу входа...');
      setMessageType('success');
      
      setTimeout(() => {
        router.push('/login?message=email_verified');
      }, 2000);
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Ошибка подтверждения кода';
      setMessage(errorMessage);
      setMessageType('error');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setMessage('Email не найден');
      setMessageType('error');
      return;
    }

    setResendLoading(true);
    setMessage('');
    
    try {
      await authAPI.resendVerification({ email });
      setMessage('Новый код отправлен на ваш email');
      setMessageType('success');
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Ошибка отправки кода';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Header />
      
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-10 border border-gray-700/60 shadow-2xl shadow-purple-500/20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 rounded-full mb-6">
                <Mail className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">
                Подтвердите email
              </h2>
              <p className="text-gray-300">
                Введите 6-значный код, отправленный на {email}
              </p>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
                messageType === 'success' 
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}>
                {messageType === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="text-sm">{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4 text-center">
                  Код подтверждения
                </label>
                <div className="flex justify-center space-x-3">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => inputRefs.current[index] = el}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      autoComplete="off"
                      className="w-12 h-12 text-center text-xl font-bold bg-gray-700/60 backdrop-blur-sm border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 hover:from-purple-700 hover:via-purple-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 text-lg font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
              >
                Подтвердить
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={handleResendCode}
                disabled={resendLoading}
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors flex items-center justify-center space-x-2 mx-auto"
              >
                {resendLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                <span>
                  {resendLoading ? 'Отправка...' : 'Отправить код повторно'}
                </span>
              </button>
            </div>

            <div className="mt-8 text-center">
              <Link 
                href="/login" 
                className="text-gray-400 hover:text-gray-300 font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Вернуться к входу</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 