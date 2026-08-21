import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`bg-soft-white text-charcoal font-serif px-4 py-3 rounded-button border-2 border-deep-black shadow-input focus:border-coral focus:outline-none transition-all duration-150 w-full ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500 font-serif">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
