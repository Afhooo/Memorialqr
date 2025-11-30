import { formatDate } from "./dateUtils";
import type { Memory } from "@/lib/types";

interface ReflectionSectionProps {
  memorialName: string;
  birthDate: string | null;
  deathDate: string | null;
  memories: Memory[];
}

const nextAnniversary = (date: string | null) => {
  if (!date) return null;
  const now = new Date();
  const original = new Date(date);
  if (Number.isNaN(original.getTime())) return null;
  const year = now.getFullYear();
  const candidate = new Date(year, original.getMonth(), original.getDate());
  if (candidate < now) {
    candidate.setFullYear(year + 1);
  }
  return candidate.toISOString();
};

export function ReflectionSection({ memorialName, birthDate, deathDate, memories }: ReflectionSectionProps) {
  const latestLetters = memories.slice(0, 2);
  const upcomingAnniversary = nextAnniversary(deathDate);

  return (
    <section className="animate-fade-rise rounded-[28px] border border-[#e3d2b9] bg-gradient-to-br from-white via-[#fbf5ed] to-[#f6ead8] p-8 shadow-[0_22px_70px_rgba(0,0,0,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.38em] text-[#a07c55]">Espacio de la familia</p>
          <h2 className="text-2xl font-serif text-[#2b2018]">Cartas y notas para {memorialName}</h2>
        </div>
        <div className="rounded-full border border-[#c9a36a]/60 bg-white/80 px-4 py-2 text-[11px] uppercase tracking-[0.32em] text-[#7b5b3d] shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
          Pronto podrás dejar mensajes aquí
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          {latestLetters.length ? (
            latestLetters.map((memory) => (
              <article key={memory.id} className="rounded-2xl border border-[#eadfcd] bg-white/90 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-[#a07c55]">
                  <span>Carta familiar</span>
                  <span>{formatDate(memory.created_at)}</span>
                </div>
                <h3 className="mt-2 text-xl font-serif text-[#2b2018]">{memory.title}</h3>
                <p className="mt-2 text-[#3a2d22]">{memory.content}</p>
              </article>
            ))
          ) : (
            <div className="space-y-3 rounded-2xl border border-dashed border-[#d8c6a4] bg-white/85 p-5 text-[#3a2d22] shadow-[0_10px_34px_rgba(0,0,0,0.05)]">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#a07c55]">Aún sin cartas</p>
              <p className="text-lg font-serif text-[#2b2018]">Escribe la primera nota</p>
              <p>Una anécdota breve, un recuerdo o algo que te hubiera gustado decirle. Este espacio es solo para la familia.</p>
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-2xl border border-[#e3d2b9] bg-white/90 p-5 shadow-[0_16px_50px_rgba(0,0,0,0.06)]">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#a07c55]">Fechas para acompañar</p>
            <ul className="space-y-2 text-sm text-[#3a2d22]">
              {deathDate && (
                <li className="flex items-center justify-between rounded-xl bg-[#f9f3e9] px-3 py-2">
                  <span>Próximo aniversario</span>
                  <span className="font-semibold text-[#2b2018]">{upcomingAnniversary ? formatDate(upcomingAnniversary) : formatDate(deathDate)}</span>
                </li>
              )}
              {birthDate && (
                <li className="flex items-center justify-between rounded-xl bg-[#f9f3e9] px-3 py-2">
                  <span>Fecha de nacimiento</span>
                  <span className="font-semibold text-[#2b2018]">{formatDate(birthDate)}</span>
                </li>
              )}
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#a07c55]">Ideas para escribir</p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-[#3a2d22]">
              <li>Un momento cotidiano que recuerdes y por qué fue importante.</li>
              <li>Algo que aprendiste de {memorialName} y aplicas hoy.</li>
              <li>Una foto que quieras subir y el contexto detrás de ella.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
