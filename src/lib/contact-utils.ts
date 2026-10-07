import type { NextRequest } from 'next/server';
import { isIP } from 'node:net';
import { isCloudflareProxy } from './trusted-proxies';
export { MAX_NAME_LENGTH, MAX_EMAIL_LENGTH, MAX_MESSAGE_LENGTH } from './contact-limits';

// Rate limiting defaults
export const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
export const RATE_LIMIT_MAX_REQUESTS = 3;

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

// The rightmost x-forwarded-for entry is the one appended by the nearest
// trusted proxy; leftmost entries can be client-prepended and spoofed.
function lastForwardedIP(forwarded: string): string {
  const hops = forwarded.split(',').map((hop) => hop.trim()).filter(Boolean);
  return hops.length > 0 ? hops[hops.length - 1] : 'unknown';
}

// Get client IP from request
// Uses trusted platform headers only when behind a known proxy
export function getClientIP(request: NextRequest): string {
  // Trust deployment configuration, never a client-supplied "proof" header.
  // Vercel overwrites x-forwarded-for with the address connecting to its edge.
  if (process.env.VERCEL !== '1' && process.env.TRUST_PROXY !== '1') return 'unknown';
  const forwarded = request.headers.get('x-forwarded-for');
  const peer = forwarded ? lastForwardedIP(forwarded) : request.headers.get('x-real-ip')?.trim();
  if (!peer || !isIP(peer)) return 'unknown';
  // CF-Connecting-IP is authoritative only when the verified peer is Cloudflare.
  const client = request.headers.get('cf-connecting-ip')?.trim();
  return isCloudflareProxy(peer) && client && isIP(client) ? client : peer;
}

// Validate origin/referer against allowlist
export function validateOrigin(request: NextRequest): boolean {
  const referer = request.headers.get('referer');
  const origin = request.headers.get('origin');

  const allowedOrigins = new Set(['https://saatvik.me', 'https://www.saatvik.me']);
  if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.add('http://localhost:3000');
    allowedOrigins.add('http://127.0.0.1:3000');
  }

  // Add custom allowed domains from environment variable (comma-separated).
  // NOTE: Vercel preview deployments should be configured via ALLOWED_CONTACT_ORIGINS
  // with the exact project preview hostname(s). Previously this trusted any
  // *.vercel.app subdomain when x-vercel-id was present, which is spoofable
  // and allows other Vercel projects to pass origin validation.
  const customDomains = process.env.ALLOWED_CONTACT_ORIGINS;
  if (customDomains) {
    for (const value of customDomains.split(',').map((d) => d.trim()).filter(Boolean)) {
      try {
        // Accept existing hostname configuration as HTTPS, or an exact full origin.
        const url = new URL(value.includes('://') ? value : `https://${value}`);
        if (url.protocol === 'https:' || url.protocol === 'http:') allowedOrigins.add(url.origin);
      } catch { /* Ignore invalid configuration entries. */ }
    }
  }

  const checkDomain = (url: string | null): boolean => {
    if (!url) return false; // Reject if header is missing
    try {
      const parsedUrl = new URL(url);
      return !parsedUrl.username && !parsedUrl.password && allowedOrigins.has(parsedUrl.origin);
    } catch {
      return false;
    }
  };

  // Require at least one of origin/referer to be present and valid
  if (!referer && !origin) return false;

  // A present Origin is authoritative; Referer is only a fallback.
  return checkDomain(origin !== null ? origin : referer);
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

// Upper bound on tracked IPs so an attacker rotating identities cannot grow
// the in-memory store without limit.
export const RATE_LIMIT_MAX_TRACKED_IPS = 10_000;

// Factory function that creates an in-memory rate limiter with
// closure-scoped state (not module-scoped) for better testability.
export function createRateLimiter(options: RateLimiterOptions): RateLimiter {
  const store = new Map<string, { count: number; resetTime: number }>();

  return {
    check(ip: string): RateLimitResult {
      const now = Date.now();
      // Fixed windows are inserted in expiry order. Stop at the first live
      // entry rather than scanning every active IP on every request.
      for (const [key, value] of store.entries()) {
        if (now < value.resetTime) break;
        store.delete(key);
      }
      const record = store.get(ip);
      if (!record) {
        // Do not let rotating identities evict the limits on existing senders.
        if (store.size >= RATE_LIMIT_MAX_TRACKED_IPS) {
          const oldest = store.values().next().value;
          return { allowed: false, retryAfter: Math.max(1, Math.ceil(((oldest?.resetTime ?? now) - now) / 1000)) };
        }
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
