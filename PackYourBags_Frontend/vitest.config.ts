import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: process.env.CI ? "node" : "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts"
  }
});
