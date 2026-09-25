import { defineConfig, devices } from '@playwright/test';

const CI = !!process.env.CI;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: !CI,
  retries: CI ? 2 : 0,
  timeout: 30_000,
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:5173',
    trace: 'on',
    screenshot: 'on',
    video: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: [
    {
      command: 'pnpm dev:server',
      url: 'http://localhost:3001/api/health',
      reuseExistingServer: !CI,
      timeout: 120_000,
    },
    {
      command: 'pnpm dev:web',
      url: 'http://localhost:5173',
      reuseExistingServer: !CI,
      timeout: 120_000,
    },
  ],
});
