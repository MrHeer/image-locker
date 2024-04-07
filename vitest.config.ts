import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      headless: true,
      name: 'chrome',
    },
    coverage: {
      provider: 'istanbul',
      include: ['src/lib/**'],
      exclude: ['src/lib/download.ts', 'src/lib/upload.ts'],
      thresholds: {
        statements: 100,
        functions: 100,
        branches: 100,
        lines: 100,
      },
    },
  },
});
