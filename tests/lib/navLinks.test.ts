import { describe, it, expect } from 'vitest';
import { isLinkActive } from '@/lib/navLinks';

describe('isLinkActive', () => {
  it('matches exact path', () => {
    expect(isLinkActive('/about', '/about')).toBe(true);
  });

  it('matches child path', () => {
    expect(isLinkActive('/blog/my-post', '/blog')).toBe(true);
  });

  it('matches nested child path', () => {
    expect(isLinkActive('/projects/foo/bar', '/projects')).toBe(true);
  });

  it('does not match unrelated path', () => {
    expect(isLinkActive('/about', '/blog')).toBe(false);
  });

  it('does not match similar prefix (partial)', () => {
    // /blogpost should NOT match /blog
    expect(isLinkActive('/blogpost', '/blog')).toBe(false);
  });

  it('matches root path exactly', () => {
    expect(isLinkActive('/', '/')).toBe(true);
  });
});
