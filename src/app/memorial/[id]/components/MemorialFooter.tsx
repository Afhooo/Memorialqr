interface MemorialFooterProps {
  memorialName: string;
}

export function MemorialFooter({ memorialName }: MemorialFooterProps) {
  return (
    <footer className="rounded-[28px] border border-[#e3d2b9] bg-white/80 px-6 py-7 text-[#3a2d22] shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.42em] text-[#a07c55]">Memorial cuidado</p>
          <p className="text-lg font-serif text-[#2b2018]">Gracias por mantener vivo el recuerdo de {memorialName}.</p>
        </div>
        <div className="text-sm text-[#5e4430]">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#8f7558]">Necesitas ayuda</p>
          <p className="text-[#3a2d22]">Escribe cuando quieras para añadir fotos, velas o actualizar datos.</p>
        </div>
      </div>
    </footer>
  );
}
