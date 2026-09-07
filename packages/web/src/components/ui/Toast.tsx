import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const colors = {
  success: 'border-mint',
  error: 'border-red-500',
  info: 'border-coral',
};

export function Toast({ type, message, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = icons[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div role="status" aria-live="polite" className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className={`bg-soft-white border-3 border-deep-black shadow-card rounded-card p-4 flex items-center gap-3 min-w-[300px] ${colors[type]}`}>
        <Icon size={20} className="text-charcoal" />
        <p className="font-serif text-charcoal flex-1">{message}</p>
        <button onClick={onClose} className="text-warm-gray hover:text-charcoal">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
