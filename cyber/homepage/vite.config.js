import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const isGhPages = process.env.GITHUB_PAGES === 'true' || process.env.DEPLOY_TARGET === 'gh-pages';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (isGhPages ? '/cyberlab/' : '/');

export default defineConfig({
  plugins: [vue()],
  base: basePath,
  server: {
    port: 8086,
    host: '0.0.0.0'
  }
});
