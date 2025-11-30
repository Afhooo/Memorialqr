import Link from "next/link";

interface MemorialNavbarProps {
  memorialName: string;
  memoryCount: number;
  lastUpdatedLabel: string;
}

export function MemorialNavbar({ memorialName, memoryCount, lastUpdatedLabel }: MemorialNavbarProps) {
  return (
    <header className="flex items-center justify-between rounded-2xl border border-[#e3d2b9] bg-white/80 px-5 py-4 text-[#2f261f] shadow-[0_14px_50px_rgba(0,0,0,0.08)] backdrop-blur">
      <div className="flex items-center gap-3">
        <Link href="/" className="rounded-full border border-[#d9c5a4] bg-[#f9f3e8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#8c6a46]">
          Memento
        </Link>
        <span className="text-[11px] uppercase tracking-[0.32em] text-[#8f7558]">Memorial privado</span>
      </div>

      <div className="flex items-center gap-3 text-sm text-[#4b382a]">
        <span className="hidden rounded-full border border-[#e3d2b9] bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.32em] text-[#a07c55] sm:inline">
          {memorialName}
        </span>
        <span className="rounded-full border border-[#e3d2b9] bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.32em] text-[#a07c55]">
          {memoryCount} recuerdos
        </span>
        <span className="hidden text-xs uppercase tracking-[0.32em] text-[#8f7558] sm:inline">
          Último movimiento: {lastUpdatedLabel}
        </span>
      </div>
    </header>
  );
}
