import { ReactNode, MouseEventHandler } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  style?: React.CSSProperties;
}

export function Card({ children, className = '', hover = false, onClick, style }: CardProps) {
  return (
    <div
      className={`bg-soft-white rounded-card border-3 border-deep-black shadow-card p-6 transition-all duration-200 ${hover ? 'hover:shadow-card-hover hover:-translate-y-1 cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}
