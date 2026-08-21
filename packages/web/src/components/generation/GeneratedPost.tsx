import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Copy, Check, RefreshCw } from 'lucide-react';

interface GeneratedPostProps {
  content: string;
  type: 'text' | 'image-prompt';
  postId: string;
}

export function GeneratedPost({ content, type, postId: _postId }: GeneratedPostProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono text-xs text-warm-gray uppercase">{type.replace('-', ' ')}</p>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleCopy} className="p-2">
            {copied ? <Check size={16} className="text-mint" /> : <Copy size={16} />}
          </Button>
          <Button variant="ghost" className="p-2">
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>
      <div className="font-serif text-charcoal whitespace-pre-wrap">{content}</div>
    </Card>
  );
}
