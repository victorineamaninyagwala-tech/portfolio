# Personal Portfolio Site

Single-page portfolio for Victorine Amani, built with TanStack Start (SSR), React 19
and Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev
```

The dev server runs on http://localhost:3000.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR on port 3000 |
| `npm run build` | Production build into `dist/` (client + SSR bundles) |
| `npm run start` | Serve the production build (`dist/server/server.js`) |
| `npm run typecheck` | `tsc --noEmit` |

## Layout

```
src/
  routes/           file-based routes; routeTree.gen.ts is generated, not committed
    __root.tsx      document shell, <head> meta, 404 + error boundaries
    index.tsx       the page
  lib/              cn(), error reporting
  assets/           imported images
  router.tsx        getRouter() — TanStack Start entry, creates the QueryClient
  styles.css        Tailwind v4 + the oklch design tokens
public/             served as-is (favicon.ico)
```

## UI components

The project keeps the shadcn/ui baseline — `components.json`, `src/lib/utils.ts`, and
`clsx` / `tailwind-merge` / `class-variance-authority` / `lucide-react` — but vendors no
components. Add one when a page actually needs it:

```bash
npx shadcn@latest add button
```

It lands in `src/components/ui/` and pulls in only its own dependencies.

## Notes

- `src/assets/featured-tendaji.jpg` and `src/assets/portrait.jpg` are 1×1 placeholders.
  Replace them with the real photographs.
- `public/favicon.ico` is a generated solid-colour placeholder.
