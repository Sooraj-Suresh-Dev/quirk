import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/lib/toast';
import { Post } from '@/lib/api';
import { Copy, Check, Trash2, FileText, LayoutGrid, ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onDelete?: (id: string) => void;
}

interface CarouselContent {
  caption: string;
  imagePrompts: string[];
}

const typeConfig = {
  text: { label: 'TEXT', icon: FileText, accent: 'bg-coral' },
  carousel: { label: 'CAROUSEL', icon: LayoutGrid, accent: 'bg-mint' },
  'image-prompt': { label: 'IMAGE', icon: ImageIcon, accent: 'bg-[#F5A623]' },
};

const statusConfig = {
  generated: { label: 'Generated', dot: 'bg-warm-gray' },
  copied: { label: 'Copied', dot: 'bg-coral' },
  posted: { label: 'Posted', dot: 'bg-mint' },
};

function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { toast } = useToast();

  const config = typeConfig[post.type];
  const status = statusConfig[post.status];
  const Icon = config.icon;

  const isCarousel = post.type === 'carousel' && typeof post.content !== 'string';
  const carousel = isCarousel ? (post.content as unknown as CarouselContent) : null;
  const content = typeof post.content === 'string'
    ? post.content
    : carousel?.caption || 'Carousel post';
  const isLong = content.length > 200;
  const hasPrompts = (carousel?.imagePrompts?.length ?? 0) > 0;
  const showToggle = isLong || hasPrompts;

  const handleCopy = async () => {
    try {
      const textToCopy = carousel
        ? `${carousel.caption}\n\nImage Prompts:\n${carousel.imagePrompts.map((p, i) => `${i + 1}. ${p}`).join('\n')}`
        : content;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast('success', 'Post copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast('error', 'Failed to copy — try selecting manually');
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(post._id);
      toast('success', 'Post deleted');
    }
    setConfirmDelete(false);
  };

  return (
    <>
      <Card className="p-0 overflow-hidden group" hover>
        <div className="flex items-stretch">
          <div className={`w-1.5 shrink-0 ${config.accent}`} aria-hidden="true" />
          <div className="flex-1 min-w-0 p-3 md:p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-deep-black bg-cream">
                  <Icon size={12} className="text-charcoal shrink-0" aria-hidden="true" />
                  <span className="font-mono text-[10px] font-bold text-charcoal uppercase">{config.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} aria-hidden="true" />
                  <span className="font-mono text-[10px] text-warm-gray uppercase">{status.label}</span>
                </div>
              </div>
              <span className="font-mono text-[10px] text-warm-gray shrink-0">{timeAgo(post.createdAt)}</span>
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full text-left group/content"
              aria-expanded={expanded}
              aria-label={expanded ? 'Collapse post content' : 'Expand post content'}
            >
              {expanded ? (
                <p className="font-serif text-sm text-charcoal whitespace-pre-wrap leading-snug md:leading-relaxed">{content}</p>
              ) : (
                <p className="font-serif text-sm text-charcoal line-clamp-2 leading-snug md:leading-relaxed">{content}</p>
              )}
              {expanded && carousel && carousel.imagePrompts?.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="font-mono text-[10px] font-bold text-charcoal uppercase tracking-wide">IMAGE PROMPTS</p>
                  {carousel.imagePrompts.map((prompt, i) => (
                    <div key={i} className="flex gap-2 p-2.5 rounded-card border border-deep-black/10 bg-cream/60">
                      <span className="font-mono text-[10px] text-coral font-bold shrink-0 mt-0.5">{i + 1}</span>
                      <p className="font-serif text-xs text-warm-gray leading-relaxed">{prompt}</p>
                    </div>
                  ))}
                </div>
              )}
              {showToggle && (
                <span className="inline-flex items-center gap-1 mt-1.5 font-mono text-[10px] text-coral group-hover/content:underline">
                  {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                  {expanded ? 'SHOW LESS' : (hasPrompts && !isLong ? 'VIEW PROMPTS' : 'READ MORE')}
                </span>
              )}
            </button>

            <div className="flex items-center gap-1.5 mt-2 pt-2 md:mt-3 md:pt-3 border-t border-cream">
              <Button
                variant="ghost"
                onClick={handleCopy}
                className="p-1.5 h-auto"
                aria-label={copied ? 'Copied' : 'Copy post content'}
              >
                {copied ? <Check size={14} className="text-mint" /> : <Copy size={14} />}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setConfirmDelete(true)}
                className="p-1.5 h-auto hover:text-red-500"
                aria-label="Delete post"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Modal isOpen={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <h3 className="font-mono text-lg font-bold text-charcoal mb-2">DELETE POST?</h3>
        <p className="font-serif text-sm text-warm-gray mb-6">
          This will permanently remove this post from your library. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setConfirmDelete(false)} className="flex-1">
            CANCEL
          </Button>
          <Button onClick={handleDelete} className="flex-1">
            YES, DELETE
          </Button>
        </div>
      </Modal>
    </>
  );
}
