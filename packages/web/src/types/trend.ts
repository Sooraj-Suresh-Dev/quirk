export interface Trend {
  _id: string;
  source: 'github' | 'producthunt' | 'hackernews';
  title: string;
  url: string;
  summary: string;
  tags: string[];
  thumbnailUrl?: string;
  stars?: number;
  forks?: number;
  votes?: number;
  points?: number;
  comments?: number;
  website?: string;
  makers?: string[];
  author?: string;
  createdAt?: string;
}
