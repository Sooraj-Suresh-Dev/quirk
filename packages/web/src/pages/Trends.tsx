import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TrendCard } from '@/components/trends/TrendCard';
import { TrendFilters } from '@/components/trends/TrendFilters';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Search } from 'lucide-react';

interface Trend {
  _id: string;
  source: 'github' | 'hackernews';
  title: string;
  url: string;
  summary: string;
  tags: string[];
}

export function Trends() {
  const { token } = useAuth();
  const [trends, setTrends] = useState<Trend[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const data = await api.get<{ trends: Trend[] }>('/trends', token || undefined);
        setTrends(data.trends);
      } catch (err) {
        console.error('Failed to fetch trends:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrends();
  }, [token]);

  const filtered = trends
    .filter(t => activeFilter === 'all' || t.source === activeFilter)
    .filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    );

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

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading ? (
              <>
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
              </>
            ) : filtered.length === 0 ? (
              <p className="font-serif text-warm-gray text-center py-8 col-span-2">
                No trends found
              </p>
            ) : (
              filtered.map(trend => (
                <TrendCard key={trend._id} trend={trend} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
