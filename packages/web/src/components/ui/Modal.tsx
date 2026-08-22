import { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-deep-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-soft-white rounded-card border-3 border-deep-black shadow-card p-8 max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-warm-gray hover:text-charcoal transition-colors"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}
