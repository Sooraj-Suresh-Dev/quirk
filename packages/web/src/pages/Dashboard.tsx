import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TrendCard } from '@/components/trends/TrendCard';
import { TrendFilters } from '@/components/trends/TrendFilters';
import { PostTypeSelector } from '@/components/generation/PostTypeSelector';
import { GenerationPanel } from '@/components/generation/GenerationPanel';
import { PostHistory } from '@/components/posts/PostHistory';
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

export function Dashboard() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [postType, setPostType] = useState<'text' | 'carousel' | 'image-prompt'>('text');
  const [activeFilter, setActiveFilter] = useState<string>('all');
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

  const filteredTrends = activeFilter === 'all'
    ? trends
    : trends.filter(t => t.source === activeFilter);

  const leftPanel = (
    <div>
      <h2 className="font-mono text-xl font-bold text-charcoal mb-4">TRENDING</h2>
      <TrendFilters active={activeFilter} onChange={setActiveFilter} />
      <div className="mt-4 space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : filteredTrends.length === 0 ? (
          <p className="font-serif text-warm-gray text-center py-8">No trends found</p>
        ) : (
          filteredTrends.map(trend => (
            <TrendCard
              key={trend._id}
              trend={trend}
              selected={selectedTrend?._id === trend._id}
              onClick={() => setSelectedTrend(trend)}
            />
          ))
        )}
      </div>
    </div>
  );

  const rightPanel = (
    <div>
      <h2 className="font-mono text-xl font-bold text-charcoal mb-4">GENERATE</h2>
      <PostTypeSelector selected={postType} onChange={setPostType} />
      <div className="mt-6">
        <GenerationPanel
          trend={selectedTrend}
          type={postType}
        />
      </div>
      <div className="mt-8">
        <h3 className="font-mono text-lg font-bold text-charcoal mb-4">RECENT POSTS</h3>
        <PostHistory />
      </div>
    </div>
  );

  return <DashboardLayout leftPanel={leftPanel} rightPanel={rightPanel} />;
}
