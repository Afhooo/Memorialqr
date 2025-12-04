interface MemorialFooterProps {
  memorialName: string;
}

export function MemorialFooter({ memorialName }: MemorialFooterProps) {
  return (
    <footer className="rounded-[28px] border border-[#e0e0e0] bg-white/90 px-6 py-7 text-[#4a4a4a] shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.42em] text-[#e87422]">Memorial cuidado</p>
          <p className="text-lg font-serif text-[#333333]">Gracias por mantener vivo el recuerdo de {memorialName}.</p>
        </div>
        <div className="text-sm text-[#555555]">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#e87422]">Necesitas ayuda</p>
          <p className="text-[#4a4a4a]">Escribe cuando quieras para añadir fotos, velas o actualizar datos.</p>
        </div>
      </div>
    </footer>
  );
}
