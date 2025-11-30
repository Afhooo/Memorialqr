export function TributeHighlightsSection() {
  return (
    <section className="animate-fade-rise delay-1 space-y-5">
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#a07c55]">
        <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#c9a36a] to-transparent" />
        <span>Circulo del homenaje</span>
        <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#c9a36a] to-transparent" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="h-full rounded-3xl border border-[#e3d2b9] bg-white/80 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#a07c55]">Obituario editorial</p>
          <h3 className="mt-2 text-xl font-serif text-[#2b2018]">Contexto y relato</h3>
          <p className="mt-2 text-[#3a2d22]">
            Quién fue, cómo vivió y qué huellas dejó. Claro, breve y respetuoso.
          </p>
        </article>
        <article className="h-full rounded-3xl border border-[#e3d2b9] bg-white/80 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#a07c55]">Cartas y condolencias</p>
          <h3 className="mt-2 text-xl font-serif text-[#2b2018]">Moderadas y serenas</h3>
          <p className="mt-2 text-[#3a2d22]">
            Se revisan antes de mostrarse. Solo queda lo que acompaña con calma.
          </p>
        </article>
        <article className="h-full rounded-3xl border border-[#e3d2b9] bg-white/80 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#a07c55]">Presencia simbólica</p>
          <h3 className="mt-2 text-xl font-serif text-[#2b2018]">Velas y detalles</h3>
          <p className="mt-2 text-[#3a2d22]">
            Velas, flores o palomas que siguen encendidas y recuerdan que el memorial está vivo.
          </p>
        </article>
      </div>
    </section>
  );
}
