import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  outputDir: 'test-results',
  fullyParallel: false,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:4173', channel: 'chrome', colorScheme: 'dark', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  webServer: { command: 'corepack pnpm dev --host 127.0.0.1 --port 4173', url: 'http://127.0.0.1:4173', reuseExistingServer: true },
  projects: [
    { name: '720p', use: { viewport: { width: 1280, height: 720 } } },
    { name: '1080p', use: { viewport: { width: 1920, height: 1080 } } },
    { name: '1440p', use: { viewport: { width: 2560, height: 1440 } } },
    { name: 'ultrawide', use: { viewport: { width: 3440, height: 1440 } } },
    { name: '4k', use: { viewport: { width: 3840, height: 2160 } } },
  ],
})
