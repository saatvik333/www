/**
 * GitHub API utilities for fetching repository data
 */

/**
 * Parse a GitHub URL and extract owner and repo name
 * Handles various URL formats:
 * - https://github.com/owner/repo
 * - https://github.com/owner/repo.git
 * - github.com/owner/repo
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    // Remove trailing .git if present
    const cleanUrl = url.replace(/\.git$/, '');
    
    // Try to extract from URL path
    const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Fetch star count for a GitHub repository
 * Uses the public GitHub API (no auth required for public repos)
 */
export async function getRepoStars(owner: string, repo: string): Promise<number | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'portfolio-website',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.stargazers_count ?? null;
  } catch (error) {
    console.error('Failed to fetch GitHub stars:', error);
    return null;
  }
}

export interface ContributionDay {
  contributionCount: number;
  date: string;
  contributionLevel: 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE';
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export async function getContributions(username: string): Promise<ContributionCalendar | null> {
  // Validate token before making request
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('GITHUB_TOKEN environment variable is not set');
    return null;
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
      next: { revalidate: 3600 * 6 }, // Cache for 6 hours
    });

    if (!response.ok) {
      console.error(`GitHub GraphQL API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.data?.user?.contributionsCollection?.contributionCalendar ?? null;
  } catch (error) {
    console.error('Failed to fetch GitHub contributions:', error);
    return null;
  }
}
