const BASE_URL = "https://public-api.birdeye.so";
const WS_URL = "wss://public-api.birdeye.so/socket";

// Rate limiting: simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 120_000; // 2 minutes for better caching
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests (more conservative)
let lastRequestTime = 0;
let requestQueue: Promise<any> = Promise.resolve();

function apiKey(): string {
  // Try multiple sources — NEXT_PUBLIC_* for client, direct env for server
  return (
    process.env.NEXT_PUBLIC_BIRDEYE_API_KEY ||
    (typeof window === "undefined" ? process.env.BIRDEYE_API_KEY : "") ||
    ""
  );
}

async function rateLimitDelay(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();
}

function headers(chain?: string): Record<string, string> {
  const h: Record<string, string> = { accept: "application/json" };
  const key = apiKey();
  if (key) h["X-API-KEY"] = key;
  if (chain && chain !== "solana") h["x-chain"] = chain;
  return h;
}

async function fetchBirdeye<T>(
  path: string,
  chain?: string,
): Promise<T> {
  const cacheKey = `${chain || 'default'}:${path}`;

  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  // Queue requests to prevent parallel rate limiting
  return new Promise((resolve, reject) => {
    requestQueue = requestQueue.then(async () => {
      try {
        // Rate limit
        await rateLimitDelay();

        const res = await fetch(`${BASE_URL}${path}`, {
          headers: headers(chain),
          next: { revalidate: 120 } // Next.js cache for 2 minutes
        });

        if (!res.ok) {
          // If rate limited or error, return cached data if available
          if (cached && (res.status === 429 || res.status >= 500 || res.status === 401)) {
            console.warn(`Birdeye API ${res.status} - using cached data`);
            resolve(cached.data as T);
            return;
          }
          throw new Error(`Birdeye API ${res.status}: ${res.statusText}`);
        }

        const json = await res.json();
        if (!json.success) {
          // Return cached data if API reports error but cache exists
          if (cached) {
            resolve(cached.data as T);
            return;
          }
          throw new Error(json.message || "Birdeye API error");
        }

        // Cache the result
        cache.set(cacheKey, { data: json.data, timestamp: Date.now() });
        resolve(json.data as T);
      } catch (error) {
        // Return cached data on any error if available
        if (cached) {
          console.warn("Using cached data due to error:", error);
          resolve(cached.data as T);
        } else {
          reject(error);
        }
      }
    });
  });
}

/* ─────────── New Listings ─────────── */

export interface NewListingItem {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string | null;
  liquidity: number;
  liquidityAddedAt: string;
}

export function getNewListings(
  chain = "ethereum",
  limit = 20,
): Promise<{ items: NewListingItem[] }> {
  return fetchBirdeye(
    `/defi/v2/tokens/new_listing?limit=${Math.min(limit, 20)}`,
    chain,
  );
}

/* ─────────── Trending ─────────── */

export interface TrendingToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  liquidity: number;
  fdv: number;
  marketcap: number;
  price: number;
  volume24hUSD: number;
  volume24hChangePercent: number;
  price24hChangePercent: number;
  rank: number;
}

export function getTrendingTokens(
  chain = "ethereum",
  sortBy = "rank",
  sortType = "asc",
  offset = 0,
  limit = 20,
): Promise<{ tokens: TrendingToken[]; total: number; updateUnixTime: number }> {
  return fetchBirdeye(
    `/defi/token_trending?sort_by=${sortBy}&sort_type=${sortType}&offset=${offset}&limit=${Math.min(limit, 20)}`,
    chain,
  );
}

/* ─────────── Token Overview ─────────── */

export interface TokenOverview {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  price: number;
  mc: number | null;
  marketCap: number;
  liquidity: number;
  volume24h: number;
  priceChange24h: number;
  holder: number;
  lastTradeUnixTime: number;
}

export function getTokenOverview(
  address: string,
  chain = "ethereum",
): Promise<TokenOverview> {
  return fetchBirdeye(`/defi/token_overview?address=${address}`, chain);
}

/* ─────────── Token Security ─────────── */

export interface TokenSecurity {
  mintable: boolean;
  freezable: boolean;
  top10HolderPercent: number;
  lpLocked: number;
  isHoneypot: boolean;
  ownerBalance: number;
}

export function getTokenSecurity(
  address: string,
  chain = "ethereum",
): Promise<TokenSecurity> {
  return fetchBirdeye(`/defi/token_security?address=${address}`, chain);
}

/* ─────────── Price ─────────── */

export function getPrice(
  address: string,
  chain = "ethereum",
): Promise<{ value: number; priceChange24h: number }> {
  return fetchBirdeye(`/defi/price?address=${address}`, chain);
}

/* ─────────── OHLCV ─────────── */

export function getOHLCV(
  address: string,
  type = "1H",
  timeFrom: number,
  timeTo: number,
  chain = "ethereum",
): Promise<{ items: [number, number, number, number, number, number][] }> {
  return fetchBirdeye(
    `/defi/ohlcv?address=${address}&type=${type}&time_from=${timeFrom}&time_to=${timeTo}`,
    chain,
  );
}

/* ─────────── Transactions ─────────── */

export interface TokenTx {
  txHash: string;
  type: "buy" | "sell";
  price: number;
  amount: number;
  valueUsd: number;
  blockTime: number;
}

export function getTokenTxs(
  address: string,
  limit = 50,
  chain = "ethereum",
): Promise<{ items: TokenTx[] }> {
  return fetchBirdeye(`/defi/txs/token?address=${address}&limit=${limit}`, chain);
}

/* ─────────── Wallet Analytics ─────────── */

export interface TopTrader {
  address: string;
  avatar?: string;
  pnl: number;
  winRate: number;
  totalTrades: number;
}

export function getTopTraders(
  chain = "ethereum",
  limit = 20,
): Promise<{ items: TopTrader[] }> {
  // Note: This endpoint may not be available in all Birdeye plans
  // Return empty to trigger fallback gracefully
  return Promise.resolve({ items: [] });
}

export interface WalletPortfolio {
  totalUsd: number;
  items: {
    address: string;
    name: string;
    symbol: string;
    balance: number;
    valueUsd: number;
  }[];
}

export function getWalletPortfolio(
  wallet: string,
  chain = "ethereum",
): Promise<WalletPortfolio> {
  return fetchBirdeye(`/defi/v2/wallets/${wallet}/portfolio`, chain);
}

/* ─────────── Search ─────────── */

export interface SearchToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
  liquidity: number;
  mc: number;
  price: number;
  priceChange24h: number;
  volume24hUSD: number;
}

export function searchTokens(
  keyword: string,
  chain = "ethereum",
  limit = 20,
): Promise<{ tokens: SearchToken[] }> {
  return fetchBirdeye(
    `/defi/v3/search?keyword=${encodeURIComponent(keyword)}&sort_by=volume_24h_usd&sort_type=desc&limit=${limit}`,
    chain,
  );
}

/* ─────────── WebSocket ─────────── */

export type WsChannel =
  | "SUBSCRIBE_PRICE"
  | "SUBSCRIBE_TXS"
  | "SUBSCRIBE_TOKEN_NEW_LISTING"
  | "SUBSCRIBE_NEW_PAIR"
  | "SUBSCRIBE_LARGE_TRADE_TXS"
  | "SUBSCRIBE_TOKEN_STATS"
  | "SUBSCRIBE_WALLET_TXS";

export function createBirdeyeWs(onMessage: (data: unknown) => void) {
  const key = apiKey();
  if (!key) return null;

  const ws = new WebSocket(`${WS_URL}?x-api-key=${key}`);

  ws.onopen = () => { /* connected */ };
  ws.onmessage = (event) => {
    try {
      onMessage(JSON.parse(event.data));
    } catch { /* ignore */ }
  };
  ws.onerror = () => { /* WebSocket connection failed — non-critical, REST data still works */ };
  ws.onclose = () => { /* connection closed */ };

  return {
    subscribe(channel: WsChannel, data: Record<string, unknown> = {}) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: channel, data }));
      }
    },
    close() {
      ws.close();
    },
  };
}