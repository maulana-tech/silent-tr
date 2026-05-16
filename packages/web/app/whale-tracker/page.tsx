"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { getWalletPortfolio } from "@/lib/whale-utils";
import type { TopTrader } from "@/lib/whale-utils";

const CHAINS = [
  { id: "ethereum", label: "Ethereum" },
  { id: "solana", label: "Solana" },
  { id: "arbitrum", label: "Arbitrum" },
  { id: "bsc", label: "BSC" },
  { id: "base", label: "Base" },
];

export default function WhaleTrackerPage() {
  const [chain, setChain] = useState("ethereum");
  const [searchWallet, setSearchWallet] = useState("");
  const [searchedWallet, setSearchedWallet] = useState("");
  const [portfolioAdviceText, setPortfolioAdviceText] = useState("");
  const [adviceLoading, setAdviceLoading] = useState(false);

  const { data: traders, isLoading } = useQuery({
    queryKey: ["top-traders", chain],
    queryFn: () => {
      const { getTopTradersWithFallback } = require("@/lib/whale-utils");
      return getTopTradersWithFallback(chain, 20);
    },
  });

  const walletPortfolio = useQuery({
    queryKey: ["wallet-portfolio", searchedWallet],
    queryFn: () => getWalletPortfolio(searchedWallet, chain),
    enabled: searchedWallet.length === 42,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedWallet(searchWallet.trim());
    setPortfolioAdviceText("");
  };

  const handleAdvice = async () => {
    if (!walletPortfolio.data) return;
    setAdviceLoading(true);
    try {
      const { portfolioAdvice } = await import("@/lib/chaingpt");
      const advice = await portfolioAdvice(walletPortfolio.data.items);
      setPortfolioAdviceText(advice ?? "Advice unavailable");
    } finally {
      setAdviceLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-primary]">Wallet Analytics</p>
        <h1 className="mt-1 text-2xl font-bold text-white">Whale Tracker</h1>
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

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Top Traders</span>
            {traders?.some((t: TopTrader) => t.isDemo) && (
              <span className="font-mono text-[10px] text-yellow-600">demo data</span>
            )}
          </h2>
          <div className="space-y-2">
            {isLoading && Array.from({ length: 10 }).map((_, i) => <div key={i} className="glass-card h-12 animate-pulse rounded" />)}
            {(traders ?? []).slice(0, 15).map((t: TopTrader) => (
              <div key={t.address} className="glass-card flex items-center justify-between rounded px-4 py-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs text-zinc-600 w-6 shrink-0">#{t.rank}</span>
                  <span className="font-mono text-xs text-zinc-300 truncate">
                    {t.address.slice(0, 6)}...{t.address.slice(-4)}
                  </span>
                </div>
                <div className="flex items-center gap-4 font-mono text-xs">
                  <div className="text-right">
                    <p className={t.pnl >= 0 ? "text-[--color-success]" : "text-[--color-danger]"}>
                      {t.pnl >= 0 ? "+" : ""}${abbr(t.pnl)}
                    </p>
                    <p className="text-zinc-600">PnL</p>
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-300">{((t.winRate ?? 0) * 100).toFixed(0)}%</p>
                    <p className="text-zinc-600">Win</p>
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-300">{t.totalTrades}</p>
                    <p className="text-zinc-600">Trades</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-white">Wallet Lookup</h2>
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchWallet}
                onChange={(e) => setSearchWallet(e.target.value)}
                placeholder="0x... or Solana address"
                className="flex-1 rounded border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-xs text-white outline-none transition-colors focus:border-[--color-primary]"
              />
              <button type="submit" className="btn-primary rounded text-[10px]">Search</button>
              {walletPortfolio.data && (
                <button onClick={handleAdvice} disabled={adviceLoading} className="btn-secondary rounded text-[10px]">
                  {adviceLoading ? "..." : "AI"}
                </button>
              )}
            </div>
          </form>

          {walletPortfolio.isLoading && <div className="glass-card h-48 animate-pulse rounded" />}

          {walletPortfolio.data && (
            <div className="glass-card rounded p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-mono text-xs text-zinc-400">
                  Total: <span className="text-white">${abbr(walletPortfolio.data.totalUsd)}</span>
                </p>
                <span className="font-mono text-[10px] text-zinc-600">{walletPortfolio.data.items.length} tokens</span>
              </div>
              <div className="space-y-2">
                {walletPortfolio.data.items.slice(0, 10).map((t) => (
                  <div key={t.address} className="flex items-center justify-between border-b border-zinc-800 pb-1.5 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-zinc-300 truncate">{t.symbol}</span>
                      <span className="text-zinc-600">{t.name}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-white">${abbr(t.valueUsd)}</span>
                      <span className="ml-2 text-zinc-600">{t.balance.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {portfolioAdviceText && (
            <div className="glass-card rounded p-4">
              <h3 className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-[--color-primary]">
                <span className="material-symbols-outlined text-sm">psychology</span>
                AI Advisor
              </h3>
              <p className="font-mono text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap">
                {portfolioAdviceText}
              </p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function abbr(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toFixed(0);
}