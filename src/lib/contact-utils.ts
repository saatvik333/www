import type { NextRequest } from 'next/server';

// Rate limiting defaults
export const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
export const RATE_LIMIT_MAX_REQUESTS = 3;

// Input length limits
export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 254;
export const MAX_MESSAGE_LENGTH = 5000;

// Escape HTML entities to prevent XSS in emails
export function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char]);
}

// Get client IP from request
// Uses trusted platform headers only when behind a known proxy
export function getClientIP(request: NextRequest): string {
  // Only trust CF-Connecting-IP when behind Cloudflare (check for CF-specific headers)
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP && request.headers.get('cf-ray')) {
    return cfConnectingIP;
  }

  // Only trust x-forwarded-for/x-real-ip when behind a trusted proxy
  // Check for x-vercel-id header to verify we're on Vercel
  const vercelId = request.headers.get('x-vercel-id');
  if (vercelId) {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
      return realIP;
    }
  }

  // Fall back to unknown when no trusted proxy is detected
  // This prevents IP spoofing in development or untrusted environments
  return 'unknown';
}

// Validate origin/referer against allowlist
export function validateOrigin(request: NextRequest): boolean {
  const referer = request.headers.get('referer');
  const origin = request.headers.get('origin');

  // Base allowed domains
  const allowedDomains = [
    'saatvik.me',
    'www.saatvik.me',
    'localhost',
    '127.0.0.1',
  ];

  // Add custom allowed domains from environment variable (comma-separated).
  // NOTE: Vercel preview deployments should be configured via ALLOWED_CONTACT_ORIGINS
  // with the exact project preview hostname(s). Previously this trusted any
  // *.vercel.app subdomain when x-vercel-id was present, which is spoofable
  // and allows other Vercel projects to pass origin validation.
  const customDomains = process.env.ALLOWED_CONTACT_ORIGINS;
  if (customDomains) {
    allowedDomains.push(...customDomains.split(',').map((d) => d.trim()).filter(Boolean));
  }

  const checkDomain = (url: string | null): boolean => {
    if (!url) return false; // Reject if header is missing
    try {
      const parsedUrl = new URL(url);
      return allowedDomains.some(
        (domain) =>
          parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`),
      );
    } catch {
      return false;
    }
  };

  // Require at least one of origin/referer to be present and valid
  if (!referer && !origin) return false;

  // Allow if either referer or origin is from an allowed domain
  return checkDomain(referer) || checkDomain(origin);
}

export interface RateLimiterOptions {
  windowMs: number;
  maxRequests: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
}

export interface RateLimiter {
  check(ip: string): RateLimitResult;
  reset(): void;
}

// Factory function that creates an in-memory rate limiter with
// closure-scoped state (not module-scoped) for better testability.
export function createRateLimiter(options: RateLimiterOptions): RateLimiter {
  const store = new Map<string, { count: number; resetTime: number }>();

  return {
    check(ip: string): RateLimitResult {
      const now = Date.now();
      const record = store.get(ip);

      // Cleanup old entries periodically
      if (store.size > 1000) {
        for (const [key, value] of store.entries()) {
          if (now > value.resetTime) {
            store.delete(key);
          }
        }
      }

      if (!record || now > record.resetTime) {
        store.set(ip, { count: 1, resetTime: now + options.windowMs });
        return { allowed: true };
      }

      if (record.count >= options.maxRequests) {
        return {
          allowed: false,
          retryAfter: Math.ceil((record.resetTime - now) / 1000),
        };
      }

      record.count++;
      return { allowed: true };
    },
    reset(): void {
      store.clear();
    },
  };
}
