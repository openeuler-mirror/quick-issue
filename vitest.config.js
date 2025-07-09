import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'json'],
      provider: 'v8',
      include: ['**/utils/**', '**/shared/utils.ts', '**/shared/utils.js'],
      exclude: ['node_modules/**', 'dist/**', 'public/**', '**.test.ts'],
    },
  },
})