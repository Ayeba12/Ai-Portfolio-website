import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  // Use /Ai-Portfolio-website/ as base if building for GitHub Pages, 
  // otherwise use / (root) for Netlify and local dev.
  const base = process.env.GH_PAGES ? '/Ai-Portfolio-website/' : '/';

  return {
    base,
    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    plugins: [react()],
    define: {
      // 'process.env': {} // handled by import.meta.env
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
