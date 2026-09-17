import { HelpCircle } from 'lucide-react';

interface HelpButtonProps {
  onClick: () => void;
}

export function HelpButton({ onClick }: HelpButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Help"
      className="w-10 h-10 flex items-center justify-center rounded-button text-warm-gray hover:text-charcoal hover:bg-cream transition-all duration-150"
      title="Help"
    >
      <HelpCircle size={20} />
    </button>
  );
}
