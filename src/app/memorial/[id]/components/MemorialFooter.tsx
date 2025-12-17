interface MemorialFooterProps {
  memorialName: string;
}

export function MemorialFooter({ memorialName }: MemorialFooterProps) {
  return (
    <footer className="rounded-2xl bg-white/75 px-5 py-6 text-[#0f172a] shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Memorial cuidado</p>
          <p className="text-lg font-serif text-[#0f172a]">Gracias por mantener vivo el recuerdo de {memorialName}.</p>
        </div>
        <p className="text-sm text-[#475569]">Seguimos aquí para añadir fotos, velas o actualizar fechas cuando lo necesites.</p>
      </div>
    </footer>
  );
}
