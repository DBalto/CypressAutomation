const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://www.saucedemo.com",
    viewportWidth: 1280,
    viewportHeight: 720,
    // Increased from 8000 to 15000 to account for React async rendering
    // of child components (e.g. sort container) after the inventory list
    // container mounts. This is especially important on slower CI machines.
    defaultCommandTimeout: 15000,
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
