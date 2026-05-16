import Link from "next/link";

const CHAIN_COLORS: Record<string, string> = {
  ethereum: "#627eea",
  arbitrum: "#2d374b",
  bsc: "#f0b90b",
  polygon: "#8247e5",
  base: "#0052ff",
  solana: "#9945ff",
};

export function TokenRow({
  address,
  name,
  symbol,
  price,
  priceChange24h,
  volume24h,
  liquidity,
  chain = "ethereum",
  rank,
  security,
}: {
  address: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity?: number;
  chain?: string;
  rank?: number;
  security?: { isHoneypot: boolean; top10HolderPercent: number };
}) {
  const isUp = priceChange24h >= 0;
  return (
    <Link
      href={`/token/${address}?chain=${chain}`}
      className="glass-card flex items-center justify-between rounded px-4 py-3 transition-colors hover:bg-zinc-800/30 cursor-pointer"
    >
      <div className="flex items-center gap-3 min-w-0">
        {rank && (
          <span className="font-mono text-xs text-zinc-600 w-5 shrink-0">
            #{rank}
          </span>
        )}
        <span
          className="inline-block h-2 w-2 shrink-0 rounded-full"
          style={{ background: CHAIN_COLORS[chain] || "#666" }}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{name}</p>
          <p className="font-mono text-[10px] uppercase text-zinc-500">
            {symbol}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 font-mono text-xs">
        <div className="text-right">
          <p className="text-white">${price.toFixed(price < 0.01 ? 6 : 2)}</p>
          <p
            className={
              isUp ? "text-[--color-success]" : "text-[--color-danger]"
            }
          >
            {isUp ? "+" : ""}
            {priceChange24h.toFixed(2)}%
          </p>
        </div>
        <div className="hidden text-right sm:block">
          <p className="text-zinc-400">${abbr(volume24h)}</p>
          <p className="text-zinc-600">volume</p>
        </div>
        {liquidity !== undefined && (
          <div className="hidden text-right md:block">
            <p className="text-zinc-400">${abbr(liquidity)}</p>
            <p className="text-zinc-600">liquidity</p>
          </div>
        )}
        {security && (
          <SecurityBadge {...security} />
        )}
      </div>
    </Link>
  );
}

function SecurityBadge({
  isHoneypot,
  top10HolderPercent,
}: {
  isHoneypot: boolean;
  top10HolderPercent: number;
}) {
  if (isHoneypot) {
    return (
      <span className="rounded border border-red-900 bg-red-900/20 px-2 py-0.5 text-[10px] text-red-400 uppercase">
        Honeypot
      </span>
    );
  }
  if (top10HolderPercent > 50) {
    return (
      <span className="rounded border border-yellow-900 bg-yellow-900/20 px-2 py-0.5 text-[10px] text-yellow-400 uppercase">
        Concentrated
      </span>
    );
  }
  return (
    <span className="rounded border border-[--color-primary]/30 bg-[--color-primary]/10 px-2 py-0.5 text-[10px] text-[--color-primary] uppercase">
      Safe
    </span>
  );
}

function abbr(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toFixed(0);
}
