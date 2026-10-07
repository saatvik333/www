import assert from 'node:assert/strict';
const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
async function fetchSite(path, options = {}) {
  return fetch(`${base}${path}`, { ...options, signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'www-production-smoke/1.0', ...options.headers } });
}
// Allow a locally started production server time to become ready.
for (let attempt = 0; ; attempt++) {
  try { const response = await fetchSite('/'); if (response.ok) break; } catch {}
  if (attempt >= 30) throw new Error(`Server did not become ready: ${base}`);
  await new Promise(resolve => setTimeout(resolve, 500));
}
const pages = {};
for (const path of ['/', '/projects', '/pics', '/contact']) {
  const response = await fetchSite(path); assert.equal(response.status, 200, path);
  pages[path] = await response.text(); console.log(`PASS ${path}`);
}
const icons = [...pages['/'].matchAll(/<link\b[^>]*rel="icon"[^>]*href="([^"]+)"[^>]*>|<link\b[^>]*href="([^"]+)"[^>]*rel="icon"[^>]*>/g)];
assert.ok(icons.length, 'favicon declaration missing');
const iconPath = (icons[0][1] || icons[0][2]).replaceAll('&amp;', '&');
const iconResponse = await fetchSite(iconPath); assert.equal(iconResponse.status, 200);
const svg = await iconResponse.text(); assert.ok(svg.includes('#3584e4'));
for (const match of svg.matchAll(/<!--([\s\S]*?)-->/g)) assert.ok(!match[1].includes('--'), 'invalid SVG XML comment');
console.log('PASS theme favicon');
const manifest = await (await fetchSite('/manifest.json')).json();
assert.ok(manifest.icons.some(icon => icon.src === iconPath)); console.log('PASS manifest favicon');
const images = [...pages['/pics'].matchAll(/<img\b[^>]*>/g)];
assert.ok(images.length > 0, 'gallery must render images without JavaScript');
const src = images[0][0].match(/\bsrc="([^"]+)"/)[1].replaceAll('&amp;', '&');
const photo = await fetchSite(src); assert.equal(photo.status, 200); assert.ok(photo.headers.get('content-type')?.startsWith('image/'));
console.log(`PASS ${images.length} gallery images in initial HTML; first optimized image loads`);
const optimizer = new URL(src, base);
const arbitrarySource = new URL(optimizer.searchParams.get('url'), base);
arbitrarySource.search = '?v=unapproved';
optimizer.searchParams.set('url', arbitrarySource.pathname + arbitrarySource.search);
assert.equal((await fetchSite(optimizer.pathname + optimizer.search)).status, 400);
console.log('PASS optimizer rejects unapproved cache-busting queries');
const projectImage = pages['/projects'].match(/<img\b[^>]*\bsrc="([^"]+)"/)[1].replaceAll('&amp;', '&');
const contentPath = new URL(projectImage, base).searchParams.get('url');
const asset = await fetchSite(contentPath); assert.equal(asset.status, 200);
assert.ok(!asset.headers.get('cache-control')?.includes('immutable'));
const etag = asset.headers.get('etag'); assert.ok(etag);
assert.equal((await fetchSite(contentPath, { headers: { 'If-None-Match': etag } })).status, 304);
console.log('PASS project assets revalidate using ETag');
const feedResponse = await fetchSite('/feed'); assert.equal(feedResponse.status, 200);
assert.ok((await feedResponse.text()).includes('<rss ')); console.log('PASS RSS');
for (const path of ['/content/smoke-missing.png', '/smoke-missing.svg']) {
  const missing = await fetchSite(`${path}?smoke=${Date.now()}`);
  assert.equal(missing.status, 404); assert.ok(!missing.headers.get('cache-control')?.includes('immutable'));
  console.log(`PASS missing asset is not immutable: ${path}`);
}
const contact = await fetchSite('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://untrusted.example', Referer: `${base}/contact` }, body: '{}' });
assert.equal(contact.status, 403); console.log('PASS contact rejects untrusted Origin without sending email');
const worker = await fetchSite('/sw.js'); assert.equal(worker.status, 200);
assert.ok((await worker.text()).includes('precacheAndRoute')); console.log('PASS generated PWA service worker');
