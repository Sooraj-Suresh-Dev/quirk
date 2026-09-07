import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { PostCard } from '@/components/posts/PostCard';
import { TrendModal } from '@/components/trends/TrendModal';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Compass, Flame, Layers, ArrowRight, TrendingUp, Mic, BarChart3, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Trend } from '@/types/trend';
import { Post } from '@/lib/api';

export function Dashboard() {
  const navigate = useNavigate();
  const { user, voice } = useAuth();
  const [topTrends, setTopTrends] = useState<Trend[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsTotal, setPostsTotal] = useState(0);
  const [postsThisWeek, setPostsThisWeek] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleTrendSelect = (trend: Trend) => {
    setSelectedTrend(trend);
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sources = user?.preferences?.sources;
        const sourceParam = sources?.length ? `?source=${sources.join(',')}` : '';
        const [trendsRes, postsRes] = await Promise.all([
          api.get<{ trends: Trend[]; total: number }>(`/trends${sourceParam}`),
          api.get<{ posts: Post[]; total: number; thisWeek: number }>('/posts'),
        ]);
        setTopTrends(trendsRes.trends.slice(0, 2));
        setPosts(postsRes.posts);
        setPostsTotal(postsRes.total);
        setPostsThisWeek(postsRes.thisWeek);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user?.preferences?.sources]);

  const recentPosts = posts.slice(0, 3);

  return (
    <DashboardLayout>
      <div className="bento-card col-span-2 flex flex-col justify-between" data-walkthrough="trending-now">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-coral" />
            <h2 className="font-mono text-sm font-bold text-charcoal uppercase tracking-wide">TRENDING NOW</h2>
          </div>
          <button
            onClick={() => navigate('/discover')}
            className="font-mono text-xs font-bold text-coral hover:underline"
          >
            VIEW ALL
          </button>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 flex-1">
            <Skeleton className="h-full min-h-[140px]" />
            <Skeleton className="h-full min-h-[140px]" />
          </div>
        ) : topTrends.length === 0 ? (
          <p className="font-serif text-sm text-warm-gray">No trends available yet</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 flex-1">
            {topTrends.map(trend => (
              <button
                key={trend._id}
                onClick={() => handleTrendSelect(trend)}
                className="text-left p-3.5 rounded-card border-2 border-deep-black bg-cream hover:bg-soft-white transition-all group flex flex-col justify-between h-full"
              >
                <div>
                  {trend.thumbnailUrl ? (
                    <img src={trend.thumbnailUrl} alt="" className="w-full h-24 object-cover rounded mb-2.5" />
                  ) : (
                    <div className="w-full h-24 bg-soft-white rounded mb-2.5 flex items-center justify-center">
                      <TrendingUp size={24} className="text-warm-gray" />
                    </div>
                  )}
                  <div className="mb-2">
                    <Badge source={trend.source} />
                  </div>
                  <h3 className="font-mono text-xs font-bold text-charcoal line-clamp-1 mb-1">{trend.title}</h3>
                  {trend.summary && (
                    <p className="font-serif text-xs text-warm-gray line-clamp-2 leading-relaxed">{trend.summary}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bento-card flex flex-col justify-between" data-walkthrough="your-voice">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Mic size={18} className="text-mint" />
              <h2 className="font-mono text-xs font-bold text-charcoal uppercase tracking-wide">YOUR VOICE</h2>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-deep-black bg-cream">
              <span className={`w-2 h-2 rounded-full ${voice?.isActive ? 'bg-mint animate-pulse' : 'bg-warm-gray'}`} />
              <span className="font-mono text-[10px] font-bold text-charcoal uppercase">
                {voice ? (voice.isActive ? 'ACTIVE' : 'INACTIVE') : 'UNSET'}
              </span>
            </div>
          </div>

          {!voice ? (
            <div className="p-3 rounded-card border-2 border-deep-black bg-cream my-2">
              <p className="font-mono text-xs font-bold text-charcoal mb-1">NOT TRAINED YET</p>
              <p className="font-serif text-xs text-warm-gray leading-relaxed">
                Analyze your writing sample to generate posts in your unique voice and tone.
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-card border-2 border-deep-black bg-cream my-2 space-y-2">
              <div>
                <span className="font-mono text-[10px] font-bold text-warm-gray uppercase block">PRIMARY TONE</span>
                <span className="font-mono text-sm font-bold text-coral capitalize">
                  {voice.profile?.tone?.primary || 'Trained Profile'}
                </span>
              </div>

              {voice.profile?.tone?.secondary && voice.profile.tone.secondary.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {voice.profile.tone.secondary.slice(0, 3).map((trait, idx) => (
                    <span key={idx} className="font-mono text-[10px] bg-soft-white border border-deep-black px-1.5 py-0.5 rounded text-charcoal">
                      {trait}
                    </span>
                  ))}
                </div>
              )}

              {voice.samples && (
                <div className="pt-1 border-t border-deep-black/10 flex items-center justify-between text-[10px] font-mono text-warm-gray">
                  <span>SAMPLES</span>
                  <span className="font-bold text-charcoal">{voice.samples.length} analyzed</span>
                </div>
              )}
            </div>
          )}
        </div>

        <Button
          onClick={() => navigate('/voice-training')}
          className="w-full mt-3"
          variant={voice ? 'secondary' : 'primary'}
        >
          {voice ? (
            <>
              <SlidersHorizontal size={14} /> MANAGE VOICE
            </>
          ) : (
            <>
              <Sparkles size={14} /> TRAIN VOICE
            </>
          )}
        </Button>
      </div>

      <div className="bento-card-wide">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-mono text-sm font-bold text-charcoal">RECENT POSTS</h2>
          <button
            onClick={() => navigate('/library')}
            className="font-mono text-xs text-coral hover:underline"
          >
            VIEW ALL
          </button>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        ) : recentPosts.length === 0 ? (
          <div className="text-center py-8">
            <p className="font-mono text-sm font-bold text-charcoal mb-2">YOUR FIRST POST IS ONE TREND AWAY</p>
            <p className="font-serif text-xs text-warm-gray mb-4">
              Pick a trending topic, choose your format, and generate in your voice.
            </p>
            <div className="flex items-center justify-center gap-6 mb-4">
              {['TREND', 'FORMAT', 'VOICE'].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full border-2 border-deep-black bg-coral text-soft-white font-mono text-xs flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="font-mono text-xs text-charcoal">{step}</span>
                </div>
              ))}
            </div>
            <Button onClick={() => navigate('/discover')}>
              <Compass size={14} /> VIEW TRENDS
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentPosts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="bento-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-coral" />
              <h2 className="font-mono text-xs font-bold text-charcoal uppercase tracking-wide">POST STATS</h2>
            </div>
            <span className="font-mono text-[10px] text-warm-gray uppercase tracking-wider">OVERVIEW</span>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-card border-2 border-deep-black bg-cream">
              <span className="font-mono text-[10px] font-bold text-warm-gray uppercase block mb-1">THIS WEEK</span>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-3xl font-bold text-coral">{postsThisWeek}</span>
                  <span className="font-mono text-[10px] text-warm-gray">posts</span>
                </div>
              )}
            </div>
            <div className="p-3 rounded-card border-2 border-deep-black bg-cream">
              <span className="font-mono text-[10px] font-bold text-warm-gray uppercase block mb-1">TOTAL</span>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-3xl font-bold text-charcoal">{postsTotal}</span>
                  <span className="font-mono text-[10px] text-warm-gray">posts</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bento-card" data-walkthrough="quick-create">
          <h2 className="font-mono text-sm font-bold text-charcoal mb-2">QUICK CREATE</h2>
          <p className="font-serif text-xs text-warm-gray mb-4">
            Pick a format and jump straight to Discover.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/discover')}
              className="w-full flex items-center gap-3 p-2.5 rounded-card border-2 border-deep-black bg-soft-white hover:bg-cream transition-all text-left group"
            >
              <Flame size={16} className="text-coral" />
              <div className="flex-1">
                <p className="font-mono text-xs font-bold text-charcoal">HOT TAKE</p>
                <p className="font-serif text-[11px] text-warm-gray">Quick insight, strong opinion</p>
              </div>
              <ArrowRight size={12} className="text-warm-gray group-hover:text-coral transition-colors" />
            </button>
            <button
              onClick={() => navigate('/discover')}
              className="w-full flex items-center gap-3 p-2.5 rounded-card border-2 border-deep-black bg-soft-white hover:bg-cream transition-all text-left group"
            >
              <Layers size={16} className="text-coral" />
              <div className="flex-1">
                <p className="font-mono text-xs font-bold text-charcoal">DEEP DIVE</p>
                <p className="font-serif text-[11px] text-warm-gray">Step-by-step breakdown</p>
              </div>
              <ArrowRight size={12} className="text-warm-gray group-hover:text-coral transition-colors" />
            </button>
          </div>
          <Button
            onClick={() => navigate('/discover')}
            className="w-full mt-3"
          >
            <Compass size={14} /> GO TO TRENDS
          </Button>
        </div>
      </div>

      <TrendModal
        trend={selectedTrend}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </DashboardLayout>
  );
}
