export function ShareSection() {
  return (
    <section
      id="compartir"
      className="animate-fade-rise delay-3 space-y-5 rounded-[24px] border border-[#e0e0e0] bg-gradient-to-r from-white via-[#f8fafc] to-[#eef2ef] p-6 text-[#0f172a] shadow-[0_18px_60px_rgba(0,0,0,0.08)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Compartir el memorial</p>
          <h3 className="text-xl font-serif text-[#0f172a]">Hazlo circular como un post privado</h3>
          <p className="text-sm text-[#4a4a4a]">Enlace, QR o mensaje directo para que todos lleguen al mismo lugar.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-[#0f172a]">
          <span className="flex items-center gap-2 rounded-full border border-[#e0e0e0] bg-white px-3 py-1 shadow-[0_8px_18px_rgba(0,0,0,0.05)]">
            <span>🔗</span> Copiar enlace
          </span>
          <span className="flex items-center gap-2 rounded-full border border-[#e0e0e0] bg-white px-3 py-1 shadow-[0_8px_18px_rgba(0,0,0,0.05)]">
            <span>📱</span> Enviar por chat
          </span>
          <span className="flex items-center gap-2 rounded-full border border-[#e0e0e0] bg-white px-3 py-1 shadow-[0_8px_18px_rgba(0,0,0,0.05)]">
            <span>🖨️</span> Descargar QR
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2 rounded-2xl border border-[#e5e7eb] bg-white/90 p-4 text-[#0f172a] shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e87422]/10 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-[#c2410c]">
            🔒 Enlace íntimo
          </span>
          <h4 className="text-base font-semibold text-[#0f172a]">Enlace íntimo</h4>
          <p className="text-sm text-[#4a4a4a]">
            Envía el enlace para que lean, dejen condolencias y vuelvan cuando lo necesiten.
          </p>
        </div>
        <div className="space-y-2 rounded-2xl border border-[#e5e7eb] bg-white/90 p-4 text-[#0f172a] shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#4caf50]/12 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-[#2e7d32]">
            🕯️ Moderación activa
          </span>
          <h4 className="text-base font-semibold text-[#0f172a]">Moderación activa</h4>
          <p className="text-sm text-[#4a4a4a]">Revisa cada mensaje antes de publicarlo. Solo queda lo que acompaña.</p>
        </div>
        <div className="space-y-2 rounded-2xl border border-[#e5e7eb] bg-white/90 p-4 text-[#0f172a] shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#0f172a]/8 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-[#0f172a]">
            ♾️ Presencia continua
          </span>
          <h4 className="text-base font-semibold text-[#0f172a]">Presencia continua</h4>
          <p className="text-sm text-[#4a4a4a]">
            Disponible 24/7 para aniversarios, velas digitales y nuevas fotos que mantengan viva la memoria.
          </p>
        </div>
      </div>
    </section>
  );
}
