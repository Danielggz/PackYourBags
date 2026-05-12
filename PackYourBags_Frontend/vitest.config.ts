import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    pool: "none",
    isolate: false,
    globals: true,
    setupFiles: "./src/setupTests.ts"
  }
});