import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths"; // resolves the @/* alias

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // env.ts validates this at import time; provide a value so unit tests load.
    env: { NEXT_PUBLIC_API_BASE_URL: "https://api.test" },
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["**/*.config.*", "**/*.d.ts", "**/types.ts", ".next/**"],
      // thresholds intentionally OFF until real coverage exists — a fresh clone
      // with two example tests would otherwise fail CI on day one. Enable later:
      // thresholds: { statements: 70, branches: 60, functions: 70, lines: 70 },
    },
  },
});
