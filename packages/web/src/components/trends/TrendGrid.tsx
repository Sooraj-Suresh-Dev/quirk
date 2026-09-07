import { memo } from 'react';
import { TrendCard } from './TrendCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Trend } from '@/types/trend';
import { SOURCES } from '@/config/sources';
import { SearchX, Filter, Compass, RefreshCw } from 'lucide-react';

interface TrendGridProps {
  trends: Trend[];
  selectedId?: string;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  onSelect: (trend: Trend) => void;
  search?: string;
  activeFilter?: string;
  onClearSearch?: () => void;
  onResetFilter?: () => void;
}

export const TrendGrid = memo(function TrendGrid({
  trends,
  selectedId,
  isLoading,
  isLoadingMore,
  onSelect,
  search,
  activeFilter,
  onClearSearch,
  onResetFilter,
}: TrendGridProps) {
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
    // Search empty state
    if (search) {
      return (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 rounded-card border-3 border-deep-black bg-soft-white shadow-card flex items-center justify-center">
            <SearchX size={32} className="text-coral" />
          </div>
          <div className="text-center">
            <h3 className="font-mono text-lg font-bold text-charcoal uppercase">
              No results for &ldquo;{search}&rdquo;
            </h3>
            <p className="font-serif text-warm-gray mt-2 max-w-md">
              Try a different search term or clear the search to see all trends.
            </p>
          </div>
          <Button variant="secondary" onClick={onClearSearch}>
            CLEAR SEARCH
          </Button>
        </div>
      );
    }

    // Source filter empty state
    if (activeFilter && activeFilter !== 'all') {
      const sourceConfig = SOURCES[activeFilter];
      const sourceLabel = sourceConfig?.label ?? activeFilter;
      return (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 rounded-card border-3 border-deep-black bg-soft-white shadow-card flex items-center justify-center">
            <Filter size={32} className="text-coral" />
          </div>
          <div className="text-center">
            <h3 className="font-mono text-lg font-bold text-charcoal uppercase">
              No {sourceLabel} trends yet
            </h3>
            <p className="font-serif text-warm-gray mt-2 max-w-md">
              There are no {sourceLabel} trends right now. Try another source or check back later.
            </p>
          </div>
          <Button variant="secondary" onClick={onResetFilter}>
            SHOW ALL SOURCES
          </Button>
        </div>
      );
    }

    // General empty state
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-16 h-16 rounded-card border-3 border-deep-black bg-soft-white shadow-card flex items-center justify-center">
          <Compass size={32} className="text-coral" />
        </div>
        <div className="text-center">
          <h3 className="font-mono text-lg font-bold text-charcoal uppercase">
            All quiet here
          </h3>
          <p className="font-serif text-warm-gray mt-2 max-w-md">
            No trends available right now. This usually means trends are being refreshed. Try again in a few minutes.
          </p>
        </div>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          <RefreshCw size={14} /> RETRY
        </Button>
      </div>
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
