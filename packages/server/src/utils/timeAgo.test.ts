import { describe, it, expect } from 'vitest';
import { timeAgo } from './timeAgo.js';

describe('timeAgo', () => {
  it('returns empty for invalid dates', () => {
    expect(timeAgo('not-a-date')).toBe('');
  });

  it('returns just now for recent dates', () => {
    expect(timeAgo(new Date(Date.now() - 5_000).toISOString())).toBe('just now');
  });

  it('returns minutes', () => {
    expect(timeAgo(new Date(Date.now() - 5 * 60_000).toISOString())).toBe('5m ago');
  });

  it('returns hours', () => {
    expect(timeAgo(new Date(Date.now() - 3 * 3_600_000).toISOString())).toBe('3h ago');
  });

  it('returns days', () => {
    expect(timeAgo(new Date(Date.now() - 2 * 86_400_000).toISOString())).toBe('2d ago');
  });
});
