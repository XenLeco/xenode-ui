// Copies the prerendered /404 route to 404.html, which is what Cloudflare's
// not_found_handling: "404-page" serves for unknown paths. Fails loudly if
// the route was not prerendered — a 404 handler with nothing to serve is a
// silent production bug.
import { copyFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const source = join(root, 'dist/portfolio/browser/404/index.html');
const target = join(root, 'dist/portfolio/browser/404.html');

if (!existsSync(source)) {
  console.error('dist/portfolio/browser/404/index.html missing — the 404 route was not prerendered.');
  process.exit(1);
}
copyFileSync(source, target);
console.log('404.html placed at the assets root.');
