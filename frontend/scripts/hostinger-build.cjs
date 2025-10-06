const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

(function run() {
  const viteBin = require.resolve('vite/bin/vite.js');
  const cfgPath = path.join(process.cwd(), 'vite.config.js');
  const original = fs.readFileSync(cfgPath, 'utf8');

  // Force base to '/'
  let modified = original;
  if (/base:\s*['"][^'"]*['"]/.test(original)) {
    modified = original.replace(/base:\s*['"][^'"]*['"]/g, "base: '/' ");
  } else {
    modified = original.replace(/defineConfig\(\{/, "defineConfig({\n  base: '/',");
  }
  fs.writeFileSync(cfgPath, modified);

  try {
    const apiUrl = process.env.VITE_API_URL || 'https://trust-live.onrender.com/api';
    execSync(`node "${viteBin}" build`, {
      stdio: 'inherit',
      env: { ...process.env, VITE_API_URL: apiUrl }
    });

    const indexHtml = path.join('dist', 'index.html');
    const notFoundHtml = path.join('dist', '404.html');
    if (fs.existsSync(indexHtml)) {
      fs.copyFileSync(indexHtml, notFoundHtml);
    }
  } finally {
    // Restore vite config
    fs.writeFileSync(cfgPath, original);
  }
})();
