import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      minify: false,
      inject: {
        data: {
          title: 'Namaa Energy | Solar Project Marketplace — Qatar & GCC',
          description: "Qatar's AI-powered solar marketplace. Get an instant bankable feasibility report in 60 seconds. Connecting facility owners, solar EPCs, and green finance across the GCC.",
          ogImage: 'https://www.namaaenergy.com/og-image.png',
          ogUrl: 'https://www.namaaenergy.com',
        },
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
