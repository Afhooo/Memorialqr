export function ShareSection() {
  return (
    <section className="animate-fade-rise delay-3 rounded-[32px] border border-[#e3d2b9] bg-gradient-to-br from-white via-[#fbf5ed] to-[#f3e6d4] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
      <p className="text-[10px] uppercase tracking-[0.45em] text-[#a07c55]">Compartir el memorial</p>
      <div className="mt-3 grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <h3 className="text-xl font-serif text-[#2b2018]">Enlace íntimo</h3>
          <p className="text-[#3a2d22]">
            Envía el enlace a la familia para que lean, dejen condolencias y vuelvan cuando lo necesiten.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-serif text-[#2b2018]">Moderación activa</h3>
          <p className="text-[#3a2d22]">
            Revisa cada mensaje antes de publicarlo. Solo queda lo que acompaña con respeto.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-serif text-[#2b2018]">Presencia continua</h3>
          <p className="text-[#3a2d22]">
            Disponible 24/7 para aniversarios, velas digitales y nuevas fotos que mantengan viva la memoria.
          </p>
        </div>
      </div>
    </section>
  );
}
