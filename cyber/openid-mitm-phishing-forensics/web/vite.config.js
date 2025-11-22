import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const isPages = process.env.GITHUB_PAGES === 'true' || process.env.DEPLOY_TARGET === 'gh-pages';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (isPages ? '/OpenID-MITM-Phishing-Forensics/' : './');

export default defineConfig({
  plugins: [vue()],
  base: basePath,
  server: {
    port: 8087
  }
});
