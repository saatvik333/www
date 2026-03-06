```
┌─────────────────────────────────────────┐
│  saatvik.me                             │
│  personal portfolio & blog              │
└─────────────────────────────────────────┘
```

### stack

```
  next.js 16 ─── app router, turbopack, react compiler
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
  bun run clean     nuke .next & node_modules
```

### license

[GPL-3.0](LICENSE)
