import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { compression } from 'vite-plugin-compression2';

const apiTarget = process.env.VITE_API_TARGET || 'http://localhost:3001';

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithms: ['gzip', 'brotliCompress'],
      exclude: [/\.(map|html)$/],
      threshold: 1024,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          const n = id.split(path.sep).join('/');
          if (
            n.includes('/lucide-react/') ||
            n.includes('/@floating-ui/') ||
            n.includes('/clsx/')
          ) {
            return 'vendor-ui';
          }
          if (
            n.includes('/react-router/') ||
            n.includes('/react-dom/') ||
            n.includes('/react-helmet') ||
            n.includes('/scheduler/') ||
            n.includes('/react/')
          ) {
            return 'vendor-react';
          }
          return undefined;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (info) => {
          const name = info.name ?? '';
          if (/\.(woff2?|ttf|eot)$/.test(name)) return 'assets/fonts/[name]-[hash].[ext]';
          if (/\.(png|jpe?g|gif|svg|webp|avif|ico)$/.test(name)) return 'assets/images/[name]-[hash].[ext]';
          if (/\.css$/.test(name)) return 'assets/css/[name]-[hash].[ext]';
          return 'assets/[ext]/[name]-[hash].[ext]';
        },
      },
    },
  },
});
