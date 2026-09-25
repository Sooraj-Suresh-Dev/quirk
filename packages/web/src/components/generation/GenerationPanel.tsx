import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GeneratedPost } from './GeneratedPost';
import { CarouselPreview } from './CarouselPreview';
import { ModelSelector } from './ModelSelector';
import { api } from '@/lib/api';
import { useToast } from '@/lib/toast';
import { useAuth } from '@/lib/auth';
import { Sparkles, Mic, Loader2 } from 'lucide-react';
import { Trend } from '@/types/trend';

const GENERATING_MESSAGES = [
  'Stirring your quirk...',
  'Finding your voice...',
  'Crafting your post...',
  'Adding personality...',
  'Almost there...',
];

interface GenerationPanelProps {
  trend: Trend | null;
  type: 'text' | 'carousel' | 'image-prompt';
}

export function GenerationPanel({ trend, type }: GenerationPanelProps) {
  const { toast } = useToast();
  const { voice, refreshVoice } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [generated, setGenerated] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [modelConfig, setModelConfig] = useState({
    provider: 'openrouter',
    model: 'meta-llama/llama-3.1-70b-instruct',
    temperature: 0.7,
    hasApiKey: true,
  });
  const messageTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const skeletonRef = useRef<HTMLDivElement>(null);

  const hasVoice = !!voice;
  const isVoiceActive = voice?.isActive === true;

  useEffect(() => {
    if (isGenerating) {
      setMessageIndex(0);
      messageTimerRef.current = setInterval(() => {
        setMessageIndex(prev => (prev + 1) % GENERATING_MESSAGES.length);
      }, 2000);
    } else if (messageTimerRef.current) {
      clearInterval(messageTimerRef.current);
      messageTimerRef.current = null;
    }
    return () => {
      if (messageTimerRef.current) clearInterval(messageTimerRef.current);
    };
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!trend) return;
    setIsGenerating(true);
    setShowResult(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        skeletonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
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
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setShowResult(true);
        });
      });
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

  const handleCopy = async () => {
    if (!generated) return;
    let textToCopy = '';
    if (type === 'carousel' && generated.content) {
      try {
        const content = typeof generated.content === 'string' ? JSON.parse(generated.content) : generated.content;
        textToCopy = content.caption || '';
      } catch {
        textToCopy = '';
      }
    } else if (type === 'text') {
      textToCopy = generated.content || '';
    } else if (type === 'image-prompt') {
      try {
        const content = typeof generated.content === 'string' ? JSON.parse(generated.content) : generated.content;
        textToCopy = content.caption || content.prompt || '';
      } catch {
        textToCopy = generated.content || '';
      }
    }
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 2000);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleToggleVoice = async () => {
    setIsToggling(true);
    try {
      await api.patch('/users/voice/toggle', {});
      await refreshVoice();
    } catch {
      toast('error', 'Failed to toggle voice');
    } finally {
      setIsToggling(false);
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

      {hasVoice && (
        <div className={`mt-4 border-2 rounded-card p-3 flex items-center justify-between ${isVoiceActive ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="flex items-center gap-2">
            <Mic size={16} className={isVoiceActive ? 'text-green-600' : 'text-yellow-600'} />
            <span className={`font-mono text-xs ${isVoiceActive ? 'text-green-700' : 'text-yellow-700'}`}>
              {isVoiceActive ? 'VOICE ACTIVE' : 'VOICE INACTIVE'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`font-serif text-xs capitalize ${isVoiceActive ? 'text-green-600' : 'text-yellow-600'}`}>
              {voice.profile?.tone.primary}
            </span>
            <button
              onClick={handleToggleVoice}
              disabled={isToggling}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isVoiceActive ? 'bg-mint' : 'bg-warm-gray/40'
              }`}
            >
              {isToggling ? (
                <Loader2 size={14} className="mx-auto animate-spin text-soft-white" />
              ) : (
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-soft-white transition-transform ${
                    isVoiceActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              )}
            </button>
          </div>
        </div>
      )}

      <div className="mt-4">
        <Button
          onClick={handleGenerate}
          disabled={generateDisabled}
          className={`w-full ${isGenerating ? 'animate-generate-pulse' : ''}`}
        >
          {isGenerating ? (
            <>
              <Loader2 size={16} className="animate-spin" /> GENERATING...
            </>
          ) : (
            <>
              <Sparkles size={16} /> GENERATE {type.toUpperCase().replace('-', ' ')}
            </>
          )}
        </Button>
        {generateDisabled && (
          <p className="font-mono text-xs text-coral mt-2 text-center">
            Add your API key in Settings or switch to OpenRouter
          </p>
        )}
      </div>

      {isGenerating && (
        <div ref={skeletonRef} className="mt-6 space-y-4 animate-fade-in-up">
          <Card className="overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-coral animate-dot-bounce" style={{ animationDelay: '0s' }} />
                <span className="w-2 h-2 rounded-full bg-coral animate-dot-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 rounded-full bg-coral animate-dot-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
              <span className="font-mono text-xs text-warm-gray tracking-wider">
                {GENERATING_MESSAGES[messageIndex]}
              </span>
            </div>
            <div className="space-y-3">
              <div className="h-4 rounded-full animate-shimmer w-3/4" />
              <div className="h-4 rounded-full animate-shimmer w-full" />
              <div className="h-4 rounded-full animate-shimmer w-5/6" />
              <div className="h-4 rounded-full animate-shimmer w-2/3" />
            </div>
          </Card>
        </div>
      )}

      {generated && showResult && (
        <div className="mt-4 animate-result-reveal">
          {type === 'carousel' ? (
            <CarouselPreview
              slides={generated.content}
              onCopy={handleCopy}
              onRegenerate={handleRegenerate}
              isCopying={isCopying}
            />
          ) : (
            <GeneratedPost
              content={typeof generated.content === 'string' ? generated.content : ''}
              type={type}
              postId={generated._id || ''}
              onCopy={handleCopy}
              onRegenerate={handleRegenerate}
              isCopying={isCopying}
            />
          )}
        </div>
      )}
    </div>
  );
}
