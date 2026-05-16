/* ─────────── Birdeye API response types ─────────── */

export interface TokenOverview {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  liquidity: number;
  price: number;
  mc: number | null;
  volume24h: number;
  priceChange24h: number;
  holder: number;
  trade24h: number;
}

export interface TokenSecurity {
  mintable: boolean;
  freezable: boolean;
  top10HolderPercent: number;
  lpLocked: number;
  isHoneypot: boolean;
  ownerBalance: number;
}

export interface NewListing {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  liquidity: number;
  createdAt: number;
}

export interface TrendingToken {
  address: string;
  name: string;
  symbol: string;
  rank: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
}

export interface WalletTrader {
  address: string;
  pnl: number;
  winRate: number;
  totalTrades: number;
}

export interface TokenTransaction {
  txHash: string;
  timestamp: number;
  type: "buy" | "sell";
  amount: number;
  price: number;
  valueUsd: number;
}

export interface OHLCVData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
