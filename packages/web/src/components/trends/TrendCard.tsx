import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ExternalLink } from 'lucide-react';

interface Trend {
  _id: string;
  source: 'github' | 'hackernews';
  title: string;
  url: string;
  summary: string;
  tags: string[];
}

interface TrendCardProps {
  trend: Trend;
  selected?: boolean;
  onClick?: () => void;
}

export function TrendCard({ trend, selected, onClick }: TrendCardProps) {
  return (
    <Card
      hover
      className={`transition-all ${selected ? 'ring-2 ring-coral shadow-card-hover' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge source={trend.source} />
          </div>
          <h3 className="font-mono text-sm font-bold text-charcoal truncate">{trend.title}</h3>
          <p className="font-serif text-sm text-warm-gray mt-1 line-clamp-2">{trend.summary}</p>
          {trend.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {trend.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs font-mono text-warm-gray bg-cream px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <a
          href={trend.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-warm-gray hover:text-coral shrink-0"
        >
          <ExternalLink size={16} />
        </a>
      </div>
    </Card>
  );
}
