import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BlueprintGridBg } from '@/components/layout/BlueprintGridBg';
import { PostCard } from '@/components/posts/PostCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useToast } from '@/lib/toast';
import { Post } from '@/lib/api';
import { Search, RefreshCw, ArrowUpDown, Compass, BookOpen, ArrowUp, ChevronDown } from 'lucide-react';

const sortOptions = [
  { value: 'newest', label: 'NEWEST' },
  { value: 'oldest', label: 'OLDEST' },
  { value: 'type', label: 'TYPE' },
] as const;

export function Library() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'type'>('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [previousTotal, setPreviousTotal] = useState(0);
  const [globalMouse, setGlobalMouse] = useState({ x: -999, y: -999 });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY && currentScrollY > 1000) {
        setShowScrollTop(true);
      } else if (currentScrollY <= 1000) {
        setShowScrollTop(false);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setGlobalMouse({ x: e.clientX, y: e.clientY });
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      setError(null);
      setIsRefreshing(true);
      const data = await api.get<{ posts: Post[]; total: number; hasMore: boolean }>('/posts?limit=20&offset=0');

      if (previousTotal > 0) {
        const diff = data.total - previousTotal;
        if (diff > 0) toast('success', `${diff} new post${diff > 1 ? 's' : ''} added`);
        else toast('info', 'Library is up to date');
      }
      setPreviousTotal(data.total);
      setPosts(data.posts);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Could not load your posts. Check your connection and try again.');
      toast('error', 'Failed to refresh');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [previousTotal, toast]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const loadMore = useCallback(async () => {
    try {
      setIsLoadingMore(true);
      const data = await api.get<{ posts: Post[]; hasMore: boolean }>(`/posts?limit=20&offset=${posts.length}`);
      setPosts(prev => [...prev, ...data.posts]);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error('Failed to load more posts:', err);
      toast('error', 'Failed to load more posts');
    } finally {
      setIsLoadingMore(false);
    }
  }, [posts.length, toast]);

  const handleDelete = async (id: string) => {
    try {
      setPosts(prev => prev.filter(p => p._id !== id));
      await api.delete(`/posts/${id}`);
    } catch {
      toast('error', 'Failed to delete post');
      fetchPosts();
    }
  };

  const filtered = posts
    .filter(p => activeFilter === 'all' || p.type === activeFilter)
    .filter(p => {
      if (!search) return true;
      const text = p.type === 'carousel' && typeof p.content !== 'string'
        ? (p.content as { caption?: string }).caption || ''
        : typeof p.content === 'string' ? p.content : '';
      return text.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

  const currentSort = sortOptions.find(o => o.value === sortBy) ?? sortOptions[0];

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-cream relative" onMouseMove={handleMouseMove}>
      <BlueprintGridBg mouse={globalMouse} />
      <div className="relative z-10">
        <main className="md:ml-[60px] p-4 pb-24 md:pb-6 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-row items-center justify-between gap-3 mb-6">
              <div>
                <h1 className="font-mono text-2xl md:text-3xl font-bold text-charcoal mb-1 uppercase">LIBRARY</h1>
                <p className="font-serif text-sm text-warm-gray">
                  Every post you've generated, ready to ship.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={fetchPosts}
                  disabled={isRefreshing}
                  className="px-3 py-2"
                  aria-label="Refresh posts"
                >
                  <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                  <span className="hidden sm:inline">REFRESH</span>
                </Button>
              </div>
            </div>

            <div className="flex flex-row gap-2 md:gap-3 mb-6">
              <div className="relative flex-1 min-w-0" data-walkthrough="library-search">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray" aria-hidden="true" />
                <label htmlFor="library-search" className="sr-only">Search posts</label>
                <Input
                  id="library-search"
                  placeholder="Search your posts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 md:pl-12"
                />
              </div>
              <div className="flex items-center gap-2" ref={sortRef} data-walkthrough={posts.length > 0 ? "sort-dropdown" : undefined}>
                <ArrowUpDown size={14} className="text-warm-gray shrink-0" aria-hidden="true" />
                <div className="relative">
                  <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    aria-expanded={isSortOpen}
                    aria-haspopup="listbox"
                    aria-label={`Sort by ${currentSort.label}`}
                    className="bg-soft-white text-charcoal font-mono text-xs md:text-sm px-2 py-1.5 md:px-3 md:py-2 rounded-button border-2 border-deep-black shadow-input hover:shadow-button-hover focus:border-coral focus:outline-none transition-all duration-150 cursor-pointer flex items-center gap-2 min-w-[100px] md:min-w-[120px] justify-between"
                  >
                    <span>{currentSort.label}</span>
                    <ChevronDown size={14} className={`text-warm-gray transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isSortOpen && (
                    <div className="absolute z-20 top-full right-0 mt-1 bg-soft-white rounded-card border-3 border-deep-black shadow-card overflow-hidden min-w-[140px]">
                      {sortOptions.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => { setSortBy(opt.value); setIsSortOpen(false); }}
                          role="option"
                          aria-selected={sortBy === opt.value}
                          className={`w-full px-4 py-2.5 font-mono text-sm text-left transition-all duration-100 cursor-pointer ${
                            sortBy === opt.value ? 'bg-coral text-soft-white' : 'text-charcoal hover:bg-cream'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>


            <div id="post-list" role="tabpanel" className="space-y-2 md:space-y-3" data-walkthrough={posts.length > 0 ? "posts-list" : undefined}>
              {isLoading ? (
                <>
                  <Skeleton className="h-28" />
                  <Skeleton className="h-28" />
                  <Skeleton className="h-28" />
                </>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="font-mono text-sm font-bold text-charcoal mb-2">SOMETHING WENT WRONG</p>
                  <p className="font-serif text-sm text-warm-gray mb-4">{error}</p>
                  <Button onClick={fetchPosts}>
                    <RefreshCw size={14} /> TRY AGAIN
                  </Button>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-12">
                  {posts.length === 0 ? (
                    <>
                      <div className="w-16 h-16 rounded-full border-3 border-deep-black bg-cream flex items-center justify-center mx-auto mb-4">
                        <BookOpen size={24} className="text-warm-gray" />
                      </div>
                      <p className="font-mono text-sm font-bold text-charcoal mb-2">YOUR LIBRARY IS EMPTY</p>
                      <p className="font-serif text-sm text-warm-gray mb-4 max-w-sm mx-auto">
                        Every post you generate lives here. Pick a trending topic and create your first one.
                      </p>
                      <div className="flex items-center justify-center gap-6 mb-5">
                        {['TREND', 'FORMAT', 'POST'].map((step, i) => (
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
                    </>
                  ) : (
                    <>
                      <p className="font-mono text-sm font-bold text-charcoal mb-2">NO MATCHES</p>
                      <p className="font-serif text-sm text-warm-gray mb-3">
                        Nothing matches "{search}". Try a different search or clear your filters.
                      </p>
                      <Button variant="secondary" onClick={() => { setSearch(''); setActiveFilter('all'); }}>
                        CLEAR FILTERS
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <>
                  {filtered.map(post => (
                    <PostCard key={post._id} post={post} onDelete={handleDelete} />
                  ))}
                  {hasMore && (
                    <div className="text-center pt-2">
                      <Button variant="secondary" onClick={loadMore} disabled={isLoadingMore}>
                        {isLoadingMore ? 'LOADING...' : 'LOAD MORE'}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-10 h-10 rounded-full bg-coral text-soft-white shadow-button border-2 border-deep-black flex items-center justify-center hover:shadow-button-hover active:shadow-button-active transition-all duration-150 cursor-pointer z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
    </DashboardLayout>
  );
}
