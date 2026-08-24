import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TrendGrid } from '@/components/trends/TrendGrid';
import { TrendModal } from '@/components/trends/TrendModal';
import { TrendFilters } from '@/components/trends/TrendFilters';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { Search } from 'lucide-react';

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

const ITEMS_PER_PAGE = 12;

export function Trends() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
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
  }, [activeFilter, search]);

  const filtered = trends
    .filter(t => activeFilter === 'all' || t.source === activeFilter)
    .filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedTrends = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelect = (trend: Trend) => {
    setSelectedTrend(trend);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <main className="ml-[60px] p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-mono text-3xl font-bold text-charcoal mb-6">TRENDS</h1>

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
              trends={paginatedTrends}
              selectedId={selectedTrend?._id}
              isLoading={isLoading}
              onSelect={handleSelect}
              onGenerate={handleSelect}
            />
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
      </main>

      <TrendModal
        trend={selectedTrend}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
