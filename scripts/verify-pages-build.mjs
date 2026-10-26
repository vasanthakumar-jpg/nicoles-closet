import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { createHash } from 'node:crypto';

const base = '/nicoles-closet/';
const htmlArgument = process.argv.indexOf('--html');
const htmlFile = htmlArgument >= 0 ? process.argv[htmlArgument + 1] : 'dist/index.html';
const html = readFileSync(htmlFile, 'utf8');
const dist = resolve('dist');

assert(!/%BASE_URL%|\/src\/|\.tsx(?:["'?])/i.test(html),
  'Unbuilt source HTML detected. GitHub Pages must publish dist/index.html after npm run build.');
const urls = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map(match => match[1]);
assert(urls.some(url => url.startsWith(`${base}assets/`) && url.endsWith('.js')),
  'Missing compiled Vite JavaScript under /nicoles-closet/assets/.');
assert(urls.some(url => url.startsWith(`${base}assets/`) && url.endsWith('.css')),
  'Missing compiled Vite stylesheet under /nicoles-closet/assets/.');
for (const url of urls) {
  const resolved = new URL(url, `https://pages.invalid${base}`);
  assert(resolved.origin === 'https://pages.invalid' && resolved.pathname.startsWith(base),
    `Asset URL escapes the production base: ${url}`);
  const file = resolve(dist, decodeURIComponent(resolved.pathname.slice(base.length)));
  assert(file.startsWith(dist + sep) && existsSync(file), `Missing built asset: ${url}`);
}
for (const file of readdirSync('public/media')) {
  const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
  assert.equal(hash(`public/media/${file}`), hash(`dist/media/${file}`), `Missing or modified media: ${file}`);
}
console.log('Verified dist/index.html: compiled /nicoles-closet/assets/ references, no source/placeholder URLs, and all media preserved.');
