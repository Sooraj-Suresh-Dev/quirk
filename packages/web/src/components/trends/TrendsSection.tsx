import { useState, useEffect } from 'react';
import { TrendCard } from '@/components/trends/TrendCard';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { api } from '@/lib/api';

interface Trend {
  _id: string;
  source: 'github' | 'hackernews';
  title: string;
  url: string;
  summary: string;
  tags: string[];
}

interface TrendsSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const ITEMS_PER_PAGE = 9;

export function TrendsSection({
  title = 'TRENDING IN TECH',
  subtitle = 'See what the tech world is talking about right now.',
  className = '',
}: TrendsSectionProps) {
  const [trends, setTrends] = useState<Trend[]>([]);
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

  return (
    <section className={`py-24 px-8 ${className}`}>
      <div className="mx-auto">
        <h2 className="font-mono text-3xl font-bold text-charcoal mb-2">{title}</h2>
        <p className="font-serif text-warm-gray mb-8">{subtitle}</p>
        <div className="flex gap-2 mb-8">
          <Pill active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>ALL</Pill>
          <Pill active={activeFilter === 'github'} onClick={() => setActiveFilter('github')}>GITHUB</Pill>
          <Pill active={activeFilter === 'hackernews'} onClick={() => setActiveFilter('hackernews')}>HACKER NEWS</Pill>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <>
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </>
          ) : paginatedTrends.length === 0 ? (
            <p className="font-serif text-warm-gray text-center py-8 col-span-3">
              No trends found
            </p>
          ) : (
            paginatedTrends.map(trend => (
              <TrendCard key={trend._id} trend={trend} />
            ))
          )}
        </div>
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
    </section>
  );
}
