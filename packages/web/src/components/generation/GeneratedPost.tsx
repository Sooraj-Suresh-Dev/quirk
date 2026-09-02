import { useState } from 'react';
import { PreviewCard } from './PreviewCard';
import { ImageIcon } from 'lucide-react';

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
            className="relative aspect-video w-full rounded-lg overflow-hidden bg-gradient-to-br from-coral/20 to-mint/20 cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <div className={`transition-opacity duration-200 ${hovered ? 'opacity-0' : 'opacity-100'}`}>
                <ImageIcon size={48} className="text-warm-gray/50 mb-2 mx-auto" />
                <p className="font-mono text-xs text-warm-gray text-center">
                  Hover to see prompt
                </p>
              </div>
              <div
                className={`absolute inset-0 p-4 bg-deep-black/90 overflow-y-auto transition-opacity duration-200 ${
                  hovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <p className="font-mono text-xs text-soft-white whitespace-pre-wrap leading-relaxed">
                  {imageContent.prompt}
                </p>
              </div>
            </div>
          </div>

          {imageContent.caption && (
            <p className="font-serif text-charcoal whitespace-pre-wrap">{imageContent.caption}</p>
          )}

          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-warm-gray">Style:</span>
            <span className="font-mono text-coral">{imageContent.style}</span>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-cream rounded-lg">
          <p className="font-serif text-charcoal whitespace-pre-wrap leading-relaxed">
            {content}
          </p>
        </div>
      )}
    </PreviewCard>
  );
}
