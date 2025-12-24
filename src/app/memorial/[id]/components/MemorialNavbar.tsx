import Link from "next/link";

interface MemorialNavbarProps {
  memorialName: string;
  memoryCount: number;
  lastUpdatedLabel: string;
}

export function MemorialNavbar({ memorialName, memoryCount, lastUpdatedLabel }: MemorialNavbarProps) {
  const items = [
    { href: "#hero", label: "Portada" },
    { href: "#fotos", label: "Fotos" },
    { href: "#intro", label: "Presentación" },
    { href: "#muro", label: "Cinta" },
    { href: "#historia", label: "Línea de vida" },
    { href: "#compartir", label: "Compartir" },
  ];

  return (
    <nav className="relative flex h-fit flex-col gap-4 overflow-hidden rounded-[22px] border border-white/50 bg-white/85 px-4 py-4 text-[#0f172a] shadow-[0_16px_50px_rgba(0,0,0,0.14)] backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(255,168,125,0.12),transparent_36%),radial-gradient(circle_at_78%_0%,rgba(90,178,255,0.12),transparent_32%)]" />
      <div className="relative flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#e87422]">Memorial</p>
          <p className="text-base font-semibold text-[#0f172a] leading-tight">{memorialName}</p>
          <p className="text-xs text-[#64748b]">{memoryCount} entradas · Último: {lastUpdatedLabel}</p>
        </div>
        <Link
          href="/"
          className="rounded-full bg-[#0f172a] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.24)] transition hover:-translate-y-[1px]"
        >
          Inicio
        </Link>
      </div>

      <div className="relative grid gap-1.5 rounded-2xl border border-[#e2e8f0] bg-white/80 p-2 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center justify-between rounded-xl px-3 py-2 transition hover:-translate-y-[1px] hover:bg-[#f8fafc]"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#0f172a]">{item.label}</span>
            </div>
            <span className="text-[11px] uppercase tracking-[0.12em] text-[#94a3b8] group-hover:text-[#e87422]">Ir</span>
          </Link>
        ))}
      </div>

      <div className="relative flex items-center gap-2 rounded-2xl border border-[#e2e8f0] bg-white/80 px-3 py-2 text-sm text-[#0f172a] shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <div className="flex-1">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#94a3b8]">Actividad</p>
          <p className="font-semibold text-[#0f172a]">Familia mirando y comentando</p>
        </div>
        <span className="rounded-full bg-[#e87422]/15 px-3 py-1 text-[11px] font-semibold text-[#e87422]">Privado</span>
      </div>
    </nav>
  );
}
