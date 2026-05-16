"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TokenRow } from "@/components/TokenRow";
import { getTrendingTokens } from "@/lib/birdeye-api";

const CHAINS = [
  { id: "ethereum", label: "Ethereum" },
  { id: "solana", label: "Solana" },
  { id: "arbitrum", label: "Arbitrum" },
  { id: "bsc", label: "BSC" },
  { id: "base", label: "Base" },
];

export default function TrendingPage() {
  const [chain, setChain] = useState("ethereum");
  const [sortBy, setSortBy] = useState<"rank" | "liquidity" | "volume24hUSD">("rank");

  const trending = useQuery({
    queryKey: ["trending-list", chain, sortBy],
    queryFn: () => getTrendingTokens(chain, sortBy, "asc", 0, 30),
    refetchInterval: 60_000,
  });

  const items = trending.data?.tokens ?? [];
  const sortedByVolume = [...items].sort((a, b) => b.volume24hUSD - a.volume24hUSD);
  const topGainers = [...items].sort((a, b) => b.price24hChangePercent - a.price24hChangePercent).slice(0, 5);

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-primary]">Market Heat</p>
        <h1 className="mt-1 text-2xl font-bold text-white">Trending</h1>
      </div>

      <div className="mb-6 flex flex-wrap gap-1">
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
        <div className="ml-4 flex gap-1">
          {(["rank", "liquidity", "volume24hUSD"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`rounded border px-3 py-1 text-[10px] uppercase tracking-wider transition-colors ${
                sortBy === s
                  ? "border-[--color-primary]/50 bg-[--color-primary]/10 text-[--color-primary]"
                  : "border-zinc-700 text-zinc-600 hover:border-zinc-500"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {topGainers.map((t) => (
          <div key={t.address} className="glass-card rounded p-3">
            <p className="truncate text-sm font-semibold text-white">{t.name}</p>
            <p className="font-mono text-[10px] uppercase text-zinc-500">{t.symbol}</p>
            <p className="mt-2 font-mono text-lg text-[--color-success]">
              +{t.price24hChangePercent.toFixed(1)}%
            </p>
            <p className="font-mono text-xs text-zinc-500">${t.price < 0.01 ? t.price.toFixed(8) : t.price.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">All Trending — Ranked</h2>
        <span className="font-mono text-[10px] text-zinc-600">auto-refresh 60s</span>
      </div>

      <div className="space-y-2">
        {trending.isLoading && Array.from({ length: 15 }).map((_, i) => <div key={i} className="glass-card h-14 animate-pulse rounded" />)}
        {items.map((t) => (
          <TokenRow
            key={t.address}
            name={t.name}
            symbol={t.symbol}
            price={t.price}
            priceChange24h={t.price24hChangePercent}
            volume24h={t.volume24hUSD}
            rank={t.rank}
          />
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-white">By Volume</h2>
        <div className="space-y-2">
          {sortedByVolume.slice(0, 10).map((t) => (
            <TokenRow
              key={t.address}
              name={t.name}
              symbol={t.symbol}
              price={t.price}
              priceChange24h={t.price24hChangePercent}
              volume24h={t.volume24hUSD}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}