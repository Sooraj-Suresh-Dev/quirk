import { useState } from 'react';
import { PreviewCard } from './PreviewCard';
import { Button } from '@/components/ui/Button';
import { Copy, ChevronLeft, ChevronRight, Wand2 } from 'lucide-react';

interface CarouselContent {
  caption: string;
  imagePrompts: string[];
}

interface CarouselPreviewProps {
  slides?: CarouselContent | string | unknown;
  onCopy?: () => void;
  onRegenerate?: () => void;
  isCopying?: boolean;
}

function parseContent(input: CarouselContent | string | unknown): CarouselContent | null {
  if (!input) return null;

  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      if (parsed.caption !== undefined && parsed.imagePrompts !== undefined) {
        return parsed as CarouselContent;
      }
    } catch {
    }
    return null;
  }

  if (typeof input === 'object' && input !== null) {
    const obj = input as unknown as CarouselContent;
    if (obj.caption !== undefined && Array.isArray(obj.imagePrompts)) {
      return obj;
    }
  }

  return null;
}

export function CarouselPreview({
  slides: rawSlides,
  onCopy,
  onRegenerate,
  isCopying,
}: CarouselPreviewProps) {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);

  const content = parseContent(rawSlides);

  if (!content) {
    return (
      <PreviewCard
        label="CAROUSEL"
        onCopy={onCopy || (() => {})}
        onRegenerate={onRegenerate || (() => {})}
        isCopying={isCopying}
      >
        <div className="text-center py-8">
          <p className="font-mono text-sm text-warm-gray">No carousel content available</p>
        </div>
      </PreviewCard>
    );
  }

  const validPrompts = content.imagePrompts.filter(Boolean);
  const currentPrompt = validPrompts[current] || '';

  const handleCopyCaption = () => {
    if (content?.caption) {
      navigator.clipboard.writeText(content.caption);
    }
    onCopy?.();
  };

  const handleCopyPrompt = async () => {
    if (currentPrompt) {
      await navigator.clipboard.writeText(currentPrompt);
      onCopy?.();
    }
  };

  return (
    <PreviewCard
      label="CAROUSEL"
      count={`${validPrompts.length} IMAGES`}
      onCopy={handleCopyCaption}
      onRegenerate={onRegenerate || (() => {})}
      isCopying={isCopying}
    >
      <div className="mb-4 p-4 bg-cream rounded-lg animate-fade-in-up">
        <p className="font-serif text-charcoal whitespace-pre-wrap text-sm leading-relaxed">
          {content.caption}
        </p>
      </div>

      {validPrompts.length > 0 ? (
        <div className="flex flex-col items-center">
          <div
            className="relative w-full max-w-md mx-auto aspect-video mb-4 rounded-lg overflow-hidden cursor-pointer bg-gradient-to-br from-coral/20 to-mint/20 transition-all duration-300 hover:shadow-card-hover"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              <div
                className={`transition-all duration-300 ${hovered ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
              >
                <Wand2 size={32} className="text-coral/60 mb-2 mx-auto" />
                <p className="font-mono text-xs text-warm-gray text-center">
                  Slide {current + 1} — Hover to reveal prompt
                </p>
              </div>

              <div
                className={`absolute inset-0 p-6 bg-deep-black/95 overflow-y-auto transition-all duration-300 flex flex-col ${
                  hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <p className="font-mono text-xs text-soft-white whitespace-pre-wrap leading-relaxed flex-1">
                  {currentPrompt}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyPrompt();
                  }}
                  className="mt-3 flex items-center justify-center gap-2 w-full py-2 rounded bg-coral/20 text-coral hover:bg-coral/30 transition-all duration-200 hover:shadow-button"
                >
                  <Copy size={14} />
                  <span className="font-mono text-xs">Copy prompt</span>
                </button>
              </div>
            </div>

            <div className="absolute top-3 right-3 bg-coral text-soft-white font-mono text-xs px-2 py-1 rounded shadow-button">
              {current + 1} / {validPrompts.length}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setCurrent(c => Math.max(0, c - 1))}
              disabled={current === 0}
              className="p-2 hover:bg-cream rounded-full"
            >
              <ChevronLeft size={20} className="text-charcoal" />
            </Button>

            <div className="flex gap-2">
              {validPrompts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-200 ${
                    i === current ? 'bg-coral scale-125 shadow-button' : 'bg-warm-gray/30 hover:bg-warm-gray/50'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              onClick={() => setCurrent(c => Math.min(validPrompts.length - 1, c + 1))}
              disabled={current === validPrompts.length - 1}
              className="p-2 hover:bg-cream rounded-full"
            >
              <ChevronRight size={20} className="text-charcoal" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-cream rounded-lg">
          <p className="font-mono text-sm text-warm-gray">No image prompts available</p>
        </div>
      )}
    </PreviewCard>
  );
}
