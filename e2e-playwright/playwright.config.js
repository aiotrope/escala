module.exports = {
  globalTimeout: 60000,
  timeout: 30000,
  retries: 0,
  reporter: 'list',
  workers: 5,
  use: {
    baseURL: 'http://localhost:7800',
    headless: true,
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'webkit',
      use: {
        browserName: 'webkit',
      },
    },
  ],
};
