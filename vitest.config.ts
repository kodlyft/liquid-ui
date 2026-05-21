import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,js}'],
    coverage: {
      reporter: ['text', 'lcov', 'html'],
      exclude: ['node_modules', 'dist', '**/*.config.*', 'src/__tests__/**'],
    },
  },
})
