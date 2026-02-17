import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ===========================================
// Vite Configuration
// ===========================================
// - React plugin: enables JSX support
// - Tailwind plugin: processes Tailwind CSS classes
// - Proxy: forwards /api calls to our FastAPI backend (port 8000)
//   so we don't get CORS issues during development
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    // 👇 ADD THIS
    allowedHosts: [
      'eleonora-nonmanufactured-songfully.ngrok-free.dev'
    ],
    proxy: {
      // Any request starting with /api → forward to backend
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
