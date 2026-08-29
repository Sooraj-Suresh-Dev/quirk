import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { timeAgo } from '@/lib/timeAgo';
import { ExternalLink, Github, Rocket, X, Star, GitFork, Heart, Clock, User, Sparkles, Globe } from 'lucide-react';

interface Trend {
  _id: string;
  source: 'github' | 'producthunt';
  title: string;
  url: string;
  summary: string;
  tags: string[];
  thumbnailUrl?: string;
  stars?: number;
  forks?: number;
  votes?: number;
  website?: string;
  makers?: string[];
  author?: string;
  createdAt?: string;
}

interface TrendModalProps {
  trend: Trend | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TrendModal({ trend, isOpen, onClose }: TrendModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => setVisible(true));
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleGenerate = () => {
    const trendId = trend?._id;
    handleClose();
    setTimeout(() => {
      window.location.href = `/generate/${trendId}`;
    }, 300);
  };

  if (!trend) return null;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={`absolute inset-0 bg-deep-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      <div
        className={`absolute bottom-0 left-0 right-0 bg-soft-white rounded-t-card border-t-3 border-deep-black shadow-card max-h-[85vh] flex flex-col transition-transform duration-300 ease-out ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-1 rounded-full bg-warm-gray" />
          </div>
          <button
            onClick={handleClose}
            className="text-warm-gray hover:text-charcoal transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
            <div className="flex gap-6 min-h-[300px]">
              {/* Left: Thumbnail */}
              <div className="w-2/5 shrink-0 max-h-[400px]">
                {trend.thumbnailUrl ? (
                  <div className="relative rounded-card overflow-hidden h-full">
                    <img
                      src={trend.thumbnailUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3">
                      <Badge source={trend.source} />
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[200px] bg-cream rounded-card flex items-center justify-center">
                    {trend.source === 'github' ? (
                      <Github size={48} className="text-warm-gray" />
                    ) : (
                      <Rocket size={48} className="text-warm-gray" />
                    )}
                  </div>
                )}
              </div>

              {/* Right: Details */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Badge source={trend.source} />
                  
                </div>

                <h2 className="font-mono text-lg font-bold text-charcoal">{trend.title}</h2>
                <br/>
                <a
                    href={trend.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono text-coral hover:text-coral-hover inline-flex items-center gap-1"
                  >
                    View original <ExternalLink size={14} />
                  </a>

                <div className="flex flex-wrap items-center gap-3 mt-3">
                  {trend.source === 'github' && (
                    <>
                      {trend.stars != null && (
                        <span className="inline-flex items-center gap-1 text-xs font-mono text-warm-gray">
                          <Star size={12} className="text-coral" />
                          {trend.stars.toLocaleString()} stars
                        </span>
                      )}
                      {trend.forks != null && (
                        <span className="inline-flex items-center gap-1 text-xs font-mono text-warm-gray">
                          <GitFork size={12} />
                          {trend.forks.toLocaleString()} forks
                        </span>
                      )}
                    </>
                  )}
                  {trend.source === 'producthunt' && (
                    <>
                      {trend.votes != null && (
                        <span className="inline-flex items-center gap-1 text-xs font-mono text-warm-gray">
                          <Heart size={12} className="text-[#DA553F]" />
                          {trend.votes.toLocaleString()} votes
                        </span>
                      )}
                      {trend.makers && trend.makers.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs font-mono text-warm-gray">
                          <User size={12} />
                          {trend.makers.join(', ')}
                        </span>
                      )}
                      {trend.website && (
                        <a
                          href={trend.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-mono text-coral hover:text-coral-hover"
                        >
                          <Globe size={12} />
                          Website
                        </a>
                      )}
                    </>
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

                <p className="font-serif text-sm text-charcoal mt-4 leading-relaxed">{trend.summary}</p>

                {trend.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {trend.tags.map(tag => (
                      <span key={tag} className="text-xs font-mono text-warm-gray bg-cream px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto pt-4 flex items-center gap-3">
                  <Button onClick={handleGenerate}>
                    <Sparkles size={16} /> GENERATE POST
                  </Button>
                  
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
