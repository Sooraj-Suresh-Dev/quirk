import { ButtonHTMLAttributes } from 'react';

interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function Pill({ active = false, className = '', children, ...props }: PillProps) {
  return (
    <button
      className={`inline-flex items-center px-4 py-2 rounded-pill border-2 border-deep-black font-mono text-sm cursor-pointer transition-all duration-150 ${
        active
          ? 'bg-coral text-soft-white'
          : 'bg-soft-white text-charcoal hover:bg-cream'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
