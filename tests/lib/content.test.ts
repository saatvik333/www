import { describe, it, expect } from 'vitest';
import { getProject, getBlog, getReadingTime } from '@/lib/content';

describe('getReadingTime', () => {
  it('returns a "min read" string for empty content', () => {
    // Empty string split by whitespace yields [""] -> 1 word -> 1 min
    expect(getReadingTime('')).toBe('1 min read');
  });

  it('returns 1 min for very short text', () => {
    expect(getReadingTime('hello world')).toBe('1 min read');
  });

  it('returns 1 min for ~200-word content', () => {
    const words = Array(200).fill('word').join(' ');
    expect(getReadingTime(words)).toBe('1 min read');
  });

  it('returns 2 min for ~400-word content', () => {
    const words = Array(400).fill('word').join(' ');
    expect(getReadingTime(words)).toBe('2 min read');
  });

  it('rounds up fractional minutes (201 words -> 2 min)', () => {
    const words = Array(201).fill('word').join(' ');
    expect(getReadingTime(words)).toBe('2 min read');
  });

  it('handles multi-line input with mixed whitespace', () => {
    const words = Array(400).fill('word').join('\n');
    expect(getReadingTime(words)).toBe('2 min read');
  });
});

describe('getProject slug validation', () => {
  it('returns null for empty slug', async () => {
    await expect(getProject('')).resolves.toBeNull();
  });

  it('returns null for slug containing ..', async () => {
    await expect(getProject('..')).resolves.toBeNull();
  });

  it('returns null for slug with traversal fragment', async () => {
    await expect(getProject('foo/../bar')).resolves.toBeNull();
  });

  it('returns null for slug containing forward slash', async () => {
    await expect(getProject('foo/bar')).resolves.toBeNull();
  });

  it('returns null for slug containing backslash', async () => {
    await expect(getProject('foo\\bar')).resolves.toBeNull();
  });

  it('returns null for a nonexistent (but otherwise safe) slug', async () => {
    await expect(
      getProject('this-project-definitely-does-not-exist-xyz123')
    ).resolves.toBeNull();
  });
});

describe('getBlog slug validation', () => {
  it('returns null for empty slug', async () => {
    await expect(getBlog('')).resolves.toBeNull();
  });

  it('returns null for slug containing ..', async () => {
    await expect(getBlog('..')).resolves.toBeNull();
  });

  it('returns null for slug containing forward slash', async () => {
    await expect(getBlog('foo/bar')).resolves.toBeNull();
  });

  it('returns null for slug containing backslash', async () => {
    await expect(getBlog('foo\\bar')).resolves.toBeNull();
  });

  it('returns null for a nonexistent (but otherwise safe) slug', async () => {
    await expect(
      getBlog('this-blog-definitely-does-not-exist-xyz123')
    ).resolves.toBeNull();
  });
});
