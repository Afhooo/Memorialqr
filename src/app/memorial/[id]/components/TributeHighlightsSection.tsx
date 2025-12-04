export function TributeHighlightsSection() {
  return (
    <section className="animate-fade-rise delay-1 space-y-5">
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#e87422]">
        <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
        <span>Circulo del homenaje</span>
        <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="h-full rounded-3xl border border-[#e0e0e0] bg-white/90 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#e87422]">Obituario editorial</p>
          <h3 className="mt-2 text-xl font-serif text-[#333333]">Contexto y relato</h3>
          <p className="mt-2 text-[#4a4a4a]">
            Quién fue, cómo vivió y qué huellas dejó. Claro, breve y respetuoso.
          </p>
        </article>
        <article className="h-full rounded-3xl border border-[#e0e0e0] bg-white/90 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#e87422]">Cartas y condolencias</p>
          <h3 className="mt-2 text-xl font-serif text-[#333333]">Moderadas y serenas</h3>
          <p className="mt-2 text-[#4a4a4a]">
            Se revisan antes de mostrarse. Solo queda lo que acompaña con calma.
          </p>
        </article>
        <article className="h-full rounded-3xl border border-[#e0e0e0] bg-white/90 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#e87422]">Presencia simbólica</p>
          <h3 className="mt-2 text-xl font-serif text-[#333333]">Velas y detalles</h3>
          <p className="mt-2 text-[#4a4a4a]">
            Velas, flores o palomas que siguen encendidas y recuerdan que el memorial está vivo.
          </p>
        </article>
      </div>
    </section>
  );
}
