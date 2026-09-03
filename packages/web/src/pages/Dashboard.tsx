import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { PostCard } from '@/components/posts/PostCard';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Compass, FileText, Layers, ArrowRight, BarChart3 } from 'lucide-react';
import { Trend } from '@/types/trend';

interface Post {
  _id: string;
  type: 'text' | 'carousel' | 'image-prompt';
  content: string;
  status: 'generated' | 'copied' | 'posted';
  createdAt: string;
}

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trendsTotal, setTrendsTotal] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsTotal, setPostsTotal] = useState(0);
  const [postsThisWeek, setPostsThisWeek] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sources = user?.preferences?.sources;
        const sourceParam = sources?.length ? `?source=${sources.join(',')}` : '';
        const [trendsRes, postsRes] = await Promise.all([
          api.get<{ trends: Trend[]; total: number }>(`/trends${sourceParam}`),
          api.get<{ posts: Post[]; total: number; thisWeek: number }>('/posts'),
        ]);
        setTrendsTotal(trendsRes.total);
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
      <div className="bento-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-coral" />
            <h2 className="font-mono text-xs font-bold text-charcoal uppercase tracking-wide">POSTS THIS WEEK</h2>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-coral" />
            <h2 className="font-mono text-xs font-bold text-charcoal uppercase tracking-wide">TOTAL</h2>
          </div>
        </div>
        <div className="border-t border-warm-gray/20 mb-4" />
        <div className="flex items-center justify-between">
          {isLoading ? (
            <Skeleton className="h-14 w-20" />
          ) : (
            <p className="font-mono text-5xl font-bold text-coral">{postsThisWeek}</p>
          )}
          <div className="border-l border-warm-gray/20 h-14 mx-4" />
          {isLoading ? (
            <Skeleton className="h-14 w-20" />
          ) : (
            <p className="font-mono text-5xl font-bold text-coral">{postsTotal}</p>
          )}
        </div>
      </div>

      <div className="bento-card">
        <div className="flex items-center gap-3 mb-2">
          <Compass size={20} className="text-mint" />
          <h2 className="font-mono text-sm font-bold text-charcoal">TRENDS AVAILABLE</h2>
        </div>
        {isLoading ? (
          <Skeleton className="h-12 w-24" />
        ) : (
          <p className="font-mono text-4xl font-bold text-mint">{trendsTotal}</p>
        )}
        <p className="font-serif text-xs text-warm-gray mt-1">across all sources</p>
      </div>

      <div className="bento-card row-span-2">
        <h2 className="font-mono text-sm font-bold text-charcoal mb-4">QUICK CREATE</h2>
        <p className="font-serif text-sm text-warm-gray mb-6">
          Pick a format and jump straight to Discover to find a trend.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/discover')}
            className="w-full flex items-center gap-3 p-3 rounded-card border-2 border-deep-black bg-soft-white hover:bg-cream transition-all text-left group"
          >
            <FileText size={18} className="text-coral" />
            <div className="flex-1">
              <p className="font-mono text-xs font-bold text-charcoal">TEXT POST</p>
              <p className="font-serif text-xs text-warm-gray">Hook + body + CTA</p>
            </div>
            <ArrowRight size={14} className="text-warm-gray group-hover:text-coral transition-colors" />
          </button>
          <button
            onClick={() => navigate('/discover')}
            className="w-full flex items-center gap-3 p-3 rounded-card border-2 border-deep-black bg-soft-white hover:bg-cream transition-all text-left group"
          >
            <Layers size={18} className="text-coral" />
            <div className="flex-1">
              <p className="font-mono text-xs font-bold text-charcoal">CAROUSEL</p>
              <p className="font-serif text-xs text-warm-gray">5-slide framework</p>
            </div>
            <ArrowRight size={14} className="text-warm-gray group-hover:text-coral transition-colors" />
          </button>
        </div>
        <Button
          onClick={() => navigate('/discover')}
          className="w-full mt-4"
        >
          <Compass size={16} /> GO TO DISCOVER
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
                <p className="font-serif text-warm-gray mb-3">No posts yet</p>
                <Button onClick={() => navigate('/discover')}>
                  <Compass size={14} /> DISCOVER TRENDS
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

      <div className="bento-card">
        <h2 className="font-mono text-sm font-bold text-charcoal mb-4">ACTIVITY</h2>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
          </div>
        ) : posts.length === 0 ? (
          <p className="font-serif text-sm text-warm-gray text-center py-4">
            Your activity will appear here
          </p>
        ) : (
          <div className="space-y-3">
            {posts.slice(0, 4).map(post => (
              <div key={post._id} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  post.status === 'posted' ? 'bg-mint' :
                  post.status === 'copied' ? 'bg-coral' : 'bg-warm-gray'
                }`} />
                <p className="font-serif text-xs text-charcoal truncate flex-1">
                  {typeof post.content === 'string' ? post.content.slice(0, 40) : 'Carousel post'}...
                </p>
                <span className="font-mono text-xs text-warm-gray">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
