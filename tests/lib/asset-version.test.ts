import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { it, expect } from 'vitest';
import { getAssetVersion } from '@/lib/asset-version';
it('invalidates image URLs when bytes change under the same filename', () => {
  const dir = mkdtempSync(join(tmpdir(), 'www-assets-'));
  try {
    const path = join(dir, 'photo.png'); writeFileSync(path, 'first');
    const first = getAssetVersion(path); expect(getAssetVersion(path)).toBe(first);
    writeFileSync(path, 'second'); expect(getAssetVersion(path)).not.toBe(first);
  } finally { rmSync(dir, { recursive: true }); }
});
