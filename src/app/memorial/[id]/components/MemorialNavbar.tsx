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
    <nav className="relative flex flex-col gap-6 overflow-hidden rounded-3xl bg-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-900/5 backdrop-blur-2xl transition-all hover:shadow-[0_8px_40px_rgb(0,0,0,0.06)]">
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-600">Espacio Preservado</span>
        <h3 className="text-2xl font-serif text-slate-900 leading-none">{memorialName}</h3>
        <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">{memoryCount} Registros</p>
      </div>

      <div className="relative z-10 flex flex-col gap-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-300 hover:bg-slate-900/5 hover:scale-[1.02]"
          >
            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-widest">{item.label}</span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 group-hover:text-amber-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
              Navegar
            </span>
          </Link>
        ))}
      </div>

      <div className="relative z-10 mt-2 rounded-2xl bg-amber-50/50 border border-amber-100/50 p-4">
        <p className="text-[10px] uppercase tracking-widest text-amber-600/70 font-semibold mb-1">Actividad Reciente</p>
        <p className="text-xs font-medium text-slate-700 leading-relaxed">Última actualización: {lastUpdatedLabel}</p>
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-slate-200/60 pt-6 mt-2">
        <Link
          href="/"
          className="text-xs font-semibold text-slate-500 hover:text-amber-600 transition-colors uppercase tracking-widest"
        >
          ← Volver al inicio
        </Link>
      </div>
    </nav>
  );
}
