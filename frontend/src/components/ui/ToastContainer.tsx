'use client';

import { Toast, ToastProps } from './Toast';

interface ToastContainerProps {
  toasts: (ToastProps & { id: string })[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-20 right-4 left-4 z-50 space-y-2 flex flex-col items-end">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onRemove}
        />
      ))}
    </div>
  );
} 