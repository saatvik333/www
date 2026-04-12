import { NextRequest, NextResponse } from 'next/server';
import { stat, readFile } from 'fs/promises';
import path from 'path';

/**
 * Content file serving API with defense-in-depth against path traversal.
 *
 * Three layers of protection:
 * 1. Hidden segment blocking: rejects any path containing segments starting with `.`
 * 2. Resolved path boundary check: uses `path.resolve()` + prefix check with
 *    `path.sep` to prevent `/content-secrets/file.png` bypassing `/content`
 * 3. Extension allowlist: only whitelisted image formats are served
 *
 * SVGs are served with a restrictive per-response CSP (`default-src 'none'`) to
 * mitigate embedded script execution in case a malicious SVG is ever added.
 */

// Allowed asset extensions - explicitly deny markdown and config files
const ALLOWED_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.svg',
  '.avif',
]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;

  // Security: block any path containing hidden segments
  for (const segment of pathSegments) {
    if (segment.startsWith('.') || segment.includes('/.')) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  const filePath = path.join(process.cwd(), 'content', ...pathSegments);

  // Security: prevent directory traversal
  const contentDir = path.join(process.cwd(), 'content');
  const resolvedPath = path.resolve(filePath);

  // Explicitly require it to be inside the content directory by appending the path separator
  // This prevents bypasses like requesting `/content-secrets/file.png` which would otherwise
  // satisfy `.startsWith('/content')`
  if (!resolvedPath.startsWith(contentDir + path.sep) && resolvedPath !== contentDir) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Check if file exists and is actually a file, not a directory
  try {
    const stats = await stat(resolvedPath);
    if (!stats.isFile()) {
      return new NextResponse('Forbidden (Is a Directory)', { status: 403 });
    }
  } catch {
    // stat() throws if the file does not exist
    return new NextResponse('Not Found', { status: 404 });
  }

  // Security: only allow explicit asset extensions
  const ext = path.extname(resolvedPath).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Read file
  const fileBuffer = await readFile(resolvedPath);

  // Determine content type
  const contentTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.avif': 'image/avif',
  };

  const contentType = contentTypes[ext] || 'application/octet-stream';

  // Use no-cache in development for hot-reload to work
  const isDev = process.env.NODE_ENV === 'development';
  const cacheControl = isDev
    ? 'no-cache, no-store, must-revalidate'
    : 'public, max-age=31536000, immutable';

  const headers: Record<string, string> = {
    'Content-Type': contentType,
    'Cache-Control': cacheControl,
  };

  // SVGs can contain executable scripts -- serve with restrictive CSP
  if (ext === '.svg') {
    headers['Content-Security-Policy'] = "default-src 'none'; style-src 'unsafe-inline'";
  }

  return new NextResponse(fileBuffer, { status: 200, headers });
}
