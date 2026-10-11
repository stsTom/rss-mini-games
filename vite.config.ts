/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: ['.'],
      },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
    setupFiles: ['tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/app/index.ts',
        'src/firebase.ts',
        '**/interfaces.ts',
        '**/constants.ts',
        '**/dataset-values.ts',
      ],
      thresholds: {
        statements: 80,
      },
    },
  },
});
