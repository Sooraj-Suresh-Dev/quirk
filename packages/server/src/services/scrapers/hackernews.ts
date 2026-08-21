interface HNTrending {
  title: string;
  url: string;
  summary: string;
  tags: string[];
}

export async function fetchHackerNewsTrends(): Promise<HNTrending[]> {
  try {
    const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');

    if (!response.ok) {
      console.warn('HN API error:', response.status);
      return [];
    }

    const storyIds: number[] = await response.json();
    const topIds = storyIds.slice(0, 15);

    const stories = await Promise.all(
      topIds.map(async (id) => {
        const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        return res.json();
      })
    );

    return stories
      .filter((story: any) => story && story.title)
      .map((story: any) => ({
        title: story.title,
        url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
        summary: story.text || `${story.score || 0} points • ${story.descendants || 0} comments`,
        tags: ['hackernews'],
      }));
  } catch (error) {
    console.error('Failed to fetch Hacker News trends:', error);
    return [];
  }
}
