interface QualityCheckResult {
  pass: boolean;
  reason?: string;
}

const MIN_SUMMARY_LENGTH = 20;
const MAX_SUMMARY_LENGTH = 500;
const FORBIDDEN_PATTERNS = [/^\d+$/, /^http/, /^\.\.\./, /^undefined$/i, /^null$/i];

export function validateTrendQuality(trend: {
  title: string;
  summary: string;
  tags: string[];
  thumbnailUrl?: string;
}): QualityCheckResult {
  if (!trend.title?.trim()) return { pass: false, reason: 'empty title' };
  if (trend.title.trim().length < 3) return { pass: false, reason: 'title too short' };

  if (!trend.summary?.trim()) return { pass: false, reason: 'empty summary' };
  if (trend.summary.trim().length < MIN_SUMMARY_LENGTH) return { pass: false, reason: 'summary too short' };
  if (trend.summary.length > MAX_SUMMARY_LENGTH) {
    trend.summary = trend.summary.slice(0, MAX_SUMMARY_LENGTH);
  }

  if (FORBIDDEN_PATTERNS.some(p => p.test(trend.summary.trim()))) {
    return { pass: false, reason: 'summary is not readable content' };
  }

  const wordCount = trend.summary.split(/\s+/).filter(w => /[a-zA-Z]/.test(w)).length;
  if (wordCount < 3) return { pass: false, reason: 'summary lacks readable words' };

  if (!trend.thumbnailUrl) {
    return { pass: false, reason: 'no thumbnail image' };
  }

  return { pass: true };
}

export function filterTrends<T extends { title: string; summary: string; tags: string[]; thumbnailUrl?: string }>(trends: T[]): T[] {
  return trends.filter(t => validateTrendQuality(t).pass);
}
