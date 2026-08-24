import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast } from '@/components/ui/Toast';

interface ToastItem {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastContextValue {
  toast: (type: ToastItem['type'], message: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  let nextId = 0;

  const toast = useCallback((type: ToastItem['type'], message: string) => {
    const id = nextId++;
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {toasts.map(t => (
        <Toast
          key={t.id}
          type={t.type}
          message={t.message}
          onClose={() => removeToast(t.id)}
        />
      ))}
    </ToastContext.Provider>
  );
}
