import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('fs/promises', () => ({
  stat: vi.fn(),
  readFile: vi.fn(),
}));

import { stat, readFile } from 'fs/promises';
import { GET } from '@/app/api/content/[...path]/route';
import { NextRequest } from 'next/server';

function makeRequest(urlPath: string): NextRequest {
  return new NextRequest(`http://localhost:3000/api/content/${urlPath}`);
}

describe('Content API route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('blocks paths containing .hidden segments', async () => {
    const res = await GET(makeRequest('.hidden/file.png'), {
      params: Promise.resolve({ path: ['.hidden', 'file.png'] }),
    });
    expect(res.status).toBe(403);
  });

  it('blocks paths containing .env segments', async () => {
    const res = await GET(makeRequest('.env'), {
      params: Promise.resolve({ path: ['.env'] }),
    });
    expect(res.status).toBe(403);
  });

  it('blocks paths containing .git segments', async () => {
    const res = await GET(makeRequest('.git/config'), {
      params: Promise.resolve({ path: ['.git', 'config'] }),
    });
    expect(res.status).toBe(403);
  });

  it('blocks path traversal via ..', async () => {
    vi.mocked(stat).mockResolvedValue({ isFile: () => true } as never);
    const res = await GET(makeRequest('projects/../../etc/passwd'), {
      params: Promise.resolve({ path: ['projects', '..', '..', 'etc', 'passwd'] }),
    });
    expect(res.status).toBe(403);
  });

  it('blocks .md files even if they exist', async () => {
    vi.mocked(stat).mockResolvedValue({ isFile: () => true } as never);
    const res = await GET(makeRequest('projects/test/index.md'), {
      params: Promise.resolve({ path: ['projects', 'test', 'index.md'] }),
    });
    expect(res.status).toBe(403);
  });

  it('blocks .txt files even if they exist', async () => {
    vi.mocked(stat).mockResolvedValue({ isFile: () => true } as never);
    const res = await GET(makeRequest('projects/test/notes.txt'), {
      params: Promise.resolve({ path: ['projects', 'test', 'notes.txt'] }),
    });
    expect(res.status).toBe(403);
  });

  it('returns 404 when stat throws (file missing)', async () => {
    vi.mocked(stat).mockRejectedValue(new Error('ENOENT'));
    const res = await GET(makeRequest('projects/test/missing.png'), {
      params: Promise.resolve({ path: ['projects', 'test', 'missing.png'] }),
    });
    expect(res.status).toBe(404);
  });

  it('returns 403 when target is a directory', async () => {
    vi.mocked(stat).mockResolvedValue({ isFile: () => false } as never);
    const res = await GET(makeRequest('projects/test'), {
      params: Promise.resolve({ path: ['projects', 'test'] }),
    });
    expect(res.status).toBe(403);
  });

  it('serves a valid PNG with 200 and correct Content-Type', async () => {
    vi.mocked(stat).mockResolvedValue({ isFile: () => true } as never);
    vi.mocked(readFile).mockResolvedValue(Buffer.from('png-bytes'));
    const res = await GET(makeRequest('projects/test/image.png'), {
      params: Promise.resolve({ path: ['projects', 'test', 'image.png'] }),
    });
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('image/png');
  });

  it('serves a valid JPEG with image/jpeg Content-Type', async () => {
    vi.mocked(stat).mockResolvedValue({ isFile: () => true } as never);
    vi.mocked(readFile).mockResolvedValue(Buffer.from('jpg-bytes'));
    const res = await GET(makeRequest('projects/test/photo.jpg'), {
      params: Promise.resolve({ path: ['projects', 'test', 'photo.jpg'] }),
    });
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('image/jpeg');
  });

  it('serves SVG with restrictive CSP header', async () => {
    vi.mocked(stat).mockResolvedValue({ isFile: () => true } as never);
    vi.mocked(readFile).mockResolvedValue(Buffer.from('<svg></svg>'));
    const res = await GET(makeRequest('projects/test/icon.svg'), {
      params: Promise.resolve({ path: ['projects', 'test', 'icon.svg'] }),
    });
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('image/svg+xml');
    expect(res.headers.get('Content-Security-Policy')).toContain("default-src 'none'");
  });

  it('sets a Cache-Control header on successful responses', async () => {
    vi.mocked(stat).mockResolvedValue({ isFile: () => true } as never);
    vi.mocked(readFile).mockResolvedValue(Buffer.from('bytes'));
    const res = await GET(makeRequest('projects/test/image.webp'), {
      params: Promise.resolve({ path: ['projects', 'test', 'image.webp'] }),
    });
    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toBeTruthy();
  });
});
