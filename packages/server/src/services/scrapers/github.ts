interface GitHubTrending {
  title: string;
  url: string;
  summary: string;
  tags: string[];
}

export async function fetchGitHubTrends(): Promise<GitHubTrending[]> {
  try {
    const response = await fetch('https://api.github.com/search/repositories?q=created:>2026-08-20&sort=stars&order=desc&per_page=10', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      console.warn('GitHub API error:', response.status);
      return [];
    }

    const data = await response.json();

    return (data.items || []).map((repo: any) => ({
      title: `${repo.full_name} — ${repo.description || 'No description'}`.slice(0, 200),
      url: repo.html_url,
      summary: repo.description || `Stars: ${repo.stargazers_count}`,
      tags: [repo.language, ...(repo.topics || [])].filter(Boolean).slice(0, 5),
    }));
  } catch (error) {
    console.error('Failed to fetch GitHub trends:', error);
    return [];
  }
}
