/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  basePath: process.env.GITHUB_PAGES === 'true' ? '/homelab' : '',
  transpilePackages: ['three'],
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
