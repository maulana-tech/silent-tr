"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { analyzeToken } from "@/lib/chaingpt";
import { getTokenOverview, getTokenSecurity } from "@/lib/birdeye-api";

export default function AnalyzePage() {
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState("ethereum");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    overview: Awaited<ReturnType<typeof getTokenOverview>> | null;
    security: Awaited<ReturnType<typeof getTokenSecurity>> | null;
    analysis: string;
  } | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!address.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const [overview, security] = await Promise.all([
        getTokenOverview(address.trim(), chain).catch(() => null),
        getTokenSecurity(address.trim(), chain).catch(() => null),
      ]);
      if (!overview && !security) {
        setError("Token not found. Check address and chain.");
        return;
      }
      const analysis = await analyzeToken({
        name: overview?.name ?? "Unknown",
        symbol: overview?.symbol ?? "???",
        address: address.trim(),
        price: overview?.price ?? 0,
        liquidity: overview?.liquidity ?? 0,
        volume24h: overview?.volume24h ?? 0,
        priceChange24h: overview?.priceChange24h ?? 0,
        security: security ?? undefined,
      });
      setResult({ overview, security, analysis });
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[--color-primary]">AI Analysis</p>
        <h1 className="mt-1 text-2xl font-bold text-white">Token Analyzer</h1>
        <p className="mt-1 text-sm text-zinc-500">
          ChainGPT-powered risk assessment and fundamental analysis
        </p>
      </div>

      <div className="mb-6 glass-card rounded p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {["ethereum", "solana", "bsc", "arbitrum", "base", "polygon"].map((c) => (
            <button
              key={c}
              onClick={() => setChain(c)}
              className={`rounded border px-3 py-1 text-[10px] uppercase tracking-wider transition-colors ${
                chain === c
                  ? "border-[--color-primary] bg-[--color-primary-soft] text-[--color-primary]"
                  : "border-zinc-700 text-zinc-500"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            placeholder="0x... or Solana address"
            className="flex-1 rounded border border-zinc-700 bg-zinc-900 px-4 py-3 font-mono text-sm text-white outline-none transition-colors focus:border-[--color-primary]"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !address.trim()}
            className="btn-primary rounded px-6"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
        {error && (
          <p className="mt-2 font-mono text-xs text-[--color-danger]">{error}</p>
        )}
      </div>

      {loading && (
        <div className="glass-card rounded p-8 text-center">
          <div className="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-2 border-[--color-primary] border-t-transparent" />
          <p className="font-mono text-xs text-zinc-500">
            ChainGPT is analyzing this token...
          </p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {result.overview && (
            <div className="glass-card rounded p-4">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-white">{result.overview.name}</p>
                  <p className="font-mono text-xs uppercase text-zinc-500">{result.overview.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xl font-bold text-white">
                    ${result.overview.price < 0.01 ? result.overview.price.toFixed(8) : result.overview.price.toFixed(2)}
                  </p>
                  <p className={`font-mono text-xs ${result.overview.priceChange24h >= 0 ? "text-[--color-success]" : "text-[--color-danger]"}`}>
                    {result.overview.priceChange24h >= 0 ? "+" : ""}{result.overview.priceChange24h.toFixed(2)}%
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 border-t border-zinc-800 pt-3 text-center font-mono text-xs">
                <div>
                  <p className="text-zinc-500">Liquidity</p>
                  <p className="text-white">${fmtNum(result.overview.liquidity)}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Volume 24h</p>
                  <p className="text-white">${fmtNum(result.overview.volume24h)}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Holders</p>
                  <p className="text-white">{result.overview.holder.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {result.security && (
            <div className="glass-card rounded p-4">
              <h3 className="mb-3 text-xs uppercase tracking-widest text-zinc-500">Security Check</h3>
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <SecurityItem label="Honeypot" value={result.security.isHoneypot ? "YES ⚠️" : "No"} danger={result.security.isHoneypot} />
                <SecurityItem label="Mintable" value={result.security.mintable ? "YES ⚠️" : "No"} danger={result.security.mintable} />
                <SecurityItem label="Freezable" value={result.security.freezable ? "YES ⚠️" : "No"} danger={result.security.freezable} />
                <SecurityItem label="Top 10 Holders" value={`${result.security.top10HolderPercent.toFixed(1)}%`} danger={result.security.top10HolderPercent > 60} />
                <SecurityItem label="LP Locked" value={result.security.lpLocked > 0 ? `${result.security.lpLocked.toFixed(0)}%` : "Unknown"} danger={result.security.lpLocked === 0} />
                <SecurityItem label="Owner Balance" value={`$${fmtNum(result.security.ownerBalance)}`} />
              </div>
            </div>
          )}

          <div className="glass-card rounded p-4">
            <h3 className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-[--color-primary]">
              <span className="material-symbols-outlined text-sm">psychology</span>
              ChainGPT Analysis
            </h3>
            <div className="prose prose-invert prose-sm max-w-none">
              <p className="font-mono text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap">
                {result.analysis}
              </p>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function SecurityItem({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className={`rounded border px-3 py-2 ${danger ? "border-red-900 bg-red-900/20" : "border-zinc-800"}`}>
      <p className="text-zinc-600">{label}</p>
      <p className={`font-mono text-sm font-semibold ${danger ? "text-red-400" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}

function fmtNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toFixed(2);
}