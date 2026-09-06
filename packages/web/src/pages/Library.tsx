import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { BlueprintGridBg } from '@/components/layout/BlueprintGridBg';
import { PostCard } from '@/components/posts/PostCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input } from '@/components/ui/Input';
import { Pill } from '@/components/ui/Pill';
import { api } from '@/lib/api';
import { Search } from 'lucide-react';

interface Post {
  _id: string;
  type: 'text' | 'carousel' | 'image-prompt';
  content: string;
  status: 'generated' | 'copied' | 'posted';
  createdAt: string;
}

const typeFilters = [
  { value: 'all', label: 'ALL' },
  { value: 'text', label: 'TEXT' },
  { value: 'carousel', label: 'CAROUSEL' },
  { value: 'image-prompt', label: 'IMAGE' },
];

export function Library() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [globalMouse, setGlobalMouse] = useState({ x: -999, y: -999 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setGlobalMouse({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await api.get<{ posts: Post[] }>('/posts');
        setPosts(data.posts);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filtered = posts
    .filter(p => activeFilter === 'all' || p.type === activeFilter)
    .filter(p => {
      if (!search) return true;
      const content = typeof p.content === 'string' ? p.content : JSON.stringify(p.content);
      return content.toLowerCase().includes(search.toLowerCase());
    });

  return (
    <div className="min-h-screen bg-cream relative" onMouseMove={handleMouseMove}>
      <BlueprintGridBg mouse={globalMouse} />
      <div className="relative z-10">
        <Sidebar />
        <main className="ml-[60px] p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-mono text-3xl font-bold text-charcoal mb-2">LIBRARY</h1>
            <p className="font-serif text-warm-gray mb-6">
              All your generated content in one place
            </p>

            <div className="relative mb-6">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" />
              <Input
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {typeFilters.map(({ value, label }) => (
                <Pill
                  key={value}
                  active={activeFilter === value}
                  onClick={() => setActiveFilter(value)}
                >
                  {label}
                </Pill>
              ))}
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <>
                  <Skeleton className="h-28" />
                  <Skeleton className="h-28" />
                  <Skeleton className="h-28" />
                </>
              ) : filtered.length === 0 ? (
                <div className="text-center py-12">
                  <p className="font-serif text-warm-gray mb-2">
                    {posts.length === 0 ? 'No posts yet' : 'No posts match your search'}
                  </p>
                  {posts.length === 0 && (
                    <p className="font-serif text-sm text-warm-gray">
                      Go to Discover to find trends and generate content
                    </p>
                  )}
                </div>
              ) : (
                filtered.map(post => (
                  <PostCard key={post._id} post={post} />
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
