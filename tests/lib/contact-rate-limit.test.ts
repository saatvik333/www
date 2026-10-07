import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
vi.mock('@vercel/firewall', () => ({ checkRateLimit: vi.fn() }));
import { checkRateLimit } from '@vercel/firewall';
import { checkContactRateLimit } from '@/lib/contact-rate-limit';
import { NextRequest } from 'next/server';
const request = new NextRequest('https://saatvik.me/api/contact');
beforeEach(() => vi.clearAllMocks());
afterEach(() => vi.unstubAllEnvs());
describe('shared contact rate limit', () => {
  it('uses the verified client identity in the configured Vercel bucket', async () => {
    vi.stubEnv('VERCEL', '1'); vi.mocked(checkRateLimit).mockResolvedValue({ rateLimited: false });
    expect(await checkContactRateLimit(request, '203.0.113.1')).toEqual({ allowed: true });
    expect(checkRateLimit).toHaveBeenCalledWith('contact-form', { request, rateLimitKey: '203.0.113.1', timeout: 3000 });
  });
  it('blocks when the shared bucket is exhausted', async () => {
    vi.stubEnv('VERCEL', '1'); vi.mocked(checkRateLimit).mockResolvedValue({ rateLimited: true });
    expect((await checkContactRateLimit(request, '203.0.113.1')).allowed).toBe(false);
  });
  it('fails closed if the rule is missing', async () => {
    vi.stubEnv('VERCEL', '1'); vi.mocked(checkRateLimit).mockResolvedValue({ rateLimited: false, error: 'not-found' });
    await expect(checkContactRateLimit(request, '203.0.113.1')).rejects.toThrow();
  });
  it('uses the local limiter without cloud calls during development', async () => {
    vi.stubEnv('VERCEL', '');
    for (let i = 0; i < 3; i++) expect((await checkContactRateLimit(request, 'fixture')).allowed).toBe(true);
    expect((await checkContactRateLimit(request, 'fixture')).allowed).toBe(false);
    expect(checkRateLimit).not.toHaveBeenCalled();
  });
});
