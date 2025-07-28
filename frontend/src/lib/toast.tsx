'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { ToastContainer } from '@/components/ui/ToastContainer';

interface ToastItem {
  id: string;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (message: string, title?: string) => {
    showToast({ message, title, type: 'success' });
  };

  const error = (message: string, title?: string) => {
    showToast({ message, title, type: 'error' });
  };

  const warning = (message: string, title?: string) => {
    showToast({ message, title, type: 'warning' });
  };

  const info = (message: string, title?: string) => {
    showToast({ message, title, type: 'info' });
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <ToastContainer 
        toasts={toasts.map(toast => ({ ...toast, onClose: () => removeToast(toast.id) }))} 
        onRemove={removeToast} 
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
} 