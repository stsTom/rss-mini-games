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
    include: ['src/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.{test,spec}.ts'],
      thresholds: {
        statements: 80,
      },
    },
  },
});
