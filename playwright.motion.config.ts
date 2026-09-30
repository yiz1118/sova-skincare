import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.config";

export default defineConfig({
  ...base,
  // Browser channels belong to their projects; WebKit cannot inherit Chrome.
  use: { baseURL: base.use?.baseURL, trace: "retain-on-failure" },
  testMatch: "motion.spec.ts",
  outputDir: "test-results/motion",
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report/motion" }]],
  projects: [
    { name: "edge", use: { browserName: "chromium", channel: "msedge" } },
    { name: "android", use: { ...devices["Pixel 7"], browserName: "chromium", channel: "chrome" } },
    { name: "webkit-desktop", use: { browserName: "webkit", channel: undefined, viewport: { width: 1440, height: 900 } } },
    { name: "iphone-webkit", use: { ...devices["iPhone 13"], browserName: "webkit", channel: undefined } },
  ],
});
