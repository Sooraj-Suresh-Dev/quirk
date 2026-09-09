import { ButtonHTMLAttributes } from 'react';

interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function Pill({ active = false, className = '', children, ...props }: PillProps) {
  return (
    <button
      aria-pressed={active}
      className={`inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-pill border-2 border-deep-black font-mono text-xs md:text-sm cursor-pointer transition-all duration-150 ${
        active
          ? 'bg-coral text-soft-white shadow-button hover:shadow-button-hover active:shadow-button-active'
          : 'bg-soft-white text-charcoal hover:bg-cream shadow-none hover:shadow-button-hover active:shadow-button-active'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
