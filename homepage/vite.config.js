import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
const isPages = process.env.GITHUB_PAGES === 'true' || process.env.DEPLOY_TARGET === 'gh-pages';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (isPages ? '/homelab/' : './');

export default defineConfig({
  plugins: [vue()],
  base: basePath,
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});
