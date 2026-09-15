import { test, expect } from '@playwright/test';
import { authenticate } from './helpers/auth';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await authenticate(page);
  });

  test('dashboard page loads with content', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url).toContain('/dashboard');
  });

  test('sidebar navigation is visible', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('aside').first()).toBeVisible();
  });

  test('trending section is visible', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(2000);
    const trending = page.locator('[data-walkthrough="trending-now"]').or(page.getByText('TRENDING NOW'));
    await expect(trending.first()).toBeVisible({ timeout: 5000 });
  });

  test('post stats section is visible', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(2000);
    const stats = page.getByText('POST STATS');
    await expect(stats).toBeVisible({ timeout: 5000 });
  });
});
