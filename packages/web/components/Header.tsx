"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "◈" },
  { href: "/radar", label: "Radar", icon: "◈" },
  { href: "/trending", label: "Trending", icon: "◈" },
  { href: "/whale-tracker", label: "Whale", icon: "◈" },
  { href: "/signals", label: "Signals", icon: "◈" },
  { href: "/analyze", label: "Analyze", icon: "◈" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 z-50 flex h-14 w-full items-center border-b border-[--color-border] bg-[--color-bg]/90 px-6 backdrop-blur-xl">
      <Link href="/" className="mr-8 flex items-center gap-2 shrink-0">
        <span className="font-mono text-lg font-bold tracking-tight text-[--color-primary]">
          ST
        </span>
        <span className="hidden sm:block font-mono text-xs uppercase tracking-widest text-[--color-primary]">
          Silent Tracker
        </span>
      </Link>

      <nav className="flex items-center gap-0.5 overflow-x-auto">
        {NAV.map(({ href, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`shrink-0 rounded px-3 py-1.5 text-[10px] uppercase tracking-wider transition-colors ${
                active
                  ? "text-[--color-primary]"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}