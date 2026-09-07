import { useState } from 'react';
import { PreviewCard } from './PreviewCard';
import { Wand2 } from 'lucide-react';

interface ImagePromptContent {
  prompt: string;
  style: string;
  caption: string;
}

interface GeneratedPostProps {
  content: string;
  type: 'text' | 'image-prompt';
  postId: string;
  onCopy: () => void;
  onRegenerate: () => void;
  isCopying?: boolean;
}

function parseImagePromptContent(content: string): ImagePromptContent | null {
  try {
    const parsed = JSON.parse(content);
    if (parsed.prompt) return parsed as ImagePromptContent;
  } catch {
  }
  return null;
}

export function GeneratedPost({
  content,
  type,
  postId: _postId,
  onCopy,
  onRegenerate,
  isCopying,
}: GeneratedPostProps) {
  const [hovered, setHovered] = useState(false);

  const imageContent = type === 'image-prompt' ? parseImagePromptContent(content) : null;

  const label = type === 'image-prompt' ? 'IMAGE PROMPT' : 'TEXT';

  return (
    <PreviewCard
      label={label}
      onCopy={onCopy}
      onRegenerate={onRegenerate}
      isCopying={isCopying}
    >
      {type === 'image-prompt' && imageContent ? (
        <div className="space-y-3">
          <div
            className="relative aspect-video w-full rounded-lg overflow-hidden bg-gradient-to-br from-coral/20 to-mint/20 cursor-pointer transition-all duration-300 hover:shadow-card-hover"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <div className={`transition-all duration-300 ${hovered ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                <Wand2 size={32} className="text-coral/60 mb-2 mx-auto" />
                <p className="font-mono text-xs text-warm-gray text-center">
                  Hover to reveal prompt
                </p>
              </div>
              <div
                className={`absolute inset-0 p-4 bg-deep-black/95 overflow-y-auto transition-all duration-300 ${
                  hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <p className="font-mono text-xs text-soft-white whitespace-pre-wrap leading-relaxed">
                  {imageContent.prompt}
                </p>
              </div>
            </div>
          </div>

          {imageContent.caption && (
            <div className="animate-fade-in-up stagger-1">
              <p className="font-serif text-charcoal whitespace-pre-wrap">{imageContent.caption}</p>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs animate-fade-in-up stagger-2">
            <span className="font-mono text-warm-gray">Style:</span>
            <span className="font-mono text-coral font-bold">{imageContent.style}</span>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-cream rounded-lg">
          <p className="font-serif text-charcoal whitespace-pre-wrap leading-relaxed animate-fade-in-up">
            {content}
          </p>
        </div>
      )}
    </PreviewCard>
  );
}
