import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import laravel from 'laravel-vite-plugin'
import { wayfinder } from '@laravel/vite-plugin-wayfinder'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.tsx'],
      ssr: 'resources/js/ssr.tsx',
      refresh: [
        'routes/**',
        'resources/views/**',
        'resources/js/**',
        'app/Models/**',
        'app/Http/**',
        'app/Policies/**',
      ],
    }),
    react(),
    tailwindcss(),
    wayfinder({
      formVariants: true,
    }),
  ],
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    alias: {
      '@': '/resources/js',
      'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      host: 'localhost',
    },
    watch: {
      usePolling: true,        // ← fuerza la detección de cambios
      interval: 300,           // ← baja el intervalo si deseas más rapidez
    },
  },
})
