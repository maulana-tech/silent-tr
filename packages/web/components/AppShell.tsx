import { Header } from "./Header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-14">
        <div className="mx-auto max-w-[1400px] px-6 py-8">{children}</div>
      </main>
    </>
  );
}
