export async function fetchOgImage(url: string): Promise<string | undefined> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; QuirkBot/1.0)',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return undefined;

    const html = await res.text();
    const match =
      html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i) ||
      html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:image"/i);

    return match?.[1];
  } catch {
    return undefined;
  }
}
