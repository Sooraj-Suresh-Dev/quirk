import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GeneratedPost } from './GeneratedPost';
import { CarouselPreview } from './CarouselPreview';
import { ModelSelector } from './ModelSelector';
import { api } from '@/lib/api';
import { useToast } from '@/lib/toast';
import { Sparkles } from 'lucide-react';

interface Trend {
  _id: string;
  title: string;
  summary: string;
  source: string;
  thumbnailUrl?: string;
  stars?: number;
  forks?: number;
  points?: number;
  comments?: number;
  author?: string;
  createdAt?: string;
}

interface GenerationPanelProps {
  trend: Trend | null;
  type: 'text' | 'carousel' | 'image-prompt';
}

export function GenerationPanel({ trend, type }: GenerationPanelProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState<any>(null);
  const [modelConfig, setModelConfig] = useState({
    provider: 'openrouter',
    model: 'meta-llama/llama-3.1-70b-instruct',
    temperature: 0.7,
    hasApiKey: true,
  });

  const handleGenerate = async () => {
    if (!trend) return;
    setIsGenerating(true);
    try {
      const result = await api.post<{ post: any; fallback?: boolean }>(
        '/posts/generate',
        {
          trendId: trend._id,
          type,
          provider: modelConfig.provider,
          model: modelConfig.model,
          temperature: modelConfig.temperature,
        }
      );
      setGenerated(result.post);
      if (result.fallback) {
        toast('info', 'Generated using fallback content. The AI provider may be unavailable — check your API key or try OpenRouter.');
      }
    } catch (err: any) {
      const message = err?.message || 'Generation failed';
      toast('error', message);
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

  const generateDisabled = !trend || (modelConfig.provider !== 'openrouter' && !modelConfig.hasApiKey);

  return (
    <div>
      <Card className="mb-4">
        <p className="font-mono text-xs text-warm-gray mb-1">SELECTED TREND</p>
        <p className="font-mono text-sm font-bold text-charcoal">{trend.title}</p>
      </Card>

      <ModelSelector onConfigChange={setModelConfig} />

      <div className="mt-4">
        <Button
          onClick={handleGenerate}
          isLoading={isGenerating}
          disabled={generateDisabled}
          className="w-full"
        >
          <Sparkles size={16} /> GENERATE {type.toUpperCase().replace('-', ' ')}
        </Button>
        {generateDisabled && (
          <p className="font-mono text-xs text-coral mt-2 text-center">
            Add your API key in Settings or switch to OpenRouter
          </p>
        )}
      </div>

      {generated && (
        <div className="mt-4">
          {type === 'carousel' ? (
            <CarouselPreview slides={generated.content} />
          ) : (
            <GeneratedPost
              content={typeof generated.content === 'string' ? generated.content : ''}
              type={type}
              postId={generated._id || ''}
            />
          )}
        </div>
      )}
    </div>
  );
}
