import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { BlueprintGridBg } from '@/components/layout/BlueprintGridBg';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PostTypeSelector } from '@/components/generation/PostTypeSelector';
import { GenerationPanel } from '@/components/generation/GenerationPanel';
import { Skeleton } from '@/components/ui/Skeleton';
import { timeAgo } from '@/lib/timeAgo';
import { api } from '@/lib/api';
import { ArrowLeft, Star, Heart, Clock, User, ExternalLink, Github, Rocket } from 'lucide-react';
import { Trend } from '@/types/trend';

export function Generate() {
  const { trendId } = useParams<{ trendId: string }>();
  const navigate = useNavigate();
  const [trend, setTrend] = useState<Trend | null>(null);
  const [postType, setPostType] = useState<'text' | 'carousel' | 'image-prompt'>('text');
  const [isLoading, setIsLoading] = useState(true);
  const [globalMouse, setGlobalMouse] = useState({ x: -999, y: -999 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setGlobalMouse({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const data = await api.get<{ trend: Trend }>(`/trends/${trendId}`);
        setTrend(data.trend);
      } catch (err) {
        console.error('Failed to fetch trend:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrend();
  }, [trendId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream relative" onMouseMove={handleMouseMove}>
        <BlueprintGridBg mouse={globalMouse} />
        <div className="relative z-10">
          <Sidebar />
          <main className="ml-[60px] p-8">
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-8 w-48 mb-6" />
              <Skeleton className="h-48 mb-6" />
              <Skeleton className="h-12 mb-4 w-64" />
              <Skeleton className="h-32" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!trend) {
    return (
      <div className="min-h-screen bg-cream relative" onMouseMove={handleMouseMove}>
        <BlueprintGridBg mouse={globalMouse} />
        <div className="relative z-10">
          <Sidebar />
          <main className="ml-[60px] p-8">
            <div className="max-w-4xl mx-auto">
              <p className="font-serif text-warm-gray">Trend not found</p>
              <Button onClick={() => navigate('/discover')} className="mt-4">
                <ArrowLeft size={16} /> BACK TO TRENDS
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream relative" onMouseMove={handleMouseMove}>
      <BlueprintGridBg mouse={globalMouse} />
      <div className="relative z-10">
        <Sidebar />
        <main className="ml-[60px] p-8">
          <div className="max-w-7xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/discover')} className="mb-6 animate-slide-up">
              <ArrowLeft size={16} /> BACK TO TRENDS
            </Button>

            <Card className="mb-6 animate-slide-up" data-walkthrough="trend-preview">
              <div className="flex gap-4">
                {trend.thumbnailUrl ? (
                  <img
                    src={trend.thumbnailUrl}
                    alt=""
                    className="w-32 h-24 object-cover rounded-card border-2 border-deep-black shrink-0"
                  />
                ) : (
                  <div className="w-32 h-24 bg-cream rounded-card border-2 border-deep-black flex items-center justify-center shrink-0">
                    {trend.source === 'github' ? (
                      <Github size={24} className="text-warm-gray" />
                    ) : (
                      <Rocket size={24} className="text-warm-gray" />
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <Badge source={trend.source} />
                  <h1 className="font-mono text-lg font-bold text-charcoal mt-2 line-clamp-1">{trend.title}</h1>
                  <p className="font-serif text-sm text-warm-gray mt-1 line-clamp-2">{trend.summary}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {trend.source === 'github' && trend.stars != null && (
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-warm-gray">
                        <Star size={12} className="text-coral" />
                        {trend.stars.toLocaleString()}
                      </span>
                    )}
                    {trend.source === 'producthunt' && trend.votes != null && (
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-warm-gray">
                        <Heart size={12} className="text-[#DA553F]" />
                        {trend.votes.toLocaleString()}
                      </span>
                    )}
                    {trend.author && (
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-warm-gray">
                        <User size={12} />
                        {trend.author}
                      </span>
                    )}
                    {trend.createdAt && (
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-warm-gray">
                        <Clock size={12} />
                        {timeAgo(trend.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
                <a
                  href={trend.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-warm-gray hover:text-coral shrink-0 transition-colors duration-200"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </Card>

            <h2 className="font-mono text-xl font-bold text-charcoal mb-4 animate-slide-up stagger-1">GENERATE</h2>
            <div data-walkthrough="post-type-selector" className="animate-slide-up stagger-2">
              <PostTypeSelector selected={postType} onChange={setPostType} />
            </div>
            <div className="mt-6 animate-slide-up stagger-3" data-walkthrough="generate-action">
              <GenerationPanel trend={trend} type={postType} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
