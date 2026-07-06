import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    host: '127.0.0.1', // ПРИНУДИТЕЛЬНЫЙ БИНД НА IPV4 127.0.0.1
    watch: {
      usePolling: true,
      interval: 100,
    },
    proxy: {
      '/users': { 
        target: 'http://127.0.0.1:8090', 
        changeOrigin: true,
        bypass: (req, res, proxyOptions) => {
          if (req.headers.accept && req.headers.accept.indexOf('html') !== -1) {
            return '/index.html';
          }
        }
      },
      '/settings': { 
        target: 'http://127.0.0.1:8090', 
        changeOrigin: true,
        bypass: (req, res, proxyOptions) => {
          if (req.headers.accept && req.headers.accept.indexOf('html') !== -1) {
            return '/index.html';
          }
        }
      },
      '/api': { target: 'http://127.0.0.1:8090', changeOrigin: true },
      '/sub': { target: 'http://127.0.0.1:8090', changeOrigin: true }
    }
  }
})