interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'image';
}

export function Skeleton({ className = '', variant = 'default' }: SkeletonProps) {
  const shape = variant === 'image' ? 'rounded-card aspect-[3/1]' : 'rounded-card';
  return (
    <div className={`animate-pulse bg-cream ${shape} ${className}`} />
  );
}
