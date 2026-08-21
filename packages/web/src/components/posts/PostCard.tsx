import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Copy, Check, Trash2 } from 'lucide-react';

interface Post {
  _id: string;
  type: 'text' | 'carousel' | 'image-prompt';
  content: string;
  status: 'generated' | 'copied' | 'posted';
  createdAt: string;
}

interface PostCardProps {
  post: Post;
}

const typeLabels = {
  text: 'TEXT',
  carousel: 'CAROUSEL',
  'image-prompt': 'IMAGE',
};

const statusColors = {
  generated: 'text-warm-gray',
  copied: 'text-coral',
  posted: 'text-mint',
};

export function PostCard({ post }: PostCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const content = typeof post.content === 'string' ? post.content : JSON.stringify(post.content);
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-charcoal">
              {typeLabels[post.type]}
            </span>
            <span className={`font-mono text-xs capitalize ${statusColors[post.status]}`}>
              {post.status}
            </span>
          </div>
          <p className="font-serif text-sm text-charcoal line-clamp-2">
            {typeof post.content === 'string' ? post.content : 'Carousel post'}
          </p>
          <p className="font-mono text-xs text-warm-gray mt-1">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-1 shrink-0">
          <Button variant="ghost" onClick={handleCopy} className="p-1.5">
            {copied ? <Check size={14} className="text-mint" /> : <Copy size={14} />}
          </Button>
          <Button variant="ghost" className="p-1.5">
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
