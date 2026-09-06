import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  className?: string;
}

export function TypewriterText({
  text,
  speed = 40,
  delay = 0,
  onComplete,
  className = '',
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (delay > 0) {
      const delayTimer = setTimeout(() => setIsTyping(true), delay);
      return () => clearTimeout(delayTimer);
    }
    setIsTyping(true);
  }, [delay]);

  useEffect(() => {
    if (!isTyping) return;
    if (displayedText.length >= text.length) {
      onComplete?.();
      const cursorTimer = setTimeout(() => setShowCursor(false), 1500);
      return () => clearTimeout(cursorTimer);
    }

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, displayedText.length + 1));
    }, speed);

    return () => clearTimeout(timer);
  }, [displayedText, isTyping, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && isTyping && (
        <span className="inline-block w-[2px] h-[0.9em] bg-warm-gray ml-0.5 align-middle animate-pulse" />
      )}
    </span>
  );
}
