import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  heading: string;
  body: string;
  imagePrompt: string;
}

interface CarouselPreviewProps {
  slides: Slide[] | string | unknown;
}

function normalizeSlides(input: Slide[] | string | unknown): Slide[] {
  if (!input) return [];

  // If it's a string, try to parse it
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed as Slide[];
      return [];
    } catch {
      return [];
    }
  }

  // If it's already an array, use it
  if (Array.isArray(input)) {
    return input as Slide[];
  }

  return [];
}

export function CarouselPreview({ slides: rawSlides }: CarouselPreviewProps) {
  const [current, setCurrent] = useState(0);
  const [copiedAll, setCopiedAll] = useState(false);

  const slides = normalizeSlides(rawSlides);

  const handleCopyAll = async () => {
    const text = slides.map((s, i) => `SLIDE ${i + 1}\n${s.heading}\n\n${s.body}`).join('\n\n---\n\n');
    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  if (slides.length === 0) return null;

  const safeIndex = Math.min(current, slides.length - 1);
  const slide = slides[safeIndex];

  if (!slide) return null;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-xs text-warm-gray">CAROUSEL ({slides.length} SLIDES)</p>
        <Button variant="ghost" onClick={handleCopyAll} className="text-xs">
          {copiedAll ? <Check size={14} /> : <Copy size={14} />}
          {copiedAll ? 'COPIED' : 'COPY ALL'}
        </Button>
      </div>

      <div className="bg-cream rounded-card p-4 mb-4">
        <p className="font-mono text-xs text-warm-gray mb-1">SLIDE {safeIndex + 1} / {slides.length}</p>
        <h4 className="font-mono text-sm font-bold text-charcoal mb-2">{slide.heading || 'Untitled'}</h4>
        <p className="font-serif text-sm text-charcoal">{slide.body || ''}</p>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setCurrent(c => Math.max(0, c - 1))}
          disabled={safeIndex === 0}
          className="p-2"
        >
          <ChevronLeft size={16} />
        </Button>

        <div className="flex gap-1">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === safeIndex ? 'bg-coral' : 'bg-warm-gray'
              }`}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          onClick={() => setCurrent(c => Math.min(slides.length - 1, c + 1))}
          disabled={safeIndex === slides.length - 1}
          className="p-2"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </Card>
  );
}
