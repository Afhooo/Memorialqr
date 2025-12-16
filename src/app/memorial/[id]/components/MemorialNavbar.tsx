import Link from "next/link";

interface MemorialNavbarProps {
  memorialName: string;
  memoryCount: number;
  lastUpdatedLabel: string;
}

export function MemorialNavbar({ memorialName, memoryCount, lastUpdatedLabel }: MemorialNavbarProps) {
  return (
    <header className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-[#111827] shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
      <Link
        href="/"
        className="rounded-full border border-[#e5e7eb] bg-[#f8fafc] px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#0f172a] transition hover:border-[#e87422] hover:text-[#e87422]"
      >
        Inicio
      </Link>
      <span className="rounded-full bg-[#f4f4f5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#0f172a]">
        Muro de {memorialName}
      </span>
      <span className="rounded-full border border-[#e5e7eb] bg-white px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-[#6b7280]">
        {memoryCount} recuerdos
      </span>
      <span className="rounded-full border border-[#e5e7eb] bg-white px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-[#6b7280]">
        Último movimiento: {lastUpdatedLabel}
      </span>
      <div className="ml-auto flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-[#0f172a]">
        <Link
          href="#muro"
          className="rounded-full bg-[#e87422]/10 px-3 py-1 font-semibold text-[#e87422] transition hover:bg-[#e87422]/20"
        >
          Muro
        </Link>
        <Link
          href="#galeria"
          className="rounded-full border border-[#e5e7eb] px-3 py-1 font-semibold text-[#0f172a] transition hover:border-[#e87422] hover:text-[#e87422]"
        >
          Fotos / video
        </Link>
      </div>
    </header>
  );
}
