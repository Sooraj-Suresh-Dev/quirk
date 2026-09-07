import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id: string;
  className?: string;
}

export function Checkbox({ checked, onChange, label, id, className = '' }: CheckboxProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        id={id}
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-5 h-5 rounded-sm border-2 border-deep-black flex items-center justify-center transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 ${
          checked
            ? 'bg-coral shadow-input'
            : 'bg-soft-white shadow-input hover:bg-cream'
        }`}
      >
        {checked && <Check size={14} className="text-soft-white" strokeWidth={3} />}
      </button>
      <label htmlFor={id} className="font-serif text-charcoal cursor-pointer select-none">
        {label}
      </label>
    </div>
  );
}
