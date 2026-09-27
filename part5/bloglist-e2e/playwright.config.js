const { defineConfig, devices } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  // Every test resets the same database.
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'node test-server.js',
      url: 'http://localhost:3003/api/testing/health',
      timeout: 120000,
      reuseExistingServer: false
    },
    {
      command: 'npm --prefix ../bloglist-frontend run dev -- --host localhost --port 5173 --strictPort',
      url: 'http://localhost:5173',
      reuseExistingServer: false
    }
  ]
})
