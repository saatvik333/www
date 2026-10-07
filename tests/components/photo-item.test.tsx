import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { PhotoItem } from '@/components/ui/PhotoItem';
describe('gallery progressive rendering', () => {
  it('renders a real lazy image and full-resolution link before hydration', () => {
    const html = renderToStaticMarkup(<PhotoItem photo={{ id: 'photo', src: 'photo one.jpg', alt: 'Mountain', width: 1200, height: 800, version: 'abc123' }} />);
    const container = document.createElement('div'); container.innerHTML = html;
    const image = container.querySelector('img');
    expect(image?.alt).toBe('Mountain'); expect(image?.loading).toBe('lazy');
    expect(image?.getAttribute('width')).toBe('1200'); expect(image?.getAttribute('height')).toBe('800');
    expect(container.querySelector('a')?.getAttribute('href')).toBe('/pics/photo%20one.jpg?v=abc123');
    expect(image?.getAttribute('src')).toContain('abc123');
  });
});
