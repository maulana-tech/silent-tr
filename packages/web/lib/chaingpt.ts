const CHAINGPT_BASE = "https://api.chaingpt.org/chat/stream";

function chaingptKey(): string {
  return (
    process.env.CHAINGPT_API_KEY ||
    ""
  );
}

export interface ChaingptResponse {
  data?: { bot?: string };
  status?: boolean;
  message?: string;
}

export async function chat(question: string, context?: string): Promise<string> {
  const key = chaingptKey();
  if (!key) return "ChainGPT API key not configured.";

  const body: Record<string, string> = {
    model: "general_assistant",
    question,
    chatHistory: "off",
  };
  if (context) body.context = context;

  const res = await fetch(CHAINGPT_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return `ChainGPT error (${res.status}). Check your credits.`;
  }

  const json: ChaingptResponse = await res.json();
  return json.data?.bot ?? json.message ?? "No response from ChainGPT.";
}

/* ─────────── Pre-built prompts ─────────── */

export async function analyzeToken(token: {
  name: string;
  symbol: string;
  address: string;
  price: number;
  liquidity: number;
  volume24h: number;
  priceChange24h: number;
  security?: { isHoneypot: boolean; top10HolderPercent: number; lpLocked: number; mintable: boolean; freezable: boolean };
}): Promise<string> {
  const sec = token.security;
  const riskFlags: string[] = [];
  if (sec?.isHoneypot) riskFlags.push("⚠️ HONEYPOT DETECTED — do NOT interact");
  if ((sec?.top10HolderPercent ?? 0) > 60)
    riskFlags.push(`⚠️ CONCENTRATED OWNERSHIP ${sec!.top10HolderPercent.toFixed(0)}% — high manipulation risk`);
  if (!sec?.lpLocked) riskFlags.push("⚠️ LP NOT LOCKED — rug pull risk");
  if (sec?.mintable) riskFlags.push("⚠️ MINTABLE — supply can be inflated");
  if (sec?.freezable) riskFlags.push("⚠️ FREEZABLE — funds can be frozen");

  const flags = riskFlags.length ? `\n\n⚠️ RISK FLAGS:\n${riskFlags.join("\n")}` : "";

  return chat(
    `Analyze this DeFi token and give a concise institutional risk report (3-4 sentences):\n\n` +
    `${token.name} (${token.symbol})\n` +
    `Address: ${token.address}\n` +
    `Price: $${fmt(token.price)}\n` +
    `24h Change: ${token.priceChange24h >= 0 ? "+" : ""}${token.priceChange24h.toFixed(1)}%\n` +
    `24h Volume: $${fmt(token.volume24h)}\n` +
    `Liquidity: $${fmt(token.liquidity)}` +
    `${flags}\n\n` +
    `Format: [RISK LEVEL] — brief analysis. Use HIGH/MEDIUM/LOW.`,
    "You are a professional DeFi risk analyst. Be concise and factual.",
  );
}

export async function generateTradeSignal(wallet: {
  address: string;
  pnl: number;
  winRate: number;
  totalTrades: number;
}): Promise<string> {
  const signal = wallet.pnl >= 0 ? "📈 BULLISH" : "📉 BEARISH";
  return chat(
    `Generate a copy-trade signal for this wallet. Be concise (2-3 sentences max):\n\n` +
    `Address: ${wallet.address}\n` +
    `Total PnL: ${wallet.pnl >= 0 ? "+" : ""}$${fmt(wallet.pnl)}\n` +
    `Win Rate: ${((wallet.winRate ?? 0) * 100).toFixed(0)}%\n` +
    `Total Trades: ${wallet.totalTrades}\n\n` +
    `Format: [${signal}] — what to watch, entry note, risk disclaimer.`,
    "You are a copy-trade signal generator. Be concise and include risk disclaimer.",
  );
}

export async function marketSentiment(tokens: Array<{
  name: string;
  symbol: string;
  priceChange24h: number;
  volume24h: number;
}>): Promise<string> {
  const movers = tokens
    .filter((t) => Math.abs(t.priceChange24h) > 5)
    .sort((a, b) => Math.abs(b.priceChange24h) - Math.abs(a.priceChange24h))
    .slice(0, 5);
  const avg = tokens.reduce((s, t) => s + t.priceChange24h, 0) / tokens.length;

  return chat(
    `Give a concise market sentiment report (3 sentences max):\n\n` +
    `Avg 24h change: ${avg >= 0 ? "+" : ""}${avg.toFixed(1)}%\n` +
    `Tokens analyzed: ${tokens.length}\n` +
    `Top movers (|change| > 5%):\n` +
    movers.map((m) => `  ${m.name} (${m.symbol}): ${m.priceChange24h >= 0 ? "+" : ""}${m.priceChange24h.toFixed(1)}%`).join("\n") +
    `\n\nFormat: sentiment (BULLISH/NEUTRAL/BEARISH) + key themes to watch.`,
    "You are a market sentiment analyst. Be concise and actionable.",
  );
}

export async function portfolioAdvice(holdings: Array<{
  name: string;
  symbol: string;
  valueUsd: number;
}>): Promise<string> {
  const total = holdings.reduce((s, h) => s + h.valueUsd, 0);
  return chat(
    `Give portfolio diversification advice (3 sentences max, institutional tone):\n\n` +
    `Total: $${fmt(total)}\n` +
    `Holdings:\n` +
    holdings
      .sort((a, b) => b.valueUsd - a.valueUsd)
      .slice(0, 10)
      .map((h) => `  ${h.name} (${h.symbol}): $${fmt(h.valueUsd)} (${((h.valueUsd / total) * 100).toFixed(1)}%)`)
      .join("\n") +
    `\n\nFormat: key risk + diversification recommendation.`,
    "You are a portfolio advisor. Never give financial advice, only educational analysis.",
  );
}

function fmt(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toFixed(2);
}