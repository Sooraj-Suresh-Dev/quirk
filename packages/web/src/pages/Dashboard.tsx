import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { PostCard } from '@/components/posts/PostCard';
import { api } from '@/lib/api';
import { Compass, FileText, Layers, Image, ArrowRight, BarChart3 } from 'lucide-react';

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

interface Post {
  _id: string;
  type: 'text' | 'carousel' | 'image-prompt';
  content: string;
  status: 'generated' | 'copied' | 'posted';
  createdAt: string;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [trends, setTrends] = useState<Trend[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendsRes, postsRes] = await Promise.all([
          api.get<{ trends: Trend[] }>('/trends'),
          api.get<{ posts: Post[] }>('/posts'),
        ]);
        setTrends(trendsRes.trends);
        setPosts(postsRes.posts);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const recentPosts = posts.slice(0, 3);
  const postsThisWeek = posts.filter(p => {
    const d = new Date(p.createdAt);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return d >= weekAgo;
  }).length;

  return (
    <DashboardLayout>
      <div className="bento-card">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 size={20} className="text-coral" />
          <h2 className="font-mono text-sm font-bold text-charcoal">POSTS THIS WEEK</h2>
        </div>
        {isLoading ? (
          <Skeleton className="h-12 w-24" />
        ) : (
          <p className="font-mono text-4xl font-bold text-coral">{postsThisWeek}</p>
        )}
        <p className="font-serif text-xs text-warm-gray mt-1">of {posts.length} total</p>
      </div>

      <div className="bento-card">
        <div className="flex items-center gap-3 mb-2">
          <Compass size={20} className="text-mint" />
          <h2 className="font-mono text-sm font-bold text-charcoal">TRENDS AVAILABLE</h2>
        </div>
        {isLoading ? (
          <Skeleton className="h-12 w-24" />
        ) : (
          <p className="font-mono text-4xl font-bold text-mint">{trends.length}</p>
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
          <button
            onClick={() => navigate('/discover')}
            className="w-full flex items-center gap-3 p-3 rounded-card border-2 border-deep-black bg-soft-white hover:bg-cream transition-all text-left group"
          >
            <Image size={18} className="text-coral" />
            <div className="flex-1">
              <p className="font-mono text-xs font-bold text-charcoal">IMAGE PROMPT</p>
              <p className="font-serif text-xs text-warm-gray">AI image prompt</p>
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
