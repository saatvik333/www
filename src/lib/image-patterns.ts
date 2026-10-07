import { join } from 'node:path';
import { getImageCollectionVersion } from './asset-version';

// Build an exact optimizer allowlist. Arbitrary cache-busting queries must not
// let callers repeatedly optimize the same image under unlimited cache keys.
export function getLocalImagePatterns(): { pathname: string; search: string }[] {
  return [
    { pathname: '/pics/**', search: '' },
    { pathname: '/content/**', search: '' },
    { pathname: '/pics/**', search: `?v=${getImageCollectionVersion(join(process.cwd(), 'public', 'pics'))}` },
    { pathname: '/content/**', search: `?v=${getImageCollectionVersion(join(process.cwd(), 'content'))}` },
  ];
}
