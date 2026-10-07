import { checkRateLimit } from '@vercel/firewall';
import type { NextRequest } from 'next/server';
import { createRateLimiter, RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS, type RateLimitResult } from './contact-utils';

const localLimiter = createRateLimiter({ windowMs: RATE_LIMIT_WINDOW_MS, maxRequests: RATE_LIMIT_MAX_REQUESTS });

export async function checkContactRateLimit(request: NextRequest, ip: string): Promise<RateLimitResult> {
  if (process.env.VERCEL !== '1') return localLimiter.check(ip);
  // Vercel's counters are shared across function instances within each region.
  // Matching rule: contact-form, 3 requests / 300 seconds, fixed window.
  const result = await checkRateLimit('contact-form', { request, rateLimitKey: ip, timeout: 3000 });
  if (result.error) throw new Error('Contact rate-limit rule unavailable');
  return result.rateLimited ? { allowed: false, retryAfter: RATE_LIMIT_WINDOW_MS / 1000 } : { allowed: true };
}
