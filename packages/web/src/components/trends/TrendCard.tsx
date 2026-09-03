import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { timeAgo } from '@/lib/timeAgo';
import { ExternalLink, Heart, Sparkles, Star, Clock, ArrowUp } from 'lucide-react';
import { Trend } from '@/types/trend';
import { SOURCES } from '@/config/sources';

interface TrendCardProps {
  trend: Trend;
  selected?: boolean;
  onClick?: () => void;
  onBookmark?: (trend: Trend) => void;
  onGenerate?: (trend: Trend) => void;
}

export function TrendCard({ trend, selected, onClick, onBookmark, onGenerate }: TrendCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [bookmarked, setBookmarked] = useState(() => {
    try {
      const saved = localStorage.getItem('bookmarkedTrends');
      return saved ? JSON.parse(saved).includes(trend._id) : false;
    } catch {
      return false;
    }
  });

  const config = SOURCES[trend.source];
  const Icon = config?.icon;

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const saved = JSON.parse(localStorage.getItem('bookmarkedTrends') || '[]');
      const next = bookmarked
        ? saved.filter((id: string) => id !== trend._id)
        : [...saved, trend._id];
      localStorage.setItem('bookmarkedTrends', JSON.stringify(next));
    } catch {
      // ignore
    }
    setBookmarked(!bookmarked);
    onBookmark?.(trend);
  };

  const handleGenerate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onGenerate?.(trend);
  };

  const renderMetric = (metric: string) => {
    if (metric === 'stars' && trend.stars != null) {
      return (
        <span key="stars" className="inline-flex items-center gap-0.5 text-xs font-mono text-warm-gray">
          <Star size={10} className="text-coral" />
          {trend.stars >= 1000 ? `${(trend.stars / 1000).toFixed(1)}k` : trend.stars}
        </span>
      );
    }
    if (metric === 'votes' && trend.votes != null) {
      return (
        <span key="votes" className="inline-flex items-center gap-0.5 text-xs font-mono text-warm-gray">
          <Heart size={10} className="text-[#DA553F]" />
          {trend.votes}
        </span>
      );
    }
    if (metric === 'points' && trend.points != null) {
      return (
        <span key="points" className="inline-flex items-center gap-0.5 text-xs font-mono text-warm-gray">
          <ArrowUp size={10} className="text-[#F5A623]" />
          {trend.points}
        </span>
      );
    }
    return null;
  };

  return (
    <div
      className={`bg-soft-white rounded-card border-3 border-deep-black shadow-card overflow-hidden transition-all duration-150 hover:shadow-card-hover cursor-pointer ${
        selected ? 'ring-2 ring-coral shadow-card-hover' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative">
        {trend.thumbnailUrl && !imageError ? (
          <div className="relative bg-cream">
            {imageLoading && <Skeleton variant="image" className="absolute inset-0" />}
            <img
              src={trend.thumbnailUrl}
              alt=""
              className={`w-full aspect-[3/1] object-cover transition-opacity duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              loading="lazy"
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                setImageError(true);
              }}
            />
            {Icon && (
              <div className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-soft-white border-2 border-deep-black flex items-center justify-center">
                <Icon size={14} />
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-[3/1] bg-cream flex items-center justify-center">
            {Icon && <Icon size={20} className="text-warm-gray" />}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge source={trend.source} />
          {config?.metrics.map(renderMetric)}
          {trend.createdAt && (
            <span className="inline-flex items-center gap-0.5 text-xs font-mono text-warm-gray ml-auto">
              <Clock size={10} />
              {timeAgo(trend.createdAt)}
            </span>
          )}
        </div>
        <h3 className="font-mono text-sm font-bold text-charcoal line-clamp-2">{trend.title}</h3>
        <p className="font-serif text-sm text-warm-gray mt-1 line-clamp-2">{trend.summary}</p>
        {trend.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {trend.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs font-mono text-warm-gray bg-cream px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-cream">
          <div className="flex gap-1">
            <Button variant="ghost" className="p-1.5" onClick={toggleBookmark}>
              <Heart size={14} className={bookmarked ? 'fill-coral text-coral' : ''} />
            </Button>
            <Button variant="ghost" className="p-1.5" onClick={handleGenerate}>
              <Sparkles size={14} />
            </Button>
          </div>
          <a
            href={trend.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-warm-gray hover:text-coral"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
