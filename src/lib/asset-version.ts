import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Content is read at build time. A byte-derived version changes when an image
// changes, even if its filename stays the same, invalidating optimizer/SW/CDN caches.
export function getAssetVersion(filePath: string): string {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex').slice(0, 16);
}

const collectionVersions = new Map<string, string>();

// One version per collection keeps the optimizer's exact query allowlist small
// (Next.js permits at most 25 local patterns). Recomputed on each production build.
export function getImageCollectionVersion(directory: string): string {
  const cached = collectionVersions.get(directory);
  if (cached) return cached;
  const hash = createHash('sha256');
  function walk(folder: string, prefix: string) {
    if (!existsSync(folder)) return;
    for (const entry of readdirSync(folder, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (entry.name.startsWith('.')) continue;
      const file = join(folder, entry.name);
      const name = `${prefix}/${entry.name}`;
      if (entry.isDirectory()) walk(file, name);
      else if (entry.isFile() && /\.(png|jpe?g|webp|gif|avif)$/i.test(entry.name)) hash.update(name).update('\0').update(getAssetVersion(file));
    }
  }
  walk(directory, '');
  const version = hash.digest('hex').slice(0, 16);
  collectionVersions.set(directory, version);
  return version;
}
