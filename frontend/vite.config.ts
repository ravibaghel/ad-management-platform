import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/campaigns': { target: 'http://localhost:8080', changeOrigin: true },
      '/api/analytics': { target: 'http://localhost:8081', changeOrigin: true },
      '/api/optimization': { target: 'http://localhost:8082', changeOrigin: true },
    }
  }
})
