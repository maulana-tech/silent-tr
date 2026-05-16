# AGENTS.md — Birdeye Token Discovery Dashboard

Birdeye Data Sprint 4 competition (Mei 2026). Deadline: **16 Mei 2026**.

Minimal 50 API calls, submit via Earn listing dengan nama proyek + GitHub + X post + endpoint description.

## Stack

- Next.js 16 (App Router, Turbopack)
- Tailwind v4 (CSS config in `globals.css` via `@theme {}`)
- `@tanstack/react-query` (data fetching)
- `recharts` (charts — dashboard)
- Birdeye REST API (`https://public-api.birdeye.so`) + WebSocket (`wss://public-api.birdeye.so/socket`)
- Deploy: Vercel

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Next.js dev (Turbopack) at localhost:3000 |
| `pnpm build` | Production build |
| `pnpm type-check` | `tsc --noEmit` |
| `pnpm lint` | `next lint` |
| `pnpm test` | `vitest run` |

## Halaman

| Route | Page | Endpoint Birdeye |
|---|---|---|
| `/` | Landing / Dashboard | new_listing + token_trending + WebSocket |
| `/radar` | New Token Radar | new_listing + token_security + token_overview |
| `/trending` | Trending Monitor | token_trending |
| `/whale-tracker` | Whale Tracker | top_traders + wallet/portfolio |

## API Client

`lib/birdeye-api.ts` — REST + WebSocket wrapper. Gunakan langsung via React Query.

```ts
const { data } = useQuery({
  queryKey: ["new-listings"],
  queryFn: () => getNewListings(50),
  refetchInterval: 60_000,
});
```

WebSocket: `createBirdeyeWs(onMessage)` → returns `{ subscribe(), close() }`.

## Env

```
NEXT_PUBLIC_BIRDEYE_API_KEY=   # dari https://bds.birdeye.so
```

## CI

Type-check → `vitest run --coverage` → `next build`. Single web-only job.

## UI Conventions

- Dark theme, matrix-green accents (`--color-primary: #00ff41`)
- Tailwind v4: tokens in `globals.css`, use `var(--color-*)` in className
- Material Symbols Outlined for icons
- `glass-card`, `btn-primary`, `btn-secondary`, `grid-bg`, `scanline` utility classes
- Server Components bisa fetching langsung, `"use client"` untuk React Query + state

## Scoring criteria

1. Community Support (X engagement)
2. Product Utility
3. Technical Depth (use 3+ endpoints, combine REST + WebSocket)
4. Presentation (clean repo, README, deployed URL)
