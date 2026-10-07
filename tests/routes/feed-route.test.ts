import { describe, it, expect, vi } from 'vitest';
vi.mock('@/lib/content', () => ({ getAllBlogs: vi.fn() }));
import { getAllBlogs } from '@/lib/content';
import { GET } from '@/app/feed/route';
describe('RSS route', () => {
  it('orders posts by publication date independently of pinned order and includes updates in lastBuildDate', async () => {
    vi.mocked(getAllBlogs).mockReturnValue([
      { slug: 'old', title: 'Pinned', description: '', date: '2025-01-01', pinned: true, readingTime: '1 min read' },
      { slug: 'new', title: 'Newer', description: '', date: '2026-01-01', updatedAt: '2026-10-01', readingTime: '1 min read' },
    ]);
    const response = await GET(); const xml = await response.text();
    expect(response.headers.get('content-type')).toBe('application/xml');
    expect(xml.indexOf('/blog/new')).toBeLessThan(xml.indexOf('/blog/old'));
    expect(xml).toContain('<lastBuildDate>Thu, 01 Oct 2026 00:00:00 GMT</lastBuildDate>');
  });
  it('escapes CDATA boundaries and URL XML characters', async () => {
    vi.mocked(getAllBlogs).mockReturnValue([{ slug: 'a&b', title: ']]>', description: ']]>', date: '2026-01-01', readingTime: '1 min read' }]);
    const xml = await (await GET()).text();
    expect(xml).toContain(']]]]><![CDATA[>'); expect(xml).toContain('/blog/a&amp;b');
  });
  it('handles an empty feed', async () => {
    vi.mocked(getAllBlogs).mockReturnValue([]);
    expect(await (await GET()).text()).toContain('<lastBuildDate>Wed, 01 Jan 2025 00:00:00 GMT</lastBuildDate>');
  });
});
