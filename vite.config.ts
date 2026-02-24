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
  define: {
    // Cache-bust header logo so it updates when the app is redeployed (same as tab icon)
    __LOGO_BUILD_ID__: JSON.stringify(process.env.CF_PAGES_COMMIT_SHA ?? process.env.GITHUB_SHA ?? Date.now()),
  },
})
