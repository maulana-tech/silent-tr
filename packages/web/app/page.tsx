"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/AppShell";
import { StatsCard } from "@/components/StatsCard";
import { TokenRow } from "@/components/TokenRow";
import {
  getNewListings,
  getTrendingTokens,
  createBirdeyeWs,
  getTokenSecurity,
} from "@/lib/birdeye-api";
import type { WsChannel } from "@/lib/birdeye-api";

const CHAIN = "ethereum";

export default function HomePage() {
  const [wsFeed, setWsFeed] = useState<string[]>([]);

  const newListings = useQuery({
    queryKey: ["new-listings"],
    queryFn: () => getNewListings(CHAIN, 10),
    refetchInterval: 120_000, // 2 minutes to reduce API calls
    staleTime: 60_000, // Consider data fresh for 1 minute
  });

  const trending = useQuery({
    queryKey: ["trending"],
    queryFn: () => getTrendingTokens(CHAIN, "rank", "asc", 0, 10),
    refetchInterval: 120_000, // 2 minutes
    staleTime: 60_000,
  });

  const listingItems = newListings.data?.items ?? [];
  const trendingItems = trending.data?.tokens ?? [];

  const securityQueries = useQuery({
    queryKey: ["listings-security", listingItems.map((t) => t.address).join(",")],
    queryFn: async () => {
      // Disable security checks to avoid 429/401 errors
      // Security endpoint requires premium Birdeye plan
      return listingItems.slice(0, 5).map(() => ({
        isHoneypot: false,
        top10HolderPercent: 0
      }));
    },
    enabled: false, // Disabled to prevent rate limiting
    staleTime: 300_000,
  });
  const securityData = securityQueries.data ?? [];

  const onWsMessage = useCallback((data: unknown) => {
    setWsFeed((prev) => [JSON.stringify(data).slice(0, 120), ...prev].slice(0, 20));
  }, []);

  useEffect(() => {
    // WebSocket disabled to reduce API load - REST data is sufficient
    // Uncomment if you have premium Birdeye plan with WebSocket access
    // const ws = createBirdeyeWs(onWsMessage);
    // if (ws) ws.subscribe("SUBSCRIBE_TOKEN_NEW_LISTING" as WsChannel, { chain: CHAIN });
    // return () => ws?.close();
  }, [onWsMessage]);

  const avgChange = trendingItems.length
    ? trendingItems.reduce((s, t) => s + t.price24hChangePercent, 0) / trendingItems.length
    : null;

  const totalVolume = trendingItems.reduce((s, t) => s + t.volume24hUSD, 0);

  return (
    <AppShell>
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-primary]">
          Birdeye Data Services
        </p>
        <h1 className="mt-1 text-2xl font-bold text-white">
          Token Discovery Dashboard
        </h1>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatsCard label="New Tokens (24h)" value={String(listingItems.length)} loading={newListings.isLoading} />
        <StatsCard label="Trending Now" value={String(trendingItems.length)} loading={trending.isLoading} />
        <StatsCard
          label="Avg Price Change"
          value={avgChange !== null ? `${avgChange > 0 ? "+" : ""}${avgChange.toFixed(1)}%` : "—"}
          loading={trending.isLoading}
        />
        <StatsCard label="Total Volume" value={abbr(totalVolume)} loading={trending.isLoading} />
      </div>

      <div className="mb-12 grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Latest Listings</h2>
            <span className="font-mono text-[10px] text-zinc-600">auto-refresh 60s</span>
          </div>
          <div className="space-y-2">
            {newListings.isLoading && Array.from({ length: 5 }).map((_, i) => <div key={i} className="glass-card h-14 animate-pulse rounded" />)}
            {listingItems.map((token, i) => (
              <TokenRow
                key={token.address}
                address={token.address}
                name={token.name}
                symbol={token.symbol}
                price={0}
                priceChange24h={0}
                volume24h={token.liquidity}
                liquidity={token.liquidity}
                chain={CHAIN}
                security={securityData[i]}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Top Trending</h2>
          </div>
          <div className="space-y-2">
            {trending.isLoading && Array.from({ length: 8 }).map((_, i) => <div key={i} className="glass-card h-14 animate-pulse rounded" />)}
            {trendingItems.map((token) => (
              <TokenRow
                key={token.address}
                address={token.address}
                name={token.name}
                symbol={token.symbol}
                price={token.price}
                priceChange24h={token.price24hChangePercent}
                volume24h={token.volume24hUSD}
                chain={CHAIN}
                rank={token.rank}
              />
            ))}
          </div>
        </section>
      </div>

      {wsFeed.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-white">Live Feed</h2>
          <div className="glass-card max-h-60 overflow-y-auto rounded p-3 font-mono text-[10px] leading-relaxed text-zinc-500">
            {wsFeed.map((msg, i) => (
              <div key={i} className="truncate">
                <span className="text-[--color-primary]">&gt;</span> {msg}
              </div>
            ))}
          </div>
        </section>
      )}
    </AppShell>
  );
}

function abbr(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toFixed(0);
}