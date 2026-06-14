import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Allow Vite dev server to serve files from the parent directory
  // so product images resolve correctly without copying them
  server: {
    fs: { allow: ['..', '.'] },
  },
})
