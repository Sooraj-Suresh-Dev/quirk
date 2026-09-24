import { describe, it, expect } from 'vitest';
import { renderDigestForTest } from './emailSender.test-helpers.js';

describe('digest email trend card', () => {
  it('renders source badge, metrics, author, time, and CTAs', () => {
    const html = renderDigestForTest({
      trends: [
        {
          id: '1',
          title: 'prompt-engineering-guide',
          summary: 'A comprehensive guide to prompt engineering techniques for LLMs and builders who ship.',
          source: 'github',
          url: 'https://github.com/example/repo',
          tags: ['ai', 'llm'],
          stars: 12400,
          forks: 890,
          author: 'alice',
          createdAt: new Date(Date.now() - 2 * 3_600_000).toISOString(),
          thumbnailUrl: 'https://example.com/thumb.jpg',
          generateUrl: 'https://app.example.com/generate/1',
        },
        {
          id: '2',
          title: 'DesignAI',
          summary: 'Turn wireframes into code',
          source: 'producthunt',
          url: 'https://producthunt.com/posts/x',
          tags: [],
          votes: 892,
          makers: ['bob'],
          generateUrl: 'https://app.example.com/generate/2',
        },
        {
          id: '3',
          title: 'Why Rust is the future',
          summary: 'Deep dive into memory safety',
          source: 'hackernews',
          url: 'https://news.ycombinator.com/x',
          tags: [],
          points: 341,
          comments: 120,
          generateUrl: 'https://app.example.com/generate/3',
        },
      ],
    });

    expect(html).toContain('GitHub');
    expect(html).toContain('★ 12.4k');
    expect(html).toContain('⑂ 890');
    expect(html).toContain('by alice');
    expect(html).toContain('2h ago');
    expect(html).toContain('Product Hunt');
    expect(html).toContain('♥ 892');
    expect(html).toContain('by bob');
    expect(html).toContain('Hacker News');
    expect(html).toContain('↑ 341');
    expect(html).toContain('Generate post');
    expect(html).toContain('View original');
    expect(html).toContain('https://app.example.com/generate/1');
    expect(html).not.toContain('#ai');
    expect(html).toContain('<img src="https://example.com/thumb.jpg"');
    expect(html).toContain('width="128" height="96"');
    expect(html).toContain('>PH<');
    expect(html).toContain('>HN<');
  });
});
