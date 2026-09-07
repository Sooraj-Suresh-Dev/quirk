import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface WalkthroughStep {
  id: string;
  title: string;
  content: string;
}

const PAGE_STEPS: Record<string, WalkthroughStep[]> = {
  '/dashboard': [
    { id: 'trending-now', title: 'Trending Now', content: 'See what\'s hot across your selected sources. Click any trend card to preview it.' },
    { id: 'your-voice', title: 'Your Voice', content: 'Your trained voice profile shapes how posts sound. Train or manage it here.' },
    { id: 'quick-create', title: 'Quick Create', content: 'Jump straight into generating a post with a pre-selected format.' },
  ],
  '/discover': [
    { id: 'search', title: 'Search', content: 'Search trends by keyword across all your selected sources.' },
    { id: 'trend-filters', title: 'Source Filters', content: 'Filter trends by GitHub, Product Hunt, or Hacker News.' },
    { id: 'trend-grid', title: 'Browse Trends', content: 'Click any trend card to preview it and generate a LinkedIn post.' },
  ],
  '/library': [
    { id: 'library-search', title: 'Search Posts', content: 'Find your generated posts by content or title.' },
    { id: 'sort-dropdown', title: 'Sort & Filter', content: 'Sort your posts by newest, oldest, or post type.' },
    { id: 'posts-list', title: 'Your Posts', content: 'All your generated posts live here. Click to view, edit, or copy.' },
  ],
  '/voice': [
    { id: 'voice-samples', title: 'Writing Samples', content: 'Add 2-3 samples of your writing. Quirk analyzes these to learn your voice.' },
    { id: 'voice-profile', title: 'Voice Profile', content: 'Your analyzed voice traits and tone profile. Re-train anytime to update it.' },
    { id: 'generate-cta', title: 'Start Writing', content: 'Generate a LinkedIn post in your trained voice. One click to get started.' },
  ],
  '/settings': [
    { id: 'api-keys', title: 'API Keys', content: 'Bring your own OpenAI or Anthropic key for better generation quality.' },
    { id: 'trend-sources', title: 'Trend Sources', content: 'Choose which platforms to pull trending topics from.' },
    { id: 'daily-digest', title: 'Daily Digest', content: 'Get a daily email with the top trending topics.' },
  ],
};

const GENERATE_STEPS: WalkthroughStep[] = [
  { id: 'trend-preview', title: 'Trend Preview', content: 'The trend you selected. Click the link to read the original source.' },
  { id: 'post-type-selector', title: 'Post Format', content: 'Choose between a text post, carousel, or image prompt.' },
  { id: 'generate-action', title: 'Generate', content: 'Quirk writes a LinkedIn post in your unique voice. Click to generate.' },
];

const STORAGE_KEY = 'quirk_walkthrough_completed';

function getStepsForPath(pathname: string): WalkthroughStep[] {
  if (pathname.startsWith('/generate')) return GENERATE_STEPS;
  return PAGE_STEPS[pathname] ?? [];
}

interface WalkthroughProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}

export function Walkthrough({ isOpen, onClose, pathname }: WalkthroughProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const allSteps = getStepsForPath(pathname);

  const steps = allSteps.filter(step =>
    document.querySelector(`[data-walkthrough="${step.id}"]`) !== null
  );

  const step = steps[stepIndex];

  const findTarget = useCallback(() => {
    if (!step) return null;
    const el = document.querySelector(`[data-walkthrough="${step.id}"]`);
    if (!el) return null;
    return el.getBoundingClientRect();
  }, [step]);

  useEffect(() => {
    if (!isOpen || !step) return;
    const rect = findTarget();
    setTargetRect(rect);

    const handleResize = () => {
      const r = findTarget();
      setTargetRect(r);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, findTarget, step]);

  useEffect(() => {
    if (!isOpen) setStepIndex(0);
  }, [isOpen]);

  // Lock page during walkthrough — block all interaction except tooltip
  useEffect(() => {
    if (!isOpen) return;

    const stop = (e: Event) => {
      if (tooltipRef.current?.contains(e.target as Node)) return;
      e.stopPropagation();
    };

    const blockScroll = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener('click', stop, true);
    document.addEventListener('mousedown', stop, true);
    document.addEventListener('touchstart', stop, true);
    document.addEventListener('keydown', stop, true);
    window.addEventListener('scroll', blockScroll, true);
    window.addEventListener('wheel', blockScroll, true);
    window.addEventListener('touchmove', blockScroll, true);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('click', stop, true);
      document.removeEventListener('mousedown', stop, true);
      document.removeEventListener('touchstart', stop, true);
      document.removeEventListener('keydown', stop, true);
      window.removeEventListener('scroll', blockScroll, true);
      window.removeEventListener('wheel', blockScroll, true);
      window.removeEventListener('touchmove', blockScroll, true);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  const handleComplete = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    onClose();
  };

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  if (!isOpen || steps.length === 0) return null;

  const tooltipStyle: React.CSSProperties = targetRect
    ? {
        position: 'fixed',
        top: `${Math.min(targetRect.bottom + 20, window.innerHeight - 230)}px`,
        left: `${Math.min(targetRect.left, window.innerWidth - 360)}px`,
        zIndex: 10002,
      }
    : {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10002,
      };

  return createPortal(
    <>
      {/* Click-blocker — blocks all page interaction */}
      <div className="fixed inset-0 z-[9999]" />
      {/* Dark overlay — visual only */}
      <div className="fixed inset-0 bg-deep-black/35 z-[10000] pointer-events-none" />
      {/* Cutout highlight over target */}
      {targetRect && (
        <div
          className="fixed z-[10001] rounded-lg pointer-events-none"
          style={{
            top: targetRect.top - 12,
            left: targetRect.left - 12,
            width: targetRect.width + 24,
            height: targetRect.height + 24,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.35)',
            border: '2px solid #E8725C',
          }}
        />
      )}
      {/* Tooltip card — speech bubble shape */}
      <div
        ref={tooltipRef}
        role="dialog"
        aria-label={`Walkthrough step ${stepIndex + 1} of ${steps.length}`}
        className="walkthrough-bubble bg-soft-white rounded-card border-3 border-deep-black shadow-card p-5 w-[340px]"
        style={tooltipStyle}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] font-bold text-warm-gray uppercase tracking-wider">
            Step {stepIndex + 1} of {steps.length}
          </span>
          <button
            onClick={handleComplete}
            aria-label="Close walkthrough"
            className="text-warm-gray hover:text-charcoal transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <h3 className="font-mono text-sm font-bold text-charcoal mb-1">{step.title}</h3>
        <p className="font-serif text-xs text-warm-gray leading-relaxed mb-4">{step.content}</p>
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={stepIndex === 0}
            className="px-3 py-1.5 text-xs"
          >
            <ChevronLeft size={14} /> BACK
          </Button>
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === stepIndex ? 'bg-coral' : 'bg-cream border border-deep-black'
                }`}
              />
            ))}
          </div>
          {stepIndex < steps.length - 1 ? (
            <Button onClick={handleNext} className="px-3 py-1.5 text-xs">
              NEXT <ChevronRight size={14} />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="px-3 py-1.5 text-xs">
              <Sparkles size={14} /> DONE
            </Button>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}

export function isWalkthroughCompleted(): boolean {
  return localStorage.getItem(STORAGE_KEY) === 'true';
}
