import { getTopTraders, getWalletPortfolio, getTrendingTokens } from "@/lib/birdeye-api";
import { portfolioAdvice } from "@/lib/chaingpt";

export interface TopTrader {
  address: string;
  pnl: number;
  winRate: number;
  totalTrades: number;
  rank: number;
  isDemo?: boolean;
}

function seeded(addr: string, salt: number): number {
  let h = 0;
  for (let i = 0; i < addr.length; i++) {
    h = (Math.imul(31, h) + addr.charCodeAt(i)) | 0;
  }
  return ((h >>> 0) + salt) / 0xffffffff;
}

function generateFallback(chain: string, count = 20): TopTrader[] {
  const isEth = chain !== "solana";

  return Array.from({ length: count }, (_, i) => {
    const seed = i * 7919 + (isEth ? 0x42 : 0x88);
    const symbols = isEth
      ? ["WETH", "USDC", "DAI", "WBTC", "LINK", "UNI", "AAVE", "CRV", "MKR", "COMP"]
      : ["SOL", "USDC", "RAY", "MNGO", "BONK", "JTO", "DRIP", "GRAPH", "STSOL", "LDO"];

    const addr = isEth
      ? `0x${(seed * 7 + 0x1e).toString(16).padStart(40, "0").slice(0, 40)}`
      : `${symbols[i % symbols.length].slice(0, 3).toLowerCase()}${(seed * 13).toString(36).slice(0, 35)}`;

    const pnlRaw = seeded(addr, 1);
    const winRaw = seeded(addr, 2);
    const tradesRaw = seeded(addr, 3);

    return {
      address: addr,
      pnl: Math.round((pnlRaw - 0.35) * 8_000_000 * 100) / 100,
      winRate: Math.round((0.35 + winRaw * 0.5) * 100) / 100,
      totalTrades: Math.floor(100 + tradesRaw * 8000),
      rank: i + 1,
      isDemo: true,
    };
  });
}

export async function getTopTradersWithFallback(
  chain = "ethereum",
  limit = 20,
): Promise<TopTrader[]> {
  try {
    const data = await getTopTraders(chain, limit);
    if (data.items && data.items.length > 0) {
      return data.items.map((t, i) => ({
        address: t.address,
        pnl: t.pnl,
        winRate: t.winRate ?? 0,
        totalTrades: t.totalTrades,
        rank: i + 1,
      }));
    }
  } catch { /* fallback */ }
  return generateFallback(chain, limit);
}

export { getWalletPortfolio, getTrendingTokens, portfolioAdvice };