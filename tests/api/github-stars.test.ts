import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/github', () => ({
  getRepoStars: vi.fn().mockResolvedValue(42),
}));

import { GET } from '@/app/api/github/stars/route';
import { NextRequest } from 'next/server';
import { getRepoStars } from '@/lib/github';

function makeRequest(query: string): NextRequest {
  return new NextRequest(`http://localhost:3000/api/github/stars?${query}`);
}

describe('GitHub Stars API validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getRepoStars).mockResolvedValue(42);
  });

  it('rejects missing owner parameter', async () => {
    const res = await GET(makeRequest('repo=test'));
    expect(res.status).toBe(400);
  });

  it('rejects missing repo parameter', async () => {
    const res = await GET(makeRequest('owner=test'));
    expect(res.status).toBe(400);
  });

  it('rejects both parameters missing', async () => {
    const res = await GET(makeRequest(''));
    expect(res.status).toBe(400);
  });

  it('rejects owner with forward slash (path traversal attempt)', async () => {
    const res = await GET(makeRequest('owner=..%2Fetc&repo=test'));
    expect(res.status).toBe(400);
  });

  it('rejects owner with forward slash', async () => {
    const res = await GET(makeRequest('owner=foo%2Fbar&repo=test'));
    expect(res.status).toBe(400);
  });

  it('rejects owner with special characters', async () => {
    const res = await GET(makeRequest('owner=foo%40bar&repo=test'));
    expect(res.status).toBe(400);
  });

  it('rejects owner with spaces', async () => {
    const res = await GET(makeRequest('owner=foo%20bar&repo=test'));
    expect(res.status).toBe(400);
  });

  it('rejects owner exceeding 39 characters', async () => {
    const longOwner = 'a'.repeat(40);
    const res = await GET(makeRequest(`owner=${longOwner}&repo=test`));
    expect(res.status).toBe(400);
  });

  it('rejects repo exceeding 100 characters', async () => {
    const longRepo = 'a'.repeat(101);
    const res = await GET(makeRequest(`owner=test&repo=${longRepo}`));
    expect(res.status).toBe(400);
  });

  it('rejects repo with special characters', async () => {
    const res = await GET(makeRequest('owner=test&repo=foo%2Fbar'));
    expect(res.status).toBe(400);
  });

  it('accepts valid owner and repo, returning star count', async () => {
    const res = await GET(makeRequest('owner=saatvik333&repo=www'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.stars).toBe(42);
    expect(getRepoStars).toHaveBeenCalledWith('saatvik333', 'www');
  });

  it('accepts owner/repo with allowed characters (._-)', async () => {
    const res = await GET(makeRequest('owner=my-user_123.x&repo=my-repo_1.0'));
    expect(res.status).toBe(200);
  });

  it('returns stars: 0 when getRepoStars resolves null', async () => {
    vi.mocked(getRepoStars).mockResolvedValueOnce(null);
    const res = await GET(makeRequest('owner=test&repo=test'));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.stars).toBe(0);
  });

  it('sets a Cache-Control header on successful responses', async () => {
    const res = await GET(makeRequest('owner=test&repo=test'));
    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toContain('s-maxage');
  });
});
