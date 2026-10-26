const { execSync } = require('child_process');
try {
  execSync('node --experimental-strip-types scripts/test-srs.mjs', { stdio: 'inherit' });
} catch {
  process.exit(1);
}
