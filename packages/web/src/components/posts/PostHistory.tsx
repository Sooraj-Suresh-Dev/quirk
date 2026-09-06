import { useState, useEffect } from 'react';
import { PostCard } from './PostCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { api } from '@/lib/api';
import { Post } from '@/lib/api';

export function PostHistory() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="font-serif text-warm-gray text-center py-4">No posts generated yet</p>
    );
  }

  return (
    <div className="space-y-3">
      {posts.slice(0, 5).map(post => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
