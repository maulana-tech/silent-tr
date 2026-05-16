export function StatsCard({
  label,
  value,
  change,
  loading,
}: {
  label: string;
  value: string;
  change?: string;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="glass-card rounded p-4">
        <div className="mb-2 h-3 w-20 animate-pulse rounded bg-zinc-800" />
        <div className="h-6 w-28 animate-pulse rounded bg-zinc-800" />
      </div>
    );
  }
  const isUp = change?.startsWith("+");
  return (
    <div className="glass-card rounded p-4">
      <p className="text-[10px] uppercase tracking-widest text-zinc-500">
        {label}
      </p>
      <p className="mt-1 font-mono text-lg font-bold text-white">{value}</p>
      {change && (
        <p
          className={`font-mono text-xs ${
            isUp ? "text-[--color-success]" : "text-[--color-danger]"
          }`}
        >
          {change}
        </p>
      )}
    </div>
  );
}
