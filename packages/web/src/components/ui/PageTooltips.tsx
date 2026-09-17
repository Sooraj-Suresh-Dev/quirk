import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useFloating, offset, flip, shift, autoUpdate, arrow } from '@floating-ui/react';

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
  '/voice-training': [
    { id: 'voice-samples', title: 'Writing Samples', content: 'Add 2-3 samples of your writing. Quirk analyzes these to learn your voice.' },
    { id: 'analyze-button', title: 'Analyze Voice', content: 'Click to analyze your samples and generate a voice profile.' },
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

function getStepsForPath(pathname: string): WalkthroughStep[] {
  if (pathname.startsWith('/generate')) return GENERATE_STEPS;
  return PAGE_STEPS[pathname] ?? [];
}

interface PageTooltipsProps {
  pathname: string;
  forceShow: boolean;
  onDismiss: () => void;
}

export function PageTooltips({ pathname, forceShow, onDismiss }: PageTooltipsProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const arrowRef = useRef<HTMLDivElement>(null);
  const [targetFound, setTargetFound] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const allSteps = getStepsForPath(pathname);

  const steps = allSteps.filter(step =>
    document.querySelector(`[data-walkthrough="${step.id}"]`) !== null
  );

  const step = steps[stepIndex];

  const { refs, floatingStyles, middlewareData, placement } = useFloating({
    placement: 'bottom',
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(16),
      flip({ fallbackPlacements: ['top', 'right', 'left'] }),
      shift({ padding: { top: 16, bottom: isMobile ? 80 : 16, left: 16, right: 16 } }),
      arrow({ element: arrowRef }),
    ],
  });

  // Track target position
  useEffect(() => {
    if (!visible || !step) {
      refs.setPositionReference(null);
      setTargetFound(false);
      return;
    }
    
    const checkEl = () => {
      const el = document.querySelector(`[data-walkthrough="${step.id}"]`);
      if (el) {
        refs.setPositionReference(el);
        setTargetFound(true);
      } else {
        refs.setPositionReference(null);
        setTargetFound(false);
      }
    };
    
    checkEl();
    const timeout = setTimeout(checkEl, 100);
    return () => clearTimeout(timeout);
  }, [visible, step, refs]);

  // Show/hide based on forceShow (help button)
  useEffect(() => {
    if (forceShow) {
      setStepIndex(0);
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [forceShow]);

  // Reset step index when visibility changes
  useEffect(() => {
    if (visible) setStepIndex(0);
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
    onDismiss();
  };

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      dismiss();
    }
  };

  if (!visible || steps.length === 0 || !step) return null;

  const placementSide = placement.split('-')[0];
  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[placementSide] as string;

  const arrowBorderClass = {
    top: 'border-b-3 border-r-3',
    right: 'border-b-3 border-l-3',
    bottom: 'border-t-3 border-l-3',
    left: 'border-t-3 border-r-3',
  }[placementSide] || 'border-t-3 border-l-3';

  const arrowX = middlewareData.arrow?.x;
  const arrowY = middlewareData.arrow?.y;

  const finalStyle: React.CSSProperties = targetFound
    ? { ...floatingStyles, zIndex: 40 }
    : {
        position: 'fixed',
        top: isMobile ? '40%' : '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 40,
      };

  return createPortal(
    <div
      ref={refs.setFloating}
      role="tooltip"
      aria-label={`Step ${stepIndex + 1} of ${steps.length}`}
      className="bg-charcoal rounded-card border-3 border-deep-black shadow-card p-4 w-[calc(100vw-2rem)] max-w-[300px]"
      style={finalStyle}
    >
      {/* Arrow pointing at target */}
      {targetFound && (
        <div
          ref={arrowRef}
          className={`absolute w-4 h-4 bg-charcoal border-deep-black rotate-45 pointer-events-none ${arrowBorderClass}`}
          style={{ 
            left: arrowX != null ? `${arrowX}px` : '', 
            top: arrowY != null ? `${arrowY}px` : '',
            right: '',
            bottom: '',
            [staticSide]: '-7px',
          }}
        />
      )}

      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] font-bold text-soft-white/70 uppercase tracking-wider">
          Step {stepIndex + 1} of {steps.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={dismiss}
            className="font-mono text-[10px] font-bold text-soft-white/70 hover:text-soft-white uppercase tracking-wider transition-colors"
          >
            Skip all
          </button>
          <button
            onClick={dismiss}
            aria-label="Dismiss tooltips"
            className="text-soft-white/70 hover:text-soft-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <h3 className="font-mono text-sm font-bold text-soft-white mb-1">{step.title}</h3>
      <p className="font-serif text-xs text-soft-white/80 leading-relaxed mb-3">{step.content}</p>

      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === stepIndex ? 'bg-soft-white' : 'bg-soft-white/30 border border-soft-white/50'
              }`}
            />
          ))}
        </div>
        <Button onClick={handleNext} className="px-3 py-1 text-xs">
          {stepIndex < steps.length - 1 ? (
            <>NEXT <ChevronRight size={12} /></>
          ) : (
            <><Sparkles size={12} /> DONE</>
          )}
        </Button>
      </div>
    </div>,
    document.body
  );
}
