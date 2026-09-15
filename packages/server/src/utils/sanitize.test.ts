import { describe, it, expect } from 'vitest';
import { sanitizeInput, sanitizeArray } from './sanitize';

describe('sanitizeInput', () => {
  it('escapes HTML angle brackets', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
  });

  it('escapes single quotes', () => {
    expect(sanitizeInput("it's a test")).toBe("it&#x27;s a test");
  });

  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('handles empty string', () => {
    expect(sanitizeInput('')).toBe('');
  });

  it('handles string with no special chars', () => {
    expect(sanitizeInput('normal text')).toBe('normal text');
  });
});

describe('sanitizeArray', () => {
  it('sanitizes all items in array', () => {
    const result = sanitizeArray(['<b>bold</b>', 'normal', '<i>italic</i>']);
    expect(result).toEqual(['&lt;b&gt;bold&lt;/b&gt;', 'normal', '&lt;i&gt;italic&lt;/i&gt;']);
  });

  it('handles empty array', () => {
    expect(sanitizeArray([])).toEqual([]);
  });
});
