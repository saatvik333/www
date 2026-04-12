import { NextRequest, NextResponse } from 'next/server';
import { getRepoStars } from '@/lib/github';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');

  if (!owner || !repo) {
    return NextResponse.json(
      { error: 'Missing owner or repo parameter' },
      { status: 400 }
    );
  }

  const GITHUB_NAME_RE = /^[a-zA-Z0-9._-]+$/;
  if (
    !GITHUB_NAME_RE.test(owner) ||
    owner.length > 39 ||
    !GITHUB_NAME_RE.test(repo) ||
    repo.length > 100
  ) {
    return NextResponse.json(
      { error: 'Invalid owner or repo parameter' },
      { status: 400 }
    );
  }

  const stars = await getRepoStars(owner, repo);

  // On transient API errors (stars === null), use a short cache so we don't
  // pin a stale "0 stars" response for the full hour that healthy responses get.
  if (stars === null) {
    return NextResponse.json(
      { stars: 0 },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  }

  return NextResponse.json(
    { stars },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  );
}
