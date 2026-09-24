import { useState, useEffect, useCallback } from 'react';
import { useInView } from '@/hooks/useInView';
import { TrendGrid } from '@/components/trends/TrendGrid';
import { TrendModal } from '@/components/trends/TrendModal';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { Trend } from '@/types/trend';
import { SOURCES, SOURCE_KEYS } from '@/config/sources';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface TrendsSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
  showFilters?: boolean;
}

const ITEMS_PER_PAGE = 6;

export function TrendsSection({
  title = 'TRENDING IN TECH',
  subtitle = 'See what the tech world is talking about right now.',
  className = '',
  showFilters = true,
}: TrendsSectionProps) {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sectionRef = useInView(0.1);

  const fetchTrends = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.get<{ trends: Trend[] }>('/trends?limit=50');
      setTrends(data.trends);
    } catch (err) {
      console.error('Failed to fetch trends:', err);
      setError('Unable to load trends. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      void (async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await api.get<{ trends: Trend[] }>('/trends?limit=50');
          if (!cancelled) setTrends(data.trends);
        } catch (err) {
          console.error('Failed to fetch trends:', err);
          if (!cancelled) setError('Unable to load trends. Please try again.');
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      })();
    }, 1500);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  const filteredTrends = activeFilter === 'all'
    ? trends
    : trends.filter(t => t.source === activeFilter);

  const totalPages = Math.ceil(filteredTrends.length / ITEMS_PER_PAGE);
  const paginatedTrends = filteredTrends.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelect = (trend: Trend) => {
    setSelectedTrend(trend);
    setModalOpen(true);
  };

  const scrollToTop = () => {
    sectionRef.ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className={`py-24 px-8 ${className}`}>
      <div className="max-w-6xl mx-auto" ref={sectionRef.ref}>
        <h2 className={`font-mono text-3xl font-bold text-charcoal mb-2 ${sectionRef.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>{title}</h2>
        <p className={`font-serif text-warm-gray mb-8 ${sectionRef.inView ? 'animate-fade-in-up stagger-1' : 'opacity-0'}`}>{subtitle}</p>
        {showFilters && (
          <div className="flex gap-2 mb-8">
            <Pill active={activeFilter === 'all'} onClick={() => { setActiveFilter('all'); scrollToTop(); }}>ALL</Pill>
            {SOURCE_KEYS.map(key => (
              <Pill
                key={key}
                active={activeFilter === key}
                onClick={() => { setActiveFilter(key); scrollToTop(); }}
              >
                {SOURCES[key].filterLabel}
              </Pill>
            ))}
          </div>
        )}

        <div className={sectionRef.inView ? 'animate-fade-in-up stagger-2' : 'opacity-0'}>
        <TrendGrid
          trends={paginatedTrends}
          selectedId={selectedTrend?._id}
          isLoading={isLoading}
          onSelect={handleSelect}
        />

        {error && !isLoading && (
          <div className="text-center py-12">
            <AlertTriangle size={40} className="text-coral mx-auto mb-4" />
            <p className="font-serif text-warm-gray mb-4">{error}</p>
            <Button variant="secondary" onClick={fetchTrends}>
              <RefreshCw size={16} className="mr-2" />
              TRY AGAIN
            </Button>
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="secondary"
              onClick={() => { setCurrentPage(p => p - 1); scrollToTop(); }}
              disabled={currentPage === 1}
            >
              PREVIOUS
            </Button>
            <span className="font-mono text-sm text-warm-gray">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="secondary"
              onClick={() => { setCurrentPage(p => p + 1); scrollToTop(); }}
              disabled={currentPage === totalPages}
            >
              NEXT
            </Button>
          </div>
        )}
        </div>
      </div>

      <TrendModal
        trend={selectedTrend}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
