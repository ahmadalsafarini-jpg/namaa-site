import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// vite-plugin-prerender uses require() and breaks under ESM; load only when using CJS or a fixed fork
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// All route paths from App.jsx (for when prerender is enabled via separate script or CJS config)
const PRERENDER_ROUTES = [
  '/', '/login', '/register', '/dashboard', '/application', '/ticket',
  '/notifications', '/help', '/profile', '/admin-login', '/admin-dashboard', '/admin-client',
  '/energy-company-login', '/energy-company-dashboard', '/energy-company-client',
]

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Prerender disabled: vite-plugin-prerender throws "require is not defined" in ESM. Re-enable when using a CJS vite config or an ESM-compatible prerender plugin.
    // vitePrerender({ staticDir: path.join(__dirname, 'dist'), routes: PRERENDER_ROUTES }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
