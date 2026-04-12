# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio website for saatvik333 (saatvik.me). Built with **Next.js 16** (App Router), **React 19**, and **TypeScript** (strict mode). Styled with **CSS Modules** (no Tailwind). PWA-enabled via next-pwa.

## Commands

**ALWAYS use `bun`, never use `npm`.**

- `bun run dev` - Start dev server (Turbopack)
- `bun run build` - Production build (does NOT run linting)
- `bun run start` - Start production server
- `bun run lint` - ESLint via CLI directly (not `next lint`, which was removed in Next.js 16)
- `bun run clean` - Remove .next, node_modules, tsbuildinfo

No test framework is configured.

**Environment variables** (required in `.env.local`):

- `GITHUB_TOKEN` - GitHub personal access token (read-only) for the contributions calendar GraphQL API (`/about` page)
- `SMTP_EMAIL` - Gmail address used as the nodemailer sender for the contact form
- `SMTP_PASSWORD` - Gmail app password for the above account
- `ALLOWED_CONTACT_ORIGINS` - Additional allowed domains for contact form origin validation (comma-separated, optional)

## Key Conventions (Next.js 16 / React 19)

- **Server Components by default.** Only add `'use client'` when the component needs browser APIs, hooks, or event handlers. Currently client components: `ClientLayout`, `Navbar`, `Navigation`, `MobileBottomNav`, `ContactForm`, `ImageCarousel`, `Logo`, `CopyButton`, `PhotoItem`.
- **Async params.** Dynamic route params are `Promise<{ slug: string }>` — always `await params` before use. See `src/app/blog/[slug]/page.tsx` for the pattern.
- **`generateStaticParams` + `generateMetadata`** for static generation and per-page SEO on dynamic routes.
- **React Compiler enabled** (`reactCompiler: true` in `next.config.ts`) — do NOT manually add `useMemo`/`useCallback`/`React.memo`; the compiler handles memoization automatically.
- **Turbopack** is the dev bundler (top-level `turbopack: {}` in config, not under `experimental`).
- **ESLint flat config** (`eslint.config.mjs`) using `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`. No `.eslintrc`.
- **`next.config.ts`** (TypeScript config, not `.js`).
- **CSS Modules** for all styling (`.module.css` files colocated with components). Shared typography styles in `src/styles/typography.module.css`.
- **framer-motion** uses `LazyMotion` with `domAnimation` and the `m` component (not `motion`) for tree-shaking.
- **Barrel exports** via `index.ts` in `src/components/ui/` and `src/components/layout/`. Import from the barrel: `import { Logo } from '@/components/ui'`.

## Architecture

**Content system:** Markdown files in `content/` read at build time by `src/lib/content.ts` using gray-matter (frontmatter) and unified/remark/rehype (rendering with syntax highlighting via rehype-highlight). Two content types:

- **Blogs:** `content/blogs/{slug}.md` — frontmatter: title, description, date, pinned, updatedAt (optional). Hidden drafts in `content/blogs/.hidden/`.
- **Projects:** `content/projects/{slug}/index.md` with optional `thumbnail.{ext}` and `images/` directory. Images served via `/api/content/[...path]` route with a rewrite from `/content/:path*`. Frontmatter fields:
  - `title` (required) -- falls back to slug if missing
  - `description` (required)
  - `date` (optional)
  - `tags: string[]` (optional)
  - `stack: string[]` (optional)
  - `github` (optional) -- GitHub repo URL
  - `site` (optional) -- live site URL
  - Thumbnail: `thumbnail.{png|jpg|jpeg|webp|gif}` in project root
  - Images: placed in `images/` subdirectory, **sorted alphabetically by filename** to control carousel order

### Photo gallery (/pics)

- Drop images into `public/pics/`
- Supported formats: jpg, jpeg, png, webp, gif, avif
- Alt text is auto-generated from filenames (dashes/underscores become spaces)
- Gallery order is **alphabetical by filename**
- Pre-optimize images before adding -- Next.js Image component serves optimized versions, but source size impacts deploys

### Security design decisions

- **Content API defense-in-depth** (`src/app/api/content/[...path]/route.ts`): Three layers prevent filesystem exposure -- (1) hidden segment blocking (rejects paths starting with `.`), (2) resolved path boundary check (uses `path.sep` to prevent `/content-secrets` bypasses), (3) extension allowlist (only image formats served).
- **Contact API rate limiter** (`src/app/api/contact/route.ts`): Uses an in-memory `Map` which resets on serverless cold starts. This is **best-effort** spam mitigation, not security -- for real abuse prevention, use Vercel KV or Upstash Redis.
- **Null origin handling**: Contact API requires at least one of `Origin` or `Referer` to be present. Requests with neither are rejected. This blocks direct API access from curl/bots.

**Key files:**

- `src/lib/config.ts` - Site-wide constants (URLs, social links, colors with `as const`). Colors must stay in sync with `src/app/globals.css` CSS variables.
- `src/lib/content.ts` - All content loading/parsing logic. Exports types: `ProjectMeta`, `Project`, `BlogMeta`, `BlogPost`.
- `src/lib/github.ts` - GitHub API helpers (contribution calendar, stars).
- `src/lib/photos.ts` - Photo loading for /pics page.
- `src/lib/navLinks.ts` - Navigation link definitions.
- `src/lib/fonts.ts` - Font configuration (IBM Plex Mono).
- `src/components/layout/` - ClientLayout, Navbar, Navigation, MobileBottomNav, PageLayout.
- `src/components/ui/` - Reusable components (ProjectCard, ImageCarousel, GitHubCalendar, etc.).

**Routing (App Router):**

- `/` - Home
- `/about`, `/contact`, `/pics` - Static pages
- `/blog`, `/blog/[slug]` - Blog listing and detail
- `/projects`, `/projects/[slug]` - Project listing and detail
- `/feed` - RSS feed route
- `/api/og` - Dynamic OG image generation (route.tsx)
- `/api/github/stars` - GitHub stars API proxy
- `/api/contact` - Contact form (nodemailer)
- `robots.ts`, `sitemap.ts` - SEO (generated at build time)

**Path alias:** `@/*` maps to `./src/*`.

**TypeScript:** Strict mode, ES2022 target, bundler module resolution. Path alias configured in `tsconfig.json`.
