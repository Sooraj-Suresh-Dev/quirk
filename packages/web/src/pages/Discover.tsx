import { useState, useEffect, useRef, useCallback } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TrendGrid } from '@/components/trends/TrendGrid';
import { TrendModal } from '@/components/trends/TrendModal';
import { TrendFilters } from '@/components/trends/TrendFilters';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { Search, ArrowUp } from 'lucide-react';

interface Trend {
  _id: string;
  source: 'github' | 'hackernews';
  title: string;
  url: string;
  summary: string;
  tags: string[];
  thumbnailUrl?: string;
  stars?: number;
  forks?: number;
  points?: number;
  comments?: number;
  author?: string;
  createdAt?: string;
}

const PAGE_SIZE = 20;

export function Discover() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchTrends = useCallback(async (currentOffset: number, append: boolean) => {
    const filterParam = activeFilter !== 'all' ? `&source=${activeFilter}` : '';
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
  }, [activeFilter, search]);

  useEffect(() => {
    setIsLoading(true);
    setOffset(0);
    setHasMore(true);
    fetchTrends(0, false).finally(() => setIsLoading(false));
  }, [fetchTrends]);

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    await fetchTrends(offset, true);
    setIsLoadingMore(false);
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

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY && currentScrollY > 1000) {
        setShowScrollTop(true);
      } else if (currentScrollY <= 1000) {
        setShowScrollTop(false);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelect = (trend: Trend) => {
    setSelectedTrend(trend);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <main className="ml-[60px] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="font-mono text-3xl font-bold text-charcoal">DISCOVER</h1>
            <p className="font-serif text-warm-gray mt-1">Find trending topics and generate content</p>
          </div>

          <div className="relative mb-6">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" />
            <Input
              placeholder="Search trends..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12"
            />
          </div>

          <TrendFilters active={activeFilter} onChange={setActiveFilter} />

          <div className="mt-6">
            <TrendGrid
              trends={trends}
              selectedId={selectedTrend?._id}
              isLoading={isLoading}
              isLoadingMore={isLoadingMore}
              onSelect={handleSelect}
              onGenerate={handleSelect}
            />
            <div ref={sentinelRef} className="h-4" />
          </div>
        </div>
      </main>

      <TrendModal
        trend={selectedTrend}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-10 h-10 rounded-full bg-coral text-soft-white shadow-button border-2 border-deep-black flex items-center justify-center hover:shadow-button-hover active:shadow-button-active transition-all duration-150 cursor-pointer z-50"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}
