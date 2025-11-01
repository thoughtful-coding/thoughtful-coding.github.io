/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  base: "/",
  server: {
    appType: "spa",
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "src/assets/data",
          dest: ".",
        },
        {
          src: "src/assets/images",
          dest: ".",
        },
        {
          src: "public/404.html",
          dest: ".",
        },
      ],
    }),
  ],

  // Merged Vitest configuration
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test-setup.ts",
    exclude: ["node_modules", "dist", "e2e/**"],
    coverage: {
      provider: "v8", // or 'istanbul'
      reporter: ["text", "json", "html"], // Generate multiple report formats
      reportsDirectory: "./.coverage", // Where to store the reports
      include: ["src/**/*.{ts,tsx}"], // Files to include in coverage
      exclude: [
        "src/assets/**",
        "src/main.tsx",
        "src/vite-env.d.ts",
        "src/types/**",
        "src/mocks/**",
        "src/contexts/PyodideContext.tsx", // Exclude files that are hard to test
      ],
    },
    css: {
      modules: {
        classNameStrategy: "non-scoped",
      },
    },
  },
});
