import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  const filePath = path.join(process.cwd(), 'content', ...pathSegments);

  // Security: prevent directory traversal
  const contentDir = path.join(process.cwd(), 'content');
  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(contentDir)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Check if file exists
  if (!fs.existsSync(resolvedPath)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // Read file
  const fileBuffer = fs.readFileSync(resolvedPath);

  // Determine content type
  const ext = path.extname(resolvedPath).toLowerCase();
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
