"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import {
  getTokenOverview,
  getTokenSecurity,
  getOHLCV,
  getTokenTxs
} from "@/lib/birdeye-api";
import { analyzeToken } from "@/lib/chaingpt";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function TokenDetailPage({
  params,
}: {
  params: Promise<{ address: string }> | { address: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chain = searchParams.get("chain") || "ethereum";
  const [timeRange, setTimeRange] = useState<"1H" | "4H" | "1D">("4H");
  const [address, setAddress] = useState<string | null>(null);

  // Handle async params in Next.js 16
  useEffect(() => {
    let cancelled = false;

    Promise.resolve(params).then((resolvedParams) => {
      if (!cancelled) {
        setAddress(resolvedParams.address);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []); // Empty deps - params is a Promise and shouldn't be in deps

  // Basic validation: address exists, not "undefined" string, and looks like hex address
  const isValidAddress = Boolean(
    address &&
    typeof address === "string" &&
    address !== "undefined" &&
    address !== "null" &&
    address.length >= 20 && // Minimum reasonable address length
    (address.startsWith("0x") || address.length > 30) // Ethereum or Solana address
  );

  // Debug logging (will be visible in browser console)
  if (typeof window !== "undefined" && address) {
    console.log("Token Detail Page - Address:", address, "Valid:", isValidAddress, "Length:", address?.length);
  }

  // IMPORTANT: All hooks must be called before any early returns!
  const { data: overview, isLoading: overviewLoading, error: overviewError } = useQuery({
    queryKey: ["token-overview", address, chain],
    queryFn: async () => {
      if (!address) throw new Error("No address");
      try {
        const data = await getTokenOverview(address, chain);
        console.log("Token overview loaded:", data.name);
        return data;
      } catch (error) {
        console.error("Failed to load token overview:", error);
        throw error;
      }
    },
    enabled: !!address && isValidAddress, // Only run when address is set
    staleTime: 30_000,
    retry: 2,
    retryDelay: 2000,
  });

  const { data: security, isLoading: securityLoading } = useQuery({
    queryKey: ["token-security", address, chain],
    queryFn: () => {
      if (!address) throw new Error("No address");
      return getTokenSecurity(address, chain);
    },
    enabled: false, // Disabled - requires premium Birdeye plan
    staleTime: 300_000,
  });

  const { data: txs } = useQuery({
    queryKey: ["token-txs", address, chain],
    queryFn: () => {
      if (!address) throw new Error("No address");
      return getTokenTxs(address, 20, chain);
    },
    enabled: !!address && isValidAddress && !!overview,
    staleTime: 30_000,
    retry: 1,
  });

  const timeRangeConfig = useMemo(() => {
    const now = Math.floor(Date.now() / 1000);
    switch (timeRange) {
      case "1H": return { type: "1m", from: now - 3600, to: now };
      case "4H": return { type: "5m", from: now - 4 * 3600, to: now };
      case "1D": return { type: "15m", from: now - 24 * 3600, to: now };
    }
  }, [timeRange]);

  const { data: ohlcv } = useQuery({
    queryKey: ["token-ohlcv", address, chain, timeRange],
    queryFn: () => {
      if (!address) throw new Error("No address");
      return getOHLCV(address, timeRangeConfig.type, timeRangeConfig.from, timeRangeConfig.to, chain);
    },
    enabled: !!address && isValidAddress && !!overview,
    staleTime: 60_000,
    retry: 1,
  });

  const { data: analysis, isLoading: analysisLoading } = useQuery({
    queryKey: ["token-analysis", address, chain],
    queryFn: async () => {
      if (!address || !overview) return null;
      return analyzeToken({
        name: overview.name,
        symbol: overview.symbol,
        address: address,
        price: overview.price,
        liquidity: overview.liquidity,
        volume24h: overview.volume24h,
        priceChange24h: overview.priceChange24h,
        security: security ?? undefined,
      });
    },
    enabled: !!address && isValidAddress && !!overview,
    staleTime: 300_000,
    retry: 1,
  });

  const chartData = useMemo(() => {
    if (!ohlcv?.items) return [];
    return ohlcv.items.map(([time, , , , close]) => ({
      time,
      price: close,
      date: new Date(time * 1000).toLocaleTimeString(),
    }));
  }, [ohlcv]);

  // All hooks called - now safe to do conditional returns

  // Loading state while params are being resolved
  if (address === null) {
    return (
      <AppShell>
        <div className="glass-card rounded p-8 text-center">
          <div className="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-2 border-[--color-primary] border-t-transparent" />
          <p className="font-mono text-xs text-zinc-500">Loading...</p>
        </div>
      </AppShell>
    );
  }

  // Early return for invalid address
  if (!isValidAddress) {
    return (
      <AppShell>
        <div className="glass-card rounded p-8 text-center">
          <p className="font-mono text-sm text-red-400">Invalid token address</p>
          <button onClick={() => router.back()} className="btn-primary mt-4 rounded px-6 py-2">
            Go Back
          </button>
        </div>
      </AppShell>
    );
  }

  if (overviewLoading) {
    return (
      <AppShell>
        <div className="glass-card rounded p-8 text-center">
          <div className="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-2 border-[--color-primary] border-t-transparent" />
          <p className="font-mono text-xs text-zinc-500">Loading token data...</p>
        </div>
      </AppShell>
    );
  }

  // Show error state if no data and not loading
  if (!overview) {
    if (overviewLoading) {
      return (
        <AppShell>
          <div className="glass-card rounded p-8 text-center">
            <div className="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-2 border-[--color-primary] border-t-transparent" />
            <p className="font-mono text-xs text-zinc-500">Loading token data...</p>
          </div>
        </AppShell>
      );
    }

    return (
      <AppShell>
        <div className="glass-card rounded p-8 text-center">
          <p className="font-mono text-sm text-red-400">
            {overviewError ? "This page couldn't load" : "Token not found"}
          </p>
          <p className="mt-2 font-mono text-xs text-zinc-600">
            {overviewError ? "Reload to try again, or go back." : `Address: ${address}`}
          </p>
          {overviewError && (
            <p className="mt-2 font-mono text-[10px] text-zinc-700">
              Error: {String((overviewError as Error).message)}
            </p>
          )}
          <div className="mt-4 flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="btn-primary rounded px-6 py-2"
            >
              Reload
            </button>
            <button
              onClick={() => router.back()}
              className="rounded border border-zinc-700 px-6 py-2 text-zinc-400 hover:border-zinc-500"
            >
              Go Back
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  // At this point, overview is guaranteed to exist
  const isUp = overview.priceChange24h >= 0;

  return (
    <AppShell>
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Back
      </button>

      {/* Header */}
      <div className="mb-6 glass-card rounded p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{overview.name}</h1>
            <p className="mt-1 font-mono text-sm uppercase text-zinc-500">{overview.symbol}</p>
            <p className="mt-2 font-mono text-[10px] text-zinc-600 break-all">{address}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-3xl font-bold text-white">
              ${overview.price < 0.01 ? overview.price.toFixed(8) : overview.price.toFixed(4)}
            </p>
            <p className={`mt-1 font-mono text-sm ${isUp ? "text-[--color-success]" : "text-[--color-danger]"}`}>
              {isUp ? "+" : ""}{overview.priceChange24h.toFixed(2)}% (24h)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-4 md:grid-cols-4">
          <StatItem label="Market Cap" value={overview.marketCap ? `$${fmtNum(overview.marketCap)}` : "N/A"} />
          <StatItem label="Liquidity" value={`$${fmtNum(overview.liquidity)}`} />
          <StatItem label="Volume 24h" value={`$${fmtNum(overview.volume24h)}`} />
          <StatItem label="Holders" value={overview.holder.toLocaleString()} />
        </div>
      </div>

      {/* Price Chart */}
      <div className="mb-6 glass-card rounded p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Price Chart</h2>
          <div className="flex gap-1">
            {(["1H", "4H", "1D"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`rounded px-3 py-1 text-[10px] uppercase tracking-wider transition-colors ${
                  timeRange === range
                    ? "bg-[--color-primary] text-white"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis
                dataKey="date"
                stroke="#52525b"
                tick={{ fontSize: 10 }}
                tickLine={false}
              />
              <YAxis
                stroke="#52525b"
                tick={{ fontSize: 10 }}
                tickLine={false}
                domain={["auto", "auto"]}
                tickFormatter={(v) => `$${v < 0.01 ? v.toFixed(6) : v.toFixed(2)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "#a1a1aa" }}
                itemStyle={{ color: "#22d3ee" }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#22d3ee"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center">
            <p className="font-mono text-xs text-zinc-600">Loading chart data...</p>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Security Check */}
        {security && (
          <div className="glass-card rounded p-4">
            <h3 className="mb-3 text-xs uppercase tracking-widest text-zinc-500">Security Check</h3>
            <div className="space-y-2 font-mono text-xs">
              <SecurityItem label="Honeypot" value={security.isHoneypot ? "YES ⚠️" : "No"} danger={security.isHoneypot} />
              <SecurityItem label="Mintable" value={security.mintable ? "YES ⚠️" : "No"} danger={security.mintable} />
              <SecurityItem label="Freezable" value={security.freezable ? "YES ⚠️" : "No"} danger={security.freezable} />
              <SecurityItem label="Top 10 Holders" value={`${security.top10HolderPercent.toFixed(1)}%`} danger={security.top10HolderPercent > 60} />
              <SecurityItem label="LP Locked" value={security.lpLocked > 0 ? `${security.lpLocked.toFixed(0)}%` : "No"} danger={security.lpLocked === 0} />
            </div>
          </div>
        )}

        {/* AI Analysis */}
        <div className="glass-card rounded p-4">
          <h3 className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-[--color-primary]">
            <span className="material-symbols-outlined text-sm">psychology</span>
            AI Analysis
          </h3>
          {analysisLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[--color-primary] border-t-transparent" />
            </div>
          ) : (
            <p className="font-mono text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap">
              {analysis || "Analysis not available"}
            </p>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      {txs && txs.items.length > 0 && (
        <div className="mt-6 glass-card rounded p-4">
          <h3 className="mb-3 text-xs uppercase tracking-widest text-zinc-500">Recent Transactions</h3>
          <div className="space-y-2">
            {txs.items.slice(0, 10).map((tx) => (
              <div key={tx.txHash} className="flex items-center justify-between border-b border-zinc-800/50 pb-2 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`rounded px-2 py-0.5 text-[9px] uppercase ${
                    tx.type === "buy" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                  }`}>
                    {tx.type}
                  </span>
                  <div className="font-mono text-xs">
                    <p className="text-white">${fmtNum(tx.valueUsd)}</p>
                    <p className="text-zinc-600">{new Date(tx.blockTime * 1000).toLocaleTimeString()}</p>
                  </div>
                </div>
                <a
                  href={`https://etherscan.io/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] text-[--color-primary] hover:underline"
                >
                  {tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="font-mono text-[10px] text-zinc-500">{label}</p>
      <p className="mt-1 font-mono text-sm font-semibold text-white">{value}</p>
    </div>
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
      <div className="flex items-center justify-between">
        <p className="text-zinc-600">{label}</p>
        <p className={`font-mono text-xs font-semibold ${danger ? "text-red-400" : "text-white"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function fmtNum(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toFixed(2);
}
