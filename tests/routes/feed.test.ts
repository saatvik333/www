import { describe, it, expect } from 'vitest';
import { escapeXml } from '@/lib/xml-utils';

describe('escapeXml', () => {
  it('escapes ampersand', () => {
    expect(escapeXml('a & b')).toBe('a &amp; b');
  });

  it('escapes angle brackets', () => {
    expect(escapeXml('<tag>')).toBe('&lt;tag&gt;');
  });

  it('escapes double quotes', () => {
    expect(escapeXml('"hello"')).toBe('&quot;hello&quot;');
  });

  it('escapes single quotes', () => {
    expect(escapeXml("it's")).toBe('it&apos;s');
  });

  it('handles empty string', () => {
    expect(escapeXml('')).toBe('');
  });

  it('passes safe characters through', () => {
    expect(escapeXml('hello-world_123')).toBe('hello-world_123');
  });
});
