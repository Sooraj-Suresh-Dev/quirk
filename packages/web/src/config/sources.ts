import { Github, Rocket, ArrowUp } from 'lucide-react';

export interface SourceConfig {
  label: string;
  filterLabel: string;
  color: string;
  bgColor: string;
  icon: React.ElementType;
  metrics: ('stars' | 'forks' | 'votes' | 'points' | 'comments')[];
}

export const SOURCES: Record<string, SourceConfig> = {
  github: {
    label: 'GitHub',
    filterLabel: 'GITHUB',
    color: 'text-coral',
    bgColor: 'bg-coral',
    icon: Github,
    metrics: ['stars', 'forks'],
  },
  producthunt: {
    label: 'Product Hunt',
    filterLabel: 'PRODUCT HUNT',
    color: 'text-mint',
    bgColor: 'bg-mint',
    icon: Rocket,
    metrics: ['votes'],
  },
  hackernews: {
    label: 'Hacker News',
    filterLabel: 'HACKER NEWS',
    color: 'text-[#F5A623]',
    bgColor: 'bg-[#F5A623]',
    icon: ArrowUp,
    metrics: ['points', 'comments'],
  },
};

export const SOURCE_KEYS = Object.keys(SOURCES);
