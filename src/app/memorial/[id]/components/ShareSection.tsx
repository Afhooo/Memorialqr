export function ShareSection() {
  return (
    <section className="animate-fade-rise delay-3 rounded-[32px] border border-[#e0e0e0] bg-gradient-to-br from-white via-[#f7f7f7] to-[#eef2ef] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
      <p className="text-[10px] uppercase tracking-[0.45em] text-[#e87422]">Compartir el memorial</p>
      <div className="mt-3 grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <h3 className="text-xl font-serif text-[#333333]">Enlace íntimo</h3>
          <p className="text-[#4a4a4a]">
            Envía el enlace a la familia para que lean, dejen condolencias y vuelvan cuando lo necesiten. También pueden
            escanear el QR o un tag NFC para llegar directo.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-serif text-[#333333]">Moderación activa</h3>
          <p className="text-[#4a4a4a]">
            Revisa cada mensaje antes de publicarlo. Solo queda lo que acompaña con respeto.
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-serif text-[#333333]">Presencia continua</h3>
          <p className="text-[#4a4a4a]">
            Disponible 24/7 para aniversarios, velas digitales y nuevas fotos que mantengan viva la memoria.
          </p>
        </div>
      </div>
    </section>
  );
}
