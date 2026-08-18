import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const webDir = __dirname;
const homepageDir = path.resolve(__dirname, '../homepage');
const webDistDir = path.resolve(webDir, 'dist');
const wikiDistDir = path.resolve(webDistDir, 'wiki');
const homepageDistInWeb = path.resolve(webDistDir, 'homepage');
const homepageDistDir = path.resolve(homepageDir, 'dist');

console.log('🚀 [Build-All] Starting unified build for GitHub Pages...');

// Step 1: Build Web Wiki (outDir: dist/wiki with base /homelab/wiki/)
console.log('📦 [1/3] Building Web Wiki Knowledge Base...');
execSync('npx vite build --base=/homelab/wiki/ --outDir=dist/wiki', {
  cwd: webDir,
  stdio: 'inherit',
  env: { ...process.env, GITHUB_PAGES: 'true', DEPLOY_TARGET: 'gh-pages' }
});

// Step 2: Ensure homepage dependencies and build Homepage (outDir: homepage/dist with base /homelab/)
console.log('🏠 [2/3] Building Homepage & Services Dashboard...');
if (!fs.existsSync(path.join(homepageDir, 'node_modules'))) {
  console.log('📦 Installing homepage dependencies...');
  execSync('npm install', {
    cwd: homepageDir,
    stdio: 'inherit'
  });
}

execSync('npm run build', {
  cwd: homepageDir,
  stdio: 'inherit',
  env: { ...process.env, GITHUB_PAGES: 'true', DEPLOY_TARGET: 'gh-pages', NEXT_PUBLIC_BASE_PATH: '/homelab/' }
});

// Step 3: Copy Homepage dist to web/dist root and web/dist/homepage
console.log('📑 [3/3] Assembling combined GitHub Pages bundle in web/dist...');

function copyFolderRecursive(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  const files = fs.readdirSync(source);
  for (const file of files) {
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursive(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  }
}

// Copy homepage assets and index.html to web/dist (root)
if (fs.existsSync(homepageDistDir)) {
  const hpFiles = fs.readdirSync(homepageDistDir);
  for (const file of hpFiles) {
    const src = path.join(homepageDistDir, file);
    const dest = path.join(webDistDir, file);
    if (fs.lstatSync(src).isDirectory()) {
      copyFolderRecursive(src, dest);
    } else {
      fs.copyFileSync(src, dest);
    }
  }
  // Also mirror to dist/homepage
  copyFolderRecursive(homepageDistDir, homepageDistInWeb);
}

// Ensure .nojekyll and 404.html
fs.writeFileSync(path.join(webDistDir, '.nojekyll'), '');
if (fs.existsSync(path.join(webDistDir, 'index.html'))) {
  fs.copyFileSync(path.join(webDistDir, 'index.html'), path.join(webDistDir, '404.html'));
}

console.log('✅ [Build-All] GitHub Pages bundle successfully created in web/dist!');
console.log('   - Root / -> Homepage Dashboard');
console.log('   - /homepage/ -> Homepage Dashboard');
console.log('   - /wiki/ -> Markdown Docs & Knowledge Base');
