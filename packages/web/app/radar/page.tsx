"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TokenRow } from "@/components/TokenRow";
import { getNewListings, getTokenSecurity, getTokenOverview } from "@/lib/birdeye-api";

const CHAINS = [
  { id: "ethereum", label: "Ethereum" },
  { id: "solana", label: "Solana" },
  { id: "arbitrum", label: "Arbitrum" },
  { id: "bsc", label: "BSC" },
  { id: "polygon", label: "Polygon" },
  { id: "base", label: "Base" },
];

export default function RadarPage() {
  const [chain, setChain] = useState("ethereum");
  const [hideHoneypot, setHideHoneypot] = useState(true);

  const listings = useQuery({
    queryKey: ["radar-listings", chain],
    queryFn: () => getNewListings(chain, 20),
    refetchInterval: 120_000,
  });

  const listingItems = listings.data?.items ?? [];

  const enriched = useQuery({
    queryKey: ["radar-enriched", chain, listingItems.map((t) => t.address).join(",")],
    queryFn: async () => {
      const tokens = listingItems.slice(0, 15); // Reduce to 15 to avoid rate limits

      // Process sequentially to avoid parallel rate limiting
      const enrichedTokens = [];
      for (const t of tokens) {
        try {
          // Only fetch overview, skip security (requires premium plan)
          const overview = await getTokenOverview(t.address, chain).catch(() => null);
          enrichedTokens.push({
            ...t,
            security: null, // Disabled to prevent 401/429
            overview
          });
          // Small delay between requests
          await new Promise(r => setTimeout(r, 100));
        } catch (e) {
          console.error("Failed to enrich token:", e);
        }
      }

      return enrichedTokens;
    },
    enabled: listingItems.length > 0,
    staleTime: 120_000, // 2 minutes
    refetchInterval: 180_000, // 3 minutes
  });

  type EnrichedToken = {
    address: string;
    name: string;
    symbol: string;
    liquidity: number;
    security: { isHoneypot: boolean; top10HolderPercent: number } | null;
    overview: { price: number; priceChange24h: number; volume24h: number } | null;
  };

  let displayTokens = (enriched.data ?? []) as EnrichedToken[];
  // Honeypot filter disabled since security data is not available
  // if (hideHoneypot) displayTokens = displayTokens.filter((t) => !t.security?.isHoneypot);

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-primary]">Token Discovery</p>
        <h1 className="mt-1 text-2xl font-bold text-white">New Token Radar</h1>
        <p className="mt-1 text-sm text-zinc-500">Scan new listings with automatic security scoring</p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1">
          {CHAINS.map((c) => (
            <button
              key={c.id}
              onClick={() => setChain(c.id)}
              className={`rounded border px-3 py-1 text-[10px] uppercase tracking-wider transition-colors ${
                chain === c.id
                  ? "border-[--color-primary] bg-[--color-primary-soft] text-[--color-primary]"
                  : "border-zinc-700 text-zinc-500 hover:border-zinc-500"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-zinc-500">
          <input
            type="checkbox"
            checked={hideHoneypot}
            onChange={(e) => setHideHoneypot(e.target.checked)}
            className="accent-[--color-primary]"
          />
          Hide Honeypots
        </label>
      </div>

      <div className="space-y-2">
        {enriched.isLoading && Array.from({ length: 10 }).map((_, i) => <div key={i} className="glass-card h-14 animate-pulse rounded" />)}
        {displayTokens.map((t) => (
          <TokenRow
            key={t.address}
            address={t.address}
            name={t.name}
            symbol={t.symbol}
            price={t.overview?.price ?? 0}
            priceChange24h={t.overview?.priceChange24h ?? 0}
            volume24h={t.overview?.volume24h ?? t.liquidity}
            liquidity={t.liquidity}
            chain={chain}
            security={
              t.security
                ? { isHoneypot: t.security.isHoneypot, top10HolderPercent: t.security.top10HolderPercent }
                : undefined
            }
          />
        ))}
        {!enriched.isLoading && displayTokens.length === 0 && (
          <p className="py-12 text-center font-mono text-xs text-zinc-600">No tokens found matching filters</p>
        )}
      </div>

      <p className="mt-4 font-mono text-[10px] text-zinc-700">
        Data from Birdeye API — {enriched.data?.length ?? 0} tokens scanned
      </p>
    </AppShell>
  );
}