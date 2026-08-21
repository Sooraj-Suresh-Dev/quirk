interface BadgeProps {
  source: 'github' | 'hackernews' | 'producthunt' | 'techcrunch';
  className?: string;
}

const sourceColors: Record<string, string> = {
  github: 'bg-coral text-soft-white',
  hackernews: 'bg-[#F5A623] text-soft-white',
  producthunt: 'bg-mint text-soft-white',
  techcrunch: 'bg-[#D4A5A5] text-soft-white',
};

const sourceLabels: Record<string, string> = {
  github: 'GitHub',
  hackernews: 'Hacker News',
  producthunt: 'Product Hunt',
  techcrunch: 'TechCrunch',
};

export function Badge({ source, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-mono border border-deep-black ${sourceColors[source]} ${className}`}>
      {sourceLabels[source]}
    </span>
  );
}
