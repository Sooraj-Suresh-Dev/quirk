import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { Walkthrough } from './Walkthrough';

export function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open walkthrough"
        className="w-10 h-10 flex items-center justify-center rounded-button text-warm-gray hover:text-charcoal hover:bg-cream transition-all duration-150"
        title="Help"
      >
        <MessageSquare size={20} />
      </button>
      <Walkthrough isOpen={isOpen} onClose={() => setIsOpen(false)} pathname={pathname} />
    </>
  );
}
