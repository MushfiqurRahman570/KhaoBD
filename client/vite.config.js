import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
      // In dev, forward these to the backend's dynamic routes (see
      // server/src/routes/seoRoutes.js). In production, configure your
      // reverse proxy / hosting rewrites to do the same — see README "SEO".
      '/sitemap.xml': 'http://localhost:5000',
      '/robots.txt': 'http://localhost:5000',
    },
  },
});
