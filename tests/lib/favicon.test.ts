import { readdirSync, readFileSync } from 'node:fs';
import sharp from 'sharp';
import { describe, it, expect } from 'vitest';
import { COLORS } from '@/lib/config';
describe('favicon assets', () => {
  it('rejects the invalid XML comment that caused the production bug', async () => {
    await expect(sharp(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><!-- broken -- comment --></svg>')).png().toBuffer()).rejects.toThrow();
  });
  for (const file of readdirSync('public').filter(name => /^icon.*\.svg$/.test(name))) {
    it(`${file} is valid rasterizable SVG in the theme accent`, async () => {
      const svg = readFileSync(`public/${file}`); expect(svg.toString()).toContain(COLORS.accent);
      const { data, info } = await sharp(svg).resize(32, 32).raw().toBuffer({ resolveWithObject: true });
      let blue = 0; let red = 0;
      for (let i = 0; i < data.length; i += info.channels) {
        if (data[i + 2] > data[i] + 50) blue++;
        if (data[i] > data[i + 2] + 50) red++;
      }
      expect(blue).toBeGreaterThan(0); expect(red).toBe(0);
    });
  }
});
