import { config } from '../../config/env.js';

interface ProductHuntTrending {
  title: string;
  url: string;
  summary: string;
  tags: string[];
  thumbnailUrl?: string;
  votes?: number;
  website?: string;
  makers?: string[];
}

function getYesterday(): string {
  const d = new Date(Date.now() - 86400000);
  return d.toISOString();
}

export async function fetchProductHuntTrends(): Promise<ProductHuntTrending[]> {
  const token = config.PRODUCT_HUNT_API_TOKEN;
  if (!token) {
    console.warn('Product Hunt API token not set, skipping');
    return [];
  }

  try {
    const query = `{
      posts(order: RANKING, first: 15, postedAfter: "${getYesterday()}") {
        edges {
          node {
            name
            tagline
            description
            url
            votesCount
            website
            thumbnail(size: 800) { url }
            topics { edges { node { name } } }
            makers { name }
          }
        }
      }
    }`;

    const res = await fetch('https://api.producthunt.com/v2/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      console.warn('Product Hunt API error:', res.status);
      return [];
    }

    const data = await res.json();
    const posts = data?.data?.posts?.edges?.map((e: any) => e.node) ?? [];

    return posts.map((post: any) => ({
      title: post.name,
      url: post.url,
      summary: post.description || post.tagline || '',
      tags: (post.topics?.edges?.map((e: any) => e.node.name) ?? []).slice(0, 5),
      thumbnailUrl: post.thumbnail?.url,
      votes: post.votesCount,
      website: post.website,
      makers: post.makers?.map((m: any) => m.name),
    }));
  } catch (error) {
    console.error('Failed to fetch Product Hunt trends:', error);
    return [];
  }
}
