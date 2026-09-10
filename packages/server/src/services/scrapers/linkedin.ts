import { logError } from '../../config/logger.js';

interface ExtractionResult {
  text: string;
  title?: string;
}

const LINKEDIN_URL_REGEX = /linkedin\.com\/(posts|feed\/update)/i;

function cleanText(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFromHtml(html: string): ExtractionResult {
  // Strategy 1: JSON-LD structured data
  const jsonLdRegex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      const text = data.articleBody || data.text || data.description;
      if (text && typeof text === 'string' && text.length > 10) {
        return { text: cleanText(text), title: data.headline };
      }
    } catch {
      // invalid JSON-LD, continue
    }
  }

  // Strategy 2: og:description meta tag
  const ogPatterns = [
    /<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i,
    /<meta[^>]+content="([^"]+)"[^>]+property="og:description"/i,
  ];
  for (const pattern of ogPatterns) {
    const m = html.match(pattern);
    if (m?.[1] && m[1].length > 10) {
      return { text: cleanText(m[1]) };
    }
  }

  // Strategy 3: meta description
  const metaPatterns = [
    /<meta[^>]+name="description"[^>]+content="([^"]+)"/i,
    /<meta[^>]+content="([^"]+)"[^>]+name="description"/i,
  ];
  for (const pattern of metaPatterns) {
    const m = html.match(pattern);
    if (m?.[1] && m[1].length > 10) {
      return { text: cleanText(m[1]) };
    }
  }

  // Strategy 4: visible post text from LinkedIn-specific containers
  const containerPatterns = [
    /<div[^>]*class="[^"]*feed-shared-update-v2__description[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<span[^>]*class="[^"]*feed-shared-text[^"]*"[^>]*>([\s\S]*?)<\/span>/i,
    /<div[^>]*class="[^"]*update-components-text[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  ];
  for (const pattern of containerPatterns) {
    const m = html.match(pattern);
    if (m?.[1]) {
      const cleaned = m[1].replace(/<[^>]+>/g, '').trim();
      if (cleaned.length > 10) {
        return { text: cleanText(cleaned) };
      }
    }
  }

  throw new Error(
    'Could not extract post text from this URL. ' +
    'The post may be private or behind a login wall. ' +
    'Try copying the post text instead.'
  );
}

export async function extractLinkedInPost(url: string): Promise<ExtractionResult> {
  if (!LINKEDIN_URL_REGEX.test(url)) {
    throw new Error(
      'Not a valid LinkedIn post URL. ' +
      'Please use a URL from linkedin.com/posts/ or linkedin.com/feed/update/'
    );
  }

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(10000),
      redirect: 'follow',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('timeout') || message.includes('abort')) {
      throw new Error('LinkedIn took too long to respond. Please try again.');
    }
    throw new Error('Failed to connect to LinkedIn. Please check your network and try again.');
  }

  if (!res.ok) {
    if (res.status === 403 || res.status === 401) {
      throw new Error(
        'LinkedIn blocked the request. ' +
        'The post may require login to view. Try copying the post text instead.'
      );
    }
    throw new Error(`Failed to fetch LinkedIn page (HTTP ${res.status})`);
  }

  const html = await res.text();
  return extractFromHtml(html);
}
