import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/v3/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", ".next", "dist"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules",
        "tests",
        "**/*.d.ts",
        "**/*.config.*",
        "**/setup.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "./"),
      "@/lib": path.resolve(rootDir, "./lib"),
      "@/components": path.resolve(rootDir, "./components"),
      "@/app": path.resolve(rootDir, "./app"),
    },
  },
});
