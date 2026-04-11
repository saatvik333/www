import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
    const stats = fs.statSync(resolvedPath);
    if (!stats.isFile()) {
      return new NextResponse('Forbidden (Is a Directory)', { status: 403 });
    }
  } catch {
    // fs.statSync throws if the file does not exist
    return new NextResponse('Not Found', { status: 404 });
  }

  // Security: only allow explicit asset extensions
  const ext = path.extname(resolvedPath).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Read file
  const fileBuffer = fs.readFileSync(resolvedPath);

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

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': cacheControl,
    },
  });
}
