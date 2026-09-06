import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', isLoading, className = '', children, disabled, ...props }, ref) => {
    const base = 'font-mono text-sm uppercase tracking-wider px-6 py-3 rounded-button border-2 border-deep-black transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2';

    const variants = {
      primary: 'bg-coral text-soft-white shadow-button hover:shadow-button-hover active:shadow-button-active',
      secondary: 'bg-soft-white text-charcoal shadow-button hover:bg-charcoal hover:text-soft-white hover:shadow-button-hover active:bg-charcoal active:shadow-button-active',
      ghost: 'bg-transparent text-warm-gray shadow-none hover:bg-cream hover:shadow-button-hover active:bg-cream/80 active:shadow-button-active',
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 size={16} className="animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
