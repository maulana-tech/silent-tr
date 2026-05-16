# Birdeye Data Sprint 4 — Token Intelligence Dashboard

**Deadline: 16 Mei 2026.** Birdeye Data Sprint 4 submission via Earn listing.

## Stack

- Next.js 16 (App Router, Turbopack)
- Tailwind v4 (CSS config in `globals.css` via `@theme {}`)
- `@tanstack/react-query` (data fetching)
- `recharts` (charts — dashboard)
- Birdeye REST (`https://public-api.birdeye.so`) + WebSocket (`wss://public-api.birdeye.so/socket`)
- Deploy: Vercel

## Pages

| Route | Page | Birdeye Endpoints |
|---|---|---|
| `/` | Dashboard | new_listing + token_trending + WebSocket |
| `/radar` | New Token Radar | new_listing + token_security + token_overview |
| `/trending` | Trending Monitor | token_trending |
| `/whale-tracker` | Whale Tracker | top_traders + wallet/portfolio |
| `/signals` | Trade Signals | token_trending + top_traders |
| `/analyze` | Token Analyzer | token_overview + token_security |

## API Client

`lib/birdeye-api.ts` — REST + WebSocket wrapper. Use directly via React Query.

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
NEXT_PUBLIC_BIRDEYE_API_KEY=   # from https://bds.birdeye.so
```

## CI

Type-check → `vitest run --coverage` → `next build`. Single web-only job.

## Scoring Criteria

1. Community Support (X engagement)
2. Product Utility
3. Technical Depth (3+ endpoints, REST + WebSocket)
4. Presentation (clean repo, README, deployed URL)