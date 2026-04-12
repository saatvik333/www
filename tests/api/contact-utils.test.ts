import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import {
  escapeHtml,
  getClientIP,
  validateOrigin,
  createRateLimiter,
} from '@/lib/contact-utils';

function makeRequest(headers: Record<string, string> = {}): NextRequest {
  return new NextRequest('https://saatvik.me/api/contact', { headers });
}

describe('escapeHtml', () => {
  it('escapes ampersands', () => {
    expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  it('escapes angle brackets', () => {
    expect(escapeHtml('<script>alert(1)</script>')).toBe(
      '&lt;script&gt;alert(1)&lt;/script&gt;',
    );
  });

  it('escapes double quotes', () => {
    expect(escapeHtml('"hello"')).toContain('&quot;');
  });

  it('escapes single quotes', () => {
    expect(escapeHtml("it's")).toMatch(/&#(39|x27);|&apos;/);
  });

  it('handles empty string', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('passes through safe text', () => {
    expect(escapeHtml('hello world')).toBe('hello world');
  });

  it('escapes multiple entities in the same string', () => {
    expect(escapeHtml('<a href="url">Tom & Jerry\'s</a>')).toBe(
      '&lt;a href=&quot;url&quot;&gt;Tom &amp; Jerry&#39;s&lt;/a&gt;',
    );
  });

  it('escapes ampersands before other entities (no double-escaping)', () => {
    expect(escapeHtml('&lt;')).toBe('&amp;lt;');
  });
});

describe('createRateLimiter', () => {
  let limiter: ReturnType<typeof createRateLimiter>;

  beforeEach(() => {
    limiter = createRateLimiter({ windowMs: 5 * 60 * 1000, maxRequests: 3 });
  });

  it('allows first request from an IP', () => {
    expect(limiter.check('192.168.1.1').allowed).toBe(true);
  });

  it('allows up to maxRequests within the window', () => {
    limiter.check('1.1.1.1');
    limiter.check('1.1.1.1');
    expect(limiter.check('1.1.1.1').allowed).toBe(true);
  });

  it('blocks the (max+1)th request within the window', () => {
    limiter.check('2.2.2.2');
    limiter.check('2.2.2.2');
    limiter.check('2.2.2.2');
    const result = limiter.check('2.2.2.2');
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it('tracks different IPs independently', () => {
    limiter.check('3.3.3.3');
    limiter.check('3.3.3.3');
    limiter.check('3.3.3.3');
    expect(limiter.check('3.3.3.3').allowed).toBe(false);
    expect(limiter.check('4.4.4.4').allowed).toBe(true);
  });

  it('resets after the window expires', () => {
    vi.useFakeTimers();
    try {
      const scopedLimiter = createRateLimiter({
        windowMs: 5 * 60 * 1000,
        maxRequests: 3,
      });
      scopedLimiter.check('5.5.5.5');
      scopedLimiter.check('5.5.5.5');
      scopedLimiter.check('5.5.5.5');
      expect(scopedLimiter.check('5.5.5.5').allowed).toBe(false);

      vi.advanceTimersByTime(5 * 60 * 1000 + 1);

      expect(scopedLimiter.check('5.5.5.5').allowed).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('reset() clears all state', () => {
    limiter.check('6.6.6.6');
    limiter.check('6.6.6.6');
    limiter.check('6.6.6.6');
    expect(limiter.check('6.6.6.6').allowed).toBe(false);
    limiter.reset();
    expect(limiter.check('6.6.6.6').allowed).toBe(true);
  });

  it('retryAfter reflects remaining seconds in window', () => {
    const custom = createRateLimiter({ windowMs: 60_000, maxRequests: 1 });
    custom.check('7.7.7.7');
    const blocked = custom.check('7.7.7.7');
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
    expect(blocked.retryAfter).toBeLessThanOrEqual(60);
  });
});

describe('validateOrigin', () => {
  it('allows requests from saatvik.me', () => {
    const req = makeRequest({ origin: 'https://saatvik.me' });
    expect(validateOrigin(req)).toBe(true);
  });

  it('allows requests from www.saatvik.me', () => {
    const req = makeRequest({ origin: 'https://www.saatvik.me' });
    expect(validateOrigin(req)).toBe(true);
  });

  it('allows localhost', () => {
    const req = makeRequest({ origin: 'http://localhost:3000' });
    expect(validateOrigin(req)).toBe(true);
  });

  it('allows 127.0.0.1', () => {
    const req = makeRequest({ origin: 'http://127.0.0.1:3000' });
    expect(validateOrigin(req)).toBe(true);
  });

  it('rejects unknown origins', () => {
    const req = makeRequest({ origin: 'https://evil.com' });
    expect(validateOrigin(req)).toBe(false);
  });

  it('rejects requests with no origin and no referer', () => {
    const req = makeRequest({});
    expect(validateOrigin(req)).toBe(false);
  });

  it('accepts referer when origin is missing', () => {
    const req = makeRequest({ referer: 'https://saatvik.me/contact' });
    expect(validateOrigin(req)).toBe(true);
  });

  it('rejects malformed origin URLs', () => {
    const req = makeRequest({ origin: 'not-a-valid-url' });
    expect(validateOrigin(req)).toBe(false);
  });

  it('rejects referer from an unknown domain even when origin is absent', () => {
    const req = makeRequest({ referer: 'https://evil.com/contact' });
    expect(validateOrigin(req)).toBe(false);
  });
});

describe('getClientIP', () => {
  it('returns cf-connecting-ip when cf-ray is present', () => {
    const req = makeRequest({
      'cf-connecting-ip': '1.2.3.4',
      'cf-ray': 'abc123',
    });
    expect(getClientIP(req)).toBe('1.2.3.4');
  });

  it('returns first x-forwarded-for IP when x-vercel-id is present', () => {
    const req = makeRequest({
      'x-forwarded-for': '5.6.7.8, 10.0.0.1',
      'x-vercel-id': 'iad1::12345',
    });
    expect(getClientIP(req)).toBe('5.6.7.8');
  });

  it('returns x-real-ip as fallback when on Vercel without x-forwarded-for', () => {
    const req = makeRequest({
      'x-real-ip': '9.9.9.9',
      'x-vercel-id': 'iad1::12345',
    });
    expect(getClientIP(req)).toBe('9.9.9.9');
  });

  it('returns unknown when no trusted proxy headers', () => {
    const req = makeRequest({});
    expect(getClientIP(req)).toBe('unknown');
  });

  it('ignores x-forwarded-for without x-vercel-id (prevents spoofing)', () => {
    const req = makeRequest({
      'x-forwarded-for': '1.2.3.4',
    });
    expect(getClientIP(req)).toBe('unknown');
  });

  it('ignores cf-connecting-ip without cf-ray (prevents spoofing)', () => {
    const req = makeRequest({
      'cf-connecting-ip': '1.2.3.4',
    });
    expect(getClientIP(req)).toBe('unknown');
  });
});
