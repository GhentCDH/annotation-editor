import { nxE2EPreset } from '@nx/playwright/preset';
import { defineConfig, devices } from '@playwright/test';
import { resolve } from 'path';

// __dirname is available in Playwright's CJS compilation context.
// Two levels up from packages/annotation-editor-e2e/ → workspace root
const workspaceRoot = resolve(__dirname, '../..');

const baseURL = process.env['BASE_URL'] || 'http://localhost:4175';

export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: './src/specs' }),
  use: {
    baseURL,
    trace: 'on',
  },
  /* Boot the playground before running tests. */
  webServer: {
    command:
      'pnpm exec vite dev --config packages/annotation-editor-e2e/vite.config.ts',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
