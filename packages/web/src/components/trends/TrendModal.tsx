import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { timeAgo } from '@/lib/timeAgo';
import { ExternalLink, X, Star, GitFork, Heart, Clock, User, Sparkles, Globe, ArrowUp, MessageSquare } from 'lucide-react';
import { Trend } from '@/types/trend';
import { SOURCES } from '@/config/sources';
import { useAuth } from '@/lib/auth';
import { useAuthModal } from '@/lib/auth-modal';

interface TrendModalProps {
  trend: Trend | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TrendModal({ trend, isOpen, onClose }: TrendModalProps) {
  const { user } = useAuth();
  const { openSignup } = useAuthModal();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const modal = modalRef.current;
    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    modal.addEventListener('keydown', trap);
    return () => modal.removeEventListener('keydown', trap);
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleGenerate = () => {
    if (!user) {
      handleClose();
      setTimeout(() => {
        openSignup();
      }, 300);
      return;
    }
    const trendId = trend?._id;
    handleClose();
    setTimeout(() => {
      navigate(`/generate/${trendId}`);
    }, 300);
  };

  if (!trend) return null;
  if (!isOpen && !isClosing) return null;

  const config = SOURCES[trend.source];
  const Icon = config?.icon;

  const renderMetric = (metric: string) => {
    if (metric === 'stars' && trend.stars != null) {
      return (
        <span key="stars" className="inline-flex items-center gap-1 text-xs font-mono text-warm-gray">
          <Star size={12} className="text-coral" />
          {trend.stars.toLocaleString()} stars
        </span>
      );
    }
    if (metric === 'forks' && trend.forks != null) {
      return (
        <span key="forks" className="inline-flex items-center gap-1 text-xs font-mono text-warm-gray">
          <GitFork size={12} />
          {trend.forks.toLocaleString()} forks
        </span>
      );
    }
    if (metric === 'votes' && trend.votes != null) {
      return (
        <span key="votes" className="inline-flex items-center gap-1 text-xs font-mono text-warm-gray">
          <Heart size={12} className="text-[#DA553F]" />
          {trend.votes.toLocaleString()} votes
        </span>
      );
    }
    if (metric === 'points' && trend.points != null) {
      return (
        <span key="points" className="inline-flex items-center gap-1 text-xs font-mono text-warm-gray">
          <ArrowUp size={12} className="text-[#F5A623]" />
          {trend.points.toLocaleString()} points
        </span>
      );
    }
    if (metric === 'comments' && trend.comments != null) {
      return (
        <span key="comments" className="inline-flex items-center gap-1 text-xs font-mono text-warm-gray">
          <MessageSquare size={12} />
          {trend.comments.toLocaleString()} comments
        </span>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={`absolute -inset-12 bg-deep-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          visible && !isClosing ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="trend-modal-title"
        className={`absolute bottom-0 left-0 right-0 bg-soft-white rounded-t-card border-t-3 border-deep-black shadow-card max-h-[85vh] w-full flex flex-col transition-transform duration-300 ease-out ${
          visible && !isClosing ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-1 rounded-full bg-warm-gray" />
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="text-warm-gray hover:text-charcoal transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 min-h-[200px] md:min-h-[300px]">
              {/* Left: Thumbnail */}
              <div className="w-full md:w-2/5 shrink-0 max-h-[200px] md:max-h-[400px]">
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
                    {Icon && <Icon size={48} className="text-warm-gray" />}
                  </div>
                )}
              </div>

              {/* Right: Details */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <Badge source={trend.source} />
                </div>

                <h2 id="trend-modal-title" className="font-mono text-lg font-bold text-charcoal">{trend.title}</h2>
                <a
                    href={trend.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono text-coral hover:text-coral-hover inline-flex items-center gap-1"
                  >
                    View original <ExternalLink size={14} />
                  </a>

                <div className="flex flex-wrap items-center gap-3 mt-3">
                  {config?.metrics.map(renderMetric)}
                  {trend.source === 'producthunt' && trend.makers && trend.makers.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-warm-gray">
                      <User size={12} />
                      {trend.makers.join(', ')}
                    </span>
                  )}
                  {trend.source === 'producthunt' && trend.website && (
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
