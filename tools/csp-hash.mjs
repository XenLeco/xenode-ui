/**
 * Recomputes the CSP hash for the inline theme-init script in index.html and
 * writes it into public/_headers. If a build output exists, also verifies the
 * built HTML files still carry byte-identical script content — the hash must
 * match what is actually served, not just the source.
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const indexPath = join(root, 'projects/portfolio/src/index.html');
const headersPath = join(root, 'projects/portfolio/public/_headers');
const distDir = join(root, 'dist/portfolio/browser');

const scriptContent = (html, file) => {
  const match = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!match) {
    console.error(`No inline <script> found in ${file}`);
    process.exit(1);
  }
  return match[1];
};

const hashOf = (text) => createHash('sha256').update(text, 'utf8').digest('base64');

const sourceScript = scriptContent(readFileSync(indexPath, 'utf8'), indexPath);
const token = `'sha256-${hashOf(sourceScript)}'`;

const headers = readFileSync(headersPath, 'utf8');
const updated = headers.replace(/'sha256-[^']+'/g, token);
if (!updated.includes(token)) {
  console.error('_headers contains no sha256 token to replace');
  process.exit(1);
}
if (updated !== headers) {
  writeFileSync(headersPath, updated);
  console.log(`_headers updated with ${token}`);
} else {
  console.log(`_headers already carries ${token}`);
}

if (existsSync(distDir)) {
  const htmlFiles = readdirSync(distDir, { recursive: true })
    .map(String)
    .filter((f) => f.endsWith('.html') && f !== '_headers');
  let mismatches = 0;
  for (const file of htmlFiles) {
    const full = join(distDir, file);
    const built = scriptContent(readFileSync(full, 'utf8'), full);
    if (hashOf(built) !== hashOf(sourceScript)) {
      console.error(`MISMATCH: ${file} — built inline script differs from source; served hash would not match the CSP`);
      mismatches++;
    }
  }
  if (mismatches > 0) process.exit(1);
  console.log(`Verified ${htmlFiles.length} built HTML file(s) carry the hashed script byte-identically.`);
} else {
  console.log('No dist output found — run the build and re-run this to verify served bytes.');
}
