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
  slides: Slide[];
}

export function CarouselPreview({ slides }: CarouselPreviewProps) {
  const [current, setCurrent] = useState(0);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyAll = async () => {
    const text = slides.map((s, i) => `SLIDE ${i + 1}\n${s.heading}\n\n${s.body}`).join('\n\n---\n\n');
    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  if (!slides || slides.length === 0) return null;

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
        <p className="font-mono text-xs text-warm-gray mb-1">SLIDE {current + 1} / {slides.length}</p>
        <h4 className="font-mono text-sm font-bold text-charcoal mb-2">{slides[current].heading}</h4>
        <p className="font-serif text-sm text-charcoal">{slides[current].body}</p>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setCurrent(c => Math.max(0, c - 1))}
          disabled={current === 0}
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
                i === current ? 'bg-coral' : 'bg-warm-gray'
              }`}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          onClick={() => setCurrent(c => Math.min(slides.length - 1, c + 1))}
          disabled={current === slides.length - 1}
          className="p-2"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </Card>
  );
}
