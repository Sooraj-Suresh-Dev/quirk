import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { TrendGrid } from './TrendGrid';
import { TrendModal } from './TrendModal';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Trend } from '@/types/trend';

interface TrendGridFetcherProps {
  activeFilter: string;
  search: string;
}

const PAGE_SIZE = 20;

export const TrendGridFetcher = memo(function TrendGridFetcher({ activeFilter, search }: TrendGridFetcherProps) {
  const { user } = useAuth();
  const [trends, setTrends] = useState<Trend[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchTrends = useCallback(async (currentOffset: number, append: boolean) => {
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
  }, [activeFilter, search, user]);

  // Initial mount only — show skeletons
  useEffect(() => {
    setIsLoading(true);
    fetchTrends(0, false).finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Search/filter changes — don't show skeletons, keep old results visible
  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    fetchTrends(0, false);
  }, [fetchTrends]);

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
      <TrendGrid
        trends={trends}
        selectedId={selectedTrend?._id}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        onSelect={handleSelect}
        onGenerate={handleSelect}
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
