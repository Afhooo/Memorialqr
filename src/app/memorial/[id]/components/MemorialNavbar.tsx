import Link from "next/link";

interface MemorialNavbarProps {
  memorialName: string;
  memoryCount: number;
  lastUpdatedLabel: string;
}

export function MemorialNavbar({ memorialName, memoryCount, lastUpdatedLabel }: MemorialNavbarProps) {
  return (
    <header className="flex items-center justify-between rounded-2xl border border-[#e0e0e0] bg-white/90 px-5 py-4 text-[#333333] shadow-[0_14px_50px_rgba(0,0,0,0.06)] backdrop-blur">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="rounded-full border border-[#e87422] bg-[#e87422]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-[#e87422]"
        >
          Recuerdame
        </Link>
        <span className="text-[11px] uppercase tracking-[0.32em] text-[#555555]">Memorial privado</span>
      </div>

      <div className="flex items-center gap-3 text-sm text-[#4a4a4a]">
        <span className="hidden rounded-full border border-[#e0e0e0] bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.32em] text-[#e87422] sm:inline">
          {memorialName}
        </span>
        <span className="rounded-full border border-[#e0e0e0] bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.32em] text-[#e87422]">
          {memoryCount} recuerdos
        </span>
        <span className="hidden text-xs uppercase tracking-[0.32em] text-[#555555] sm:inline">
          Último movimiento: {lastUpdatedLabel}
        </span>
      </div>
    </header>
  );
}
