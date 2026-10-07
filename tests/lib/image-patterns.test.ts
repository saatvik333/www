import { describe, it, expect } from 'vitest';
import { getLocalImagePatterns } from '@/lib/image-patterns';
import { getPhotos } from '@/lib/photos';
import { getAllProjects } from '@/lib/content';
describe('optimizer collection versions', () => {
  it('allows the versions emitted by gallery and project metadata within the framework limit', async () => {
    const patterns = getLocalImagePatterns();
    expect(patterns.length).toBeLessThanOrEqual(25);
    const photos = await getPhotos();
    for (const photo of photos) {
      expect(patterns).toContainEqual({ pathname: '/pics/**', search: `?v=${photo.version}` });
    }
    for (const project of getAllProjects()) {
      for (const src of [...project.images, ...(project.thumbnail ? [project.thumbnail] : [])]) {
        expect(patterns).toContainEqual({ pathname: '/content/**', search: new URL(src, 'https://saatvik.me').search });
      }
    }
    expect(patterns.every(pattern => pattern.search !== undefined)).toBe(true);
  });
});
