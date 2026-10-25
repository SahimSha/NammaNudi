const { execSync } = require('child_process');
try {
  execSync('node --experimental-strip-types scripts/test-conversations.mjs', { stdio: 'inherit' });
} catch {
  process.exit(1);
}
