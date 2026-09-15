import { test, expect } from '@playwright/test';
import { authenticate } from './helpers/auth';

test.describe('Library', () => {
  test.beforeEach(async ({ page }) => {
    await authenticate(page);
  });

  test('library page loads with title', async ({ page }) => {
    await page.goto('/library');
    await page.waitForTimeout(1000);
    await expect(page.getByRole('heading', { name: 'LIBRARY' })).toBeVisible();
  });

  test('search input is present', async ({ page }) => {
    await page.goto('/library');
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();
  });

  test('refresh button is present', async ({ page }) => {
    await page.goto('/library');
    const refreshBtn = page.getByRole('button', { name: /refresh/i });
    await expect(refreshBtn.first()).toBeVisible();
  });
});
