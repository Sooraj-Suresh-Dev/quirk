import { fetchOgImage } from './ogImage.js';

interface GitHubTrending {
  title: string;
  url: string;
  summary: string;
  tags: string[];
  thumbnailUrl?: string;
  stars?: number;
  forks?: number;
  author?: string;
  createdAt?: string;
}

export async function fetchGitHubTrends(): Promise<GitHubTrending[]> {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const response = await fetch(`https://api.github.com/search/repositories?q=created:>${since}&sort=stars&order=desc&per_page=10`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      console.warn('GitHub API error:', response.status);
      return [];
    }

    const data = await response.json();

    const results = (data.items || []).map((repo: any) => ({
      title: repo.full_name,
      url: repo.html_url,
      summary: repo.description || `Stars: ${repo.stargazers_count} • ${repo.language || 'Unknown'}`,
      tags: [repo.language, ...(repo.topics || [])].filter(Boolean).slice(0, 5),
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      author: repo.owner?.login,
      createdAt: repo.created_at,
    }));

    const withThumbnails = await Promise.all(
      results.map(async (trend: GitHubTrending) => ({
        ...trend,
        thumbnailUrl: await fetchOgImage(trend.url),
      }))
    );

    return withThumbnails;
  } catch (error) {
    console.error('Failed to fetch GitHub trends:', error);
    return [];
  }
}
