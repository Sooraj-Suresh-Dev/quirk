import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GeneratedPost } from './GeneratedPost';
import { CarouselPreview } from './CarouselPreview';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Sparkles } from 'lucide-react';

interface Trend {
  _id: string;
  title: string;
  summary: string;
  source: string;
}

interface GenerationPanelProps {
  trend: Trend | null;
  type: 'text' | 'carousel' | 'image-prompt';
}

export function GenerationPanel({ trend, type }: GenerationPanelProps) {
  const { token } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState<any>(null);

  const handleGenerate = async () => {
    if (!trend) return;
    setIsGenerating(true);
    try {
      const result = await api.post<{ post: any }>(
        '/posts/generate',
        { trendId: trend._id, type },
        token || undefined
      );
      setGenerated(result.post);
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!trend) {
    return (
      <Card className="text-center py-8">
        <p className="font-serif text-warm-gray">Select a trend from the left panel to generate content</p>
      </Card>
    );
  }

  return (
    <div>
      <Card className="mb-4">
        <p className="font-mono text-xs text-warm-gray mb-1">SELECTED TREND</p>
        <p className="font-mono text-sm font-bold text-charcoal">{trend.title}</p>
      </Card>

      <Button
        onClick={handleGenerate}
        isLoading={isGenerating}
        disabled={!trend}
        className="w-full"
      >
        <Sparkles size={16} /> GENERATE {type.toUpperCase().replace('-', ' ')}
      </Button>

      {generated && (
        <div className="mt-4">
          {type === 'carousel' ? (
            <CarouselPreview slides={generated.content} />
          ) : (
            <GeneratedPost content={generated.content} type={type} postId={generated._id} />
          )}
        </div>
      )}
    </div>
  );
}
