import { defineConfig, devices } from '@playwright/test';

// NOTE: Environment variables are loaded via `utils/global-setup.ts` (Playwright globalSetup).
// We intentionally avoid calling dotenv here so that Playwright's `globalSetup` handles
// loading `.env.<env>` files. Ensure you run tests via npm scripts that set `TEST_ENV`
// (we provide `cross-env` scripts in package.json), or set TEST_ENV in your shell.

const BASE_URL = process.env.BASE_URL || 'https://demoqa.com';
const HEADLESS = process.env.HEADLESS === 'true';
const WORKERS = parseInt(process.env.WORKERS || '1', 1);


export default defineConfig({
  // Use our global setup to load environment variables before tests run.
  globalSetup: require.resolve('./utils/global-setup'),
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 2,
  workers: 1,
  reporter: [
    ['html'],
    ['allure-playwright', {
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: false
    }]
  ],
  use: {
    trace: 'on-first-retry',
    launchOptions: {
      slowMo: 500,
    },
    baseURL: BASE_URL,
    headless: HEADLESS,
    screenshot: 'only-on-failure',
    actionTimeout: 40_000,
    navigationTimeout: 60_000
  },

  projects: [
    // {
    //   name: 'chromium',
    //   use: { 
    //     viewport: null, 
    //     launchOptions: {
    //       args: ['--start-maximized']
    //     }
    //   },
    // },

    // {
    //   name: 'Microsoft Edge',
    //   use: { 
    //     channel: 'msedge',
    //     viewport: null, 
    //     launchOptions: {
    //       args: ['--start-maximized']
    //     }
    //   },
    // },
    {
      name: 'Google Chrome',
      use: { 
        channel: 'chrome',
        viewport: null, 
        launchOptions: {
          args: ['--start-maximized']
        }
      },
    },
  ],
});
