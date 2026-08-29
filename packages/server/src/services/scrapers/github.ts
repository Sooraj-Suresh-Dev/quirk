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

async function fetchReadme(repoUrl: string): Promise<string | undefined> {
  try {
    const apiUrl = repoUrl.replace('github.com', 'api.github.com/repos');
    const res = await fetch(`${apiUrl}/readme`, {
      headers: { 'Accept': 'application/vnd.github.v3.raw' },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return undefined;
    const text = await res.text();
    return text
      .replace(/[#*_`>\[\]()!]/g, '')
      .replace(/\n+/g, ' ')
      .trim()
      .slice(0, 300);
  } catch {
    return undefined;
  }
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

    const enriched = await Promise.all(
      results.map(async (trend: GitHubTrending) => {
        const [thumbnailUrl, readme] = await Promise.all([
          fetchOgImage(trend.url),
          fetchReadme(trend.url),
        ]);
        return {
          ...trend,
          thumbnailUrl,
          summary: readme || trend.summary,
        };
      })
    );

    return enriched;
  } catch (error) {
    console.error('Failed to fetch GitHub trends:', error);
    return [];
  }
}
