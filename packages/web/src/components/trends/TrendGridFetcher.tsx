import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { TrendGrid } from './TrendGrid';
import { TrendModal } from './TrendModal';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Trend } from '@/types/trend';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface TrendGridFetcherProps {
  activeFilter: string;
  search: string;
  onClearSearch?: () => void;
  onResetFilter?: () => void;
}

const PAGE_SIZE = 20;

export const TrendGridFetcher = memo(function TrendGridFetcher({ activeFilter, search, onClearSearch, onResetFilter }: TrendGridFetcherProps) {
  const { user } = useAuth();
  const [trends, setTrends] = useState<Trend[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchTrends = useCallback(async (currentOffset: number, append: boolean) => {
    try {
      setError(null);
      let filterParam = '';
      if (activeFilter !== 'all') {
        filterParam = `&source=${activeFilter}`;
      } else if (user?.preferences?.sources?.length) {
        filterParam = `&source=${user.preferences.sources.join(',')}`;
      }
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const data = await api.get<{ trends: Trend[]; total: number; hasMore: boolean }>(
        `/trends?limit=${PAGE_SIZE}&offset=${currentOffset}${filterParam}${searchParam}`
      );
      if (append) {
        setTrends(prev => [...prev, ...data.trends]);
      } else {
        setTrends(data.trends);
      }
      setOffset(currentOffset + data.trends.length);
      setHasMore(data.hasMore);
    } catch {
      setError('Failed to load trends. Check your connection and try again.');
    }
  }, [activeFilter, search]);

  // Initial mount only — show skeletons
  useEffect(() => {
    setIsLoading(true);
    fetchTrends(0, false).finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter changes — immediate fetch (no debounce)
  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    fetchTrends(0, false);
  }, [activeFilter, fetchTrends]);

  // Search changes — debounced
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setOffset(0);
      setHasMore(true);
      fetchTrends(0, false);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search, fetchTrends]);

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    fetchTrends(offset, true).finally(() => setIsLoadingMore(false));
  }, [isLoadingMore, hasMore, offset, fetchTrends]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);
    return () => { if (sentinel) observer.unobserve(sentinel); };
  }, [hasMore, isLoadingMore, isLoading, loadMore]);

  const handleSelect = (trend: Trend) => {
    setSelectedTrend(trend);
    setModalOpen(true);
  };

  return (
    <>
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <AlertTriangle size={32} className="text-coral" />
          <p className="font-serif text-warm-gray text-center">{error}</p>
          <Button
            onClick={() => { setIsLoading(true); fetchTrends(0, false).finally(() => setIsLoading(false)); }}
          >
            <RefreshCw size={14} /> RETRY
          </Button>
        </div>
      )}
      <TrendGrid
        trends={trends}
        selectedId={selectedTrend?._id}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        onSelect={handleSelect}
        search={search}
        activeFilter={activeFilter}
        onClearSearch={onClearSearch}
        onResetFilter={onResetFilter}
      />
      <div ref={sentinelRef} className="h-4" />
      <TrendModal
        trend={selectedTrend}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
});
