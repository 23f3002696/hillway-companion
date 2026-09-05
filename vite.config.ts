import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  server: {
    host: true
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Hillway Companion · DHR Heritage Guide',
        short_name: 'Hillway',
        description: 'Offline UNESCO Darjeeling Himalayan Railway guide, elevation tracker & zero-bars phrasebook',
        theme_color: '#1a3323',
        background_color: '#0f1f15',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2,wasm,tflite}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document' || request.destination === 'script' || request.destination === 'style' || request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'hillway-static-assets',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: ({ url }) => url.pathname.endsWith('.wasm') || url.pathname.endsWith('.tflite') || url.hostname.includes('cdn.jsdelivr.net') || url.hostname.includes('storage.googleapis.com'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'hillway-vision-models',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
});

