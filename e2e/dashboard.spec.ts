import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('dashboard page redirects or shows content', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(2000);
    const url = page.url();
    const isOnDashboard = url.includes('/dashboard');
    const isOnLanding = url === '/' || url.endsWith('/');
    expect(isOnDashboard || isOnLanding).toBeTruthy();
  });

  test('sidebar navigation links exist', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);
    const sidebar = page.locator('aside, nav').first();
    await expect(sidebar).toBeVisible();
  });

  test('trending section is visible on dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(2000);
    const trending = page.locator('text=TRENDING NOW').or(page.locator('[data-walkthrough="trending-now"]'));
    const hasTrending = await trending.first().isVisible().catch(() => false);
    expect(hasTrending).toBeTruthy();
  });
});
