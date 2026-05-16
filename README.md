# Silent TR — Token Intelligence Suite

> Token discovery dashboard, trending monitor, and whale tracker powered by Birdeye API + ChainGPT AI.

**Live:** [silent-tr.vercel.app](https://silent-tr.vercel.app)

| Route | Description |
|---|---|
| `/` | Dashboard — new listings + trending + WebSocket live feed |
| `/radar` | New Token Radar — multi-chain scan with honeypot filter + security scoring |
| `/trending` | Trending Monitor — sortable by rank / liquidity / volume |
| `/whale-tracker` | Whale Tracker — top traders leaderboard + wallet lookup + AI advisor |
| `/signals` | Trade Signals — hot tokens + whale wallets with per-wallet AI signals |
| `/analyze` | Token Analyzer — address → overview + security + ChainGPT report |

## Stack

Next.js 16 (App Router · Turbopack) · Tailwind v4 · `@tanstack/react-query` · Birdeye REST + WebSocket · ChainGPT

## Birdeye API Endpoints (7+)

| Endpoint | Pages |
|---|---|
| `defi/v2/tokens/new_listing` | Dashboard, Radar |
| `defi/token_trending` | Dashboard, Trending, Signals |
| `defi/token_overview` | Radar, Analyze |
| `defi/token_security` | Dashboard, Radar, Analyze |
| `defi/v2/wallets/top_traders` | Whale Tracker, Signals |
| `defi/v2/wallets/{addr}/portfolio` | Whale Tracker |
| WebSocket `SUBSCRIBE_TOKEN_NEW_LISTING` | Dashboard live feed |

## Quick Start

```bash
# Get Birdeye API key: https://bds.birdeye.so
echo "NEXT_PUBLIC_BIRDEYE_API_KEY=your_key" > packages/web/.env.local

pnpm install
pnpm dev
# → http://localhost:3000
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Next.js dev (Turbopack) |
| `pnpm build` | Production build |
| `pnpm type-check` | `tsc --noEmit` |
| `pnpm lint` | `next lint` |
| `pnpm test` | `vitest run` |

## Project Structure

```
silent-tr/
├── packages/
│   └── web/                  # Next.js app (all pages + API clients)
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── vercel.json
└── README.md
```

## License

MIT