const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:5001',
    allowCypressEnv: false,
    setupNodeEvents(on, config) {},
  },
})