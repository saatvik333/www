```
┌─────────────────────────────────────────┐
│  saatvik.me                             │
│  personal portfolio & blog              │
└─────────────────────────────────────────┘
```

### stack

```
  next.js 16 ─── app router, turbopack dev, webpack production, react compiler
  react 19 ──── server components by default
  typescript ─── strict mode
  css modules ── no tailwind
  markdown ───── gray-matter + unified/remark/rehype
  pwa ─────────── next-pwa
```

### structure

```
  src/
  ├── app/          routes & layouts
  ├── components/   ui & layout components
  ├── lib/          content, config, utilities
  └── styles/       shared css modules

  content/
  ├── blogs/        markdown blog posts
  └── projects/     markdown + images
```

### commands

```
  bun run dev       start dev server
  bun run build     production build
  bun run start     start production server
  bun run lint      run eslint
  bun run test      run route, component, and asset regression tests
  bun run smoke URL check a running production build (default localhost:3000)
  bun run clean     nuke .next & node_modules
```

### delivery and caching

Contact delivery requires `SMTP_EMAIL` and `SMTP_PASSWORD`. Optional
`ALLOWED_CONTACT_ORIGINS` is a comma-separated list of exact origins (legacy
hostnames are treated as HTTPS). Localhost is allowed only outside production.
`GITHUB_TOKEN` enables the contributions calendar.

On Vercel, contact submissions use the `@vercel/firewall` rate-limit rule
`contact-form`: 3 requests per 300 seconds with a fixed window. Counters are
shared across function instances within each region, not globally across regions.
The handler supplies the verified client IP as the bucket key and returns 503
if the rule/service is unavailable. Development and self-hosted deployments use
a bounded local limiter; a self-hosted reverse proxy must strip untrusted forwarding
headers before setting `TRUST_PROXY=1`.
Production also sets the sensitive `RATE_LIMIT_SECRET` environment variable,
which salts the SDK's rate-limit bucket identifiers.

Cloudflare client IP headers are accepted only when the trusted forwarding peer
is in Cloudflare's published networks. Keep the ranges in
`src/lib/trusted-proxies.ts` current with Cloudflare's official IP lists.

Gallery and project image URLs include a content hash of their image collection.
The two collections are versioned separately and recomputed on production builds.
The optimizer accepts only those generated query strings, so changing an image
invalidates its collection's cached variants without admitting arbitrary query
cache keys or exceeding Next.js's 25-pattern limit. Restart dev after editing
images to rebuild the allowlist.
Mutable content assets revalidate using ETags; missing content assets use
`no-store`. Public assets use Next.js defaults, optimized images have a one-hour
minimum cache TTL, and the service worker revalidates image caches.
Production builds use Webpack because next-pwa generates its service worker
through a Webpack plugin; development retains Turbopack.

The gallery renders real images in the initial HTML and uses native lazy loading.
The carousel renders images with a native horizontal-scroll fallback before
hydration. CI builds the site and runs smoke checks for pages, gallery images,
RSS, favicon/manifest consistency, missing-asset caching, and rejected origins.

### license

[GPL-3.0](LICENSE)
