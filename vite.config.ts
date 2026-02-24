import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // For GitHub Pages: set VITE_BASE_URL in CI (e.g. /repo-name/) or GITHUB_PAGES=true for /open-agtech-evaluator/
  base: process.env.VITE_BASE_URL ?? (process.env.GITHUB_PAGES === 'true' ? '/open-agtech-evaluator/' : '/'),
})
