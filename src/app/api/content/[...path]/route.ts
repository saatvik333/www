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
  const errorResponse = (message: string, status: number) => new NextResponse(message, { status, headers: { 'Cache-Control': 'no-store' } });
  const { path: pathSegments } = await params;

  // Security: block any path containing hidden segments
  for (const segment of pathSegments) {
    if (segment.startsWith('.') || segment.includes('/.')) {
      return errorResponse('Forbidden', 403);
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
    return errorResponse('Forbidden', 403);
  }

  // Check if file exists and is actually a file, not a directory
  let stats;
  try {
    stats = await stat(resolvedPath);
    if (!stats.isFile()) {
      return errorResponse('Forbidden (Is a Directory)', 403);
    }
  } catch {
    // stat() throws if the file does not exist
    return errorResponse('Not Found', 404);
  }

  // Security: only allow explicit asset extensions
  const ext = path.extname(resolvedPath).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return errorResponse('Forbidden', 403);
  }

  // Read file
  // A weak stat-derived validator avoids reading/sending the file on repeat requests.
  const etag = `W/"${stats.size}-${stats.mtimeMs}"`;
  const cacheControl = process.env.NODE_ENV === 'development'
    ? 'no-cache, no-store, must-revalidate'
    : 'public, max-age=0, must-revalidate';
  if (request.headers.get('if-none-match')?.split(',').map(value => value.trim()).includes(etag)) {
    return new NextResponse(null, { status: 304, headers: { ETag: etag, 'Cache-Control': cacheControl } });
  }
  let fileBuffer;
  try {
    fileBuffer = await readFile(resolvedPath);
  } catch {
    return errorResponse('Not Found', 404);
  }

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
  const headers: Record<string, string> = {
    'Content-Type': contentType,
    'Cache-Control': cacheControl,
    'ETag': etag,
  };

  // SVGs can contain executable scripts -- serve with restrictive CSP
  if (ext === '.svg') {
    headers['Content-Security-Policy'] = "default-src 'none'; style-src 'unsafe-inline'";
  }

  return new NextResponse(fileBuffer, { status: 200, headers });
}
