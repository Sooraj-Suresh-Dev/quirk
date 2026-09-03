import { SOURCES } from '@/config/sources';

interface BadgeProps {
  source: keyof typeof SOURCES;
  className?: string;
}

export function Badge({ source, className = '' }: BadgeProps) {
  const config = SOURCES[source];
  if (!config) return null;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-mono border border-deep-black ${config.bgColor} text-soft-white ${className}`}>
      {config.label}
    </span>
  );
}
