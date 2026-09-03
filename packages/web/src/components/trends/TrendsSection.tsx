import { useState, useEffect } from 'react';
import { TrendGrid } from '@/components/trends/TrendGrid';
import { TrendModal } from '@/components/trends/TrendModal';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { Trend } from '@/types/trend';
import { SOURCES, SOURCE_KEYS } from '@/config/sources';

interface TrendsSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const ITEMS_PER_PAGE = 6;

export function TrendsSection({
  title = 'TRENDING IN TECH',
  subtitle = 'See what the tech world is talking about right now.',
  className = '',
}: TrendsSectionProps) {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const data = await api.get<{ trends: Trend[] }>('/trends');
        setTrends(data.trends);
      } catch (err) {
        console.error('Failed to fetch trends:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrends();
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

  return (
    <section className={`py-24 px-8 ${className}`}>
      <div className="mx-auto">
        <h2 className="font-mono text-3xl font-bold text-charcoal mb-2">{title}</h2>
        <p className="font-serif text-warm-gray mb-8">{subtitle}</p>
        <div className="flex gap-2 mb-8">
          <Pill active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>ALL</Pill>
          {SOURCE_KEYS.map(key => (
            <Pill
              key={key}
              active={activeFilter === key}
              onClick={() => setActiveFilter(key)}
            >
              {SOURCES[key].filterLabel}
            </Pill>
          ))}
        </div>

        <TrendGrid
          trends={paginatedTrends}
          selectedId={selectedTrend?._id}
          isLoading={isLoading}
          onSelect={handleSelect}
          onGenerate={handleSelect}
        />

        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="secondary"
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
            >
              PREVIOUS
            </Button>
            <span className="font-mono text-sm text-warm-gray">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="secondary"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
            >
              NEXT
            </Button>
          </div>
        )}
      </div>

      <TrendModal
        trend={selectedTrend}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
