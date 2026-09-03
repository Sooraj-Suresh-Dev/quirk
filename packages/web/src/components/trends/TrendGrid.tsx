import { memo } from 'react';
import { TrendCard } from './TrendCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Trend } from '@/types/trend';

interface TrendGridProps {
  trends: Trend[];
  selectedId?: string;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  onSelect: (trend: Trend) => void;
  onBookmark?: (trend: Trend) => void;
  onGenerate?: (trend: Trend) => void;
}

export const TrendGrid = memo(function TrendGrid({ trends, selectedId, isLoading, isLoadingMore, onSelect, onBookmark, onGenerate }: TrendGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton variant="image" />
        <Skeleton variant="image" />
        <Skeleton variant="image" />
        <Skeleton variant="image" />
      </div>
    );
  }

  if (trends.length === 0) {
    return (
      <p className="font-serif text-warm-gray text-center py-8">
        No trends found
      </p>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trends.map(trend => (
          <TrendCard
            key={trend._id}
            trend={trend}
            selected={selectedId === trend._id}
            onClick={() => onSelect(trend)}
            onBookmark={onBookmark}
            onGenerate={onGenerate}
          />
        ))}
      </div>
      {isLoadingMore && (
        <div className="flex justify-center items-center gap-2 py-8">
          <span
            className="w-2 h-2 rounded-full bg-coral"
            style={{ animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '0ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-coral"
            style={{ animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '200ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-coral"
            style={{ animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite', animationDelay: '400ms' }}
          />
        </div>
      )}
    </div>
  );
});
