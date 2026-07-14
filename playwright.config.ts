import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "desktop-firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "desktop-webkit",
      use: { ...devices["Desktop Safari"] },
    },

    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 12"] },
    },
  ],
  webServer: [
    {
      command: "npm run mock-backend",
      port: 3001,
      reuseExistingServer: !process.env.CI,
      timeout: 60 * 1000,
    },
    {
      command: "npm start",
      port: 3000,
      reuseExistingServer: !process.env.CI,
      timeout: 60 * 1000,
    },
  ],
});
