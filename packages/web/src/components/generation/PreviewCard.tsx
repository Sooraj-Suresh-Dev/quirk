import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Copy, Check, RefreshCw, Sparkles } from 'lucide-react';

interface PreviewCardProps {
  label: string;
  count?: string;
  onCopy: () => void;
  onRegenerate: () => void;
  isCopying?: boolean;
  isNew?: boolean;
  children: React.ReactNode;
}

export function PreviewCard({
  label,
  count,
  onCopy,
  onRegenerate,
  isCopying,
  isNew = true,
  children,
}: PreviewCardProps) {
  return (
    <Card className={isNew ? 'animate-result-reveal' : ''}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-coral animate-sparkle" />
          <span className="font-mono text-xs font-bold text-coral tracking-wider">{label}</span>
          {count && (
            <span className="font-mono text-xs text-warm-gray">{count}</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={onCopy}
            className={`text-xs h-8 transition-all duration-200 ${isCopying ? 'text-mint' : ''}`}
          >
            {isCopying ? (
              <>
                <Check size={14} className="text-mint" />
                <span className="text-mint">COPIED!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>COPY</span>
              </>
            )}
          </Button>
          <Button variant="ghost" onClick={onRegenerate} className="text-xs h-8">
            <RefreshCw size={14} />
            <span>REGENERATE</span>
          </Button>
        </div>
      </div>
      {children}
    </Card>
  );
}
