"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { getTrendingTokens } from "@/lib/whale-utils";
import type { TopTrader } from "@/lib/whale-utils";

const CHAINS = [
  { id: "ethereum", label: "Ethereum" },
  { id: "solana", label: "Solana" },
  { id: "bsc", label: "BSC" },
  { id: "base", label: "Base" },
  { id: "arbitrum", label: "Arbitrum" },
];

export default function SignalsPage() {
  const [chain, setChain] = useState("ethereum");
  const [selectedSignal, setSelectedSignal] = useState<{ addr: string; text: string } | null>(null);
  const [loadingSignal, setLoadingSignal] = useState<string | null>(null);

  const { data: traders } = useQuery({
    queryKey: ["signals-traders", chain],
    queryFn: () => {
      const { getTopTradersWithFallback } = require("@/lib/whale-utils");
      return getTopTradersWithFallback(chain, 15);
    },
    refetchInterval: 180_000, // 3 minutes
    staleTime: 120_000,
  });

  const { data: hotTokens } = useQuery({
    queryKey: ["signals-hot", chain],
    queryFn: () => getTrendingTokens(chain, "volume24hUSD", "desc", 0, 5),
    refetchInterval: 120_000, // 2 minutes
    staleTime: 60_000,
  });

  const handleSignal = async (wallet: TopTrader) => {
    if (selectedSignal?.addr === wallet.address) return;
    setLoadingSignal(wallet.address);
    try {
      const { generateTradeSignal } = await import("@/lib/chaingpt");
      const signal = await generateTradeSignal(wallet);
      setSelectedSignal({ addr: wallet.address, text: signal ?? "Signal unavailable" });
    } finally {
      setLoadingSignal(null);
    }
  };

  const topTokens = hotTokens?.tokens ?? [];

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-primary]">Copy Trade</p>
        <h1 className="mt-1 text-2xl font-bold text-white">Trade Signals</h1>
        <p className="mt-1 text-sm text-zinc-500">Hot tokens + whale wallets with AI-generated signals</p>
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
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-white">Hot by Volume</h2>
        <div className="space-y-2">
          {!hotTokens && Array.from({ length: 5 }).map((_, i) => <div key={i} className="glass-card h-16 animate-pulse rounded" />)}
          {topTokens.map((t) => (
            <div key={t.address} className="glass-card flex items-center justify-between rounded px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-xs text-zinc-600 w-5 shrink-0">#{t.rank}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{t.name}</p>
                  <p className="font-mono text-[10px] uppercase text-zinc-500">{t.symbol}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 font-mono text-xs">
                <div className="text-right">
                  <p className="text-white">${fmtNum(t.volume24hUSD)}</p>
                  <p className="text-zinc-600">volume</p>
                </div>
                <div className="text-right">
                  <p className={t.price24hChangePercent >= 0 ? "text-[--color-success]" : "text-[--color-danger]"}>
                    {t.price24hChangePercent >= 0 ? "+" : ""}{t.price24hChangePercent.toFixed(1)}%
                  </p>
                  <p className="text-zinc-600">change</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-white">Top Wallets</h2>
        <div className="space-y-2">
          {!traders && Array.from({ length: 10 }).map((_, i) => <div key={i} className="glass-card h-14 animate-pulse rounded" />)}
          {(traders ?? []).map((w: TopTrader) => (
            <div key={w.address} className="glass-card rounded px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs text-zinc-600 w-5 shrink-0">#{w.rank}</span>
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-white">
                      {w.address.slice(0, 6)}...{w.address.slice(-4)}
                    </p>
                    {w.isDemo && (
                      <p className="font-mono text-[9px] text-yellow-600">demo wallet</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right font-mono text-xs">
                    <p className={w.pnl >= 0 ? "text-[--color-success]" : "text-[--color-danger]"}>
                      {w.pnl >= 0 ? "+" : ""}${fmtNum(w.pnl)}
                    </p>
                    <p className="text-zinc-600">PnL</p>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <p className="text-zinc-300">{((w.winRate ?? 0) * 100).toFixed(0)}%</p>
                    <p className="text-zinc-600">win</p>
                  </div>
                  <button
                    onClick={() => handleSignal(w)}
                    disabled={loadingSignal === w.address}
                    className="btn-primary rounded px-4 py-2 text-[10px]"
                  >
                    {loadingSignal === w.address ? "..." : "Signal"}
                  </button>
                </div>
              </div>
              {selectedSignal?.addr === w.address && (
                <div className="mt-3 border-t border-zinc-800 pt-3">
                  <p className="font-mono text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap">
                    {selectedSignal.text}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toFixed(2);
}