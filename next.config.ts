import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";
import { getLocalImagePatterns } from './src/lib/image-patterns';

const nextConfig: NextConfig = {
  // React Compiler for automatic memoization
  reactCompiler: true,

  // Turbopack configuration (faster than webpack)
  turbopack: {},

  // Experimental features for maximum speed
  experimental: {
    // Optimize package imports - reduce bundle size
    optimizePackageImports: ['react-icons', 'embla-carousel-react'],
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 3600,
    localPatterns: getLocalImagePatterns(),
  },

  // Headers for caching and security
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    // React dev mode needs 'unsafe-eval' for HMR, fast refresh, and callstack reconstruction.
    // In production, it is omitted for stronger XSS defense.
    // Cloudflare injects its Web Analytics beacon in front of the origin;
    // allow it and its rum endpoint or the browser blocks the script/POSTs.
    const scriptSrc = isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
      : "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com";

    return [
      // HTML pages - enable bfcache with private caching
      {
        source: '/:path*',
        has: [{ type: 'header', key: 'accept', value: '(.*text/html.*)' }],
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, max-age=0, must-revalidate',
          },
        ],
      },
      // Public filenames can change, and missing assets must not be immutable.
      // Let Next.js set public-file/error caching. Hashed _next assets retain
      // the framework's immutable cache headers.
      // Security headers for all pages
      {
        source: '/:path*',
        headers: [
          // Content Security Policy - primary XSS defense
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              scriptSrc,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              // connect-src needs ws: in dev for HMR websocket; the
              // cloudflareinsights beacon POSTs its metrics
              isDev
                ? "connect-src 'self' ws: wss:"
                : "connect-src 'self' https://cloudflareinsights.com",
              "font-src 'self'",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
            ].join('; '),
          },
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // XSS Protection (legacy browsers)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // HSTS - enforce HTTPS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },

  // Rewrites to serve content directory images
  async rewrites() {
    return [
      {
        source: '/content/:path*',
        destination: '/api/content/:path*',
      },
    ];
  },

  // Compress responses
  compress: true,

  // Power by header off for slightly smaller responses
  poweredByHeader: false,

  // Source maps disabled in production (reduces build size, hides source code)
  productionBrowserSourceMaps: false,
};

// Photos and optimized images belong in runtime caches, not the install bundle.
const workboxOptions = {
  skipWaiting: true,
  cleanupOutdatedCaches: true,
  runtimeCaching: [
    {
      urlPattern: /^https?:\/\/.*\/_next\/image(.*)/,
      handler: "StaleWhileRevalidate" as const,
      options: {
        cacheName: "next-image-v2",
        cacheableResponse: { statuses: [200] },
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 },
      },
    },
    {
      urlPattern: /^https?:\/\/.*\/pics\/(.*)/,
      handler: "StaleWhileRevalidate" as const,
      options: {
        cacheName: "pics-v2",
        cacheableResponse: { statuses: [200] },
        expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 },
      },
    },
  ],
};

const pwaConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  publicExcludes: ['!noprecache/**/*', '!pics/**/*'],
  workboxOptions,
});

export default pwaConfig(nextConfig);
