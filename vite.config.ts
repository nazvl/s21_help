import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    proxy: {
      '/api/token': {
        target: 'https://auth.sberclass.ru',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/api\/token/, '/auth/realms/EduPowerKeycloak/protocol/openid-connect/token'),
      },
      '/api/21school': {
        target: 'https://edu-api.21-school.ru',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/api\/21school/, '/services/21-school/api/v1'),
      },
    },
  },
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 's21 Helper',
        short_name: 's21',
        start_url: '/',
        display: 'standalone',
        background_color: '#171A1C',
        theme_color: '#171A1C',
        icons: [
          { src: '/logo.png', sizes: '192x192', type: 'image/png' },
          { src: '/logo.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.js'],
  },
})
