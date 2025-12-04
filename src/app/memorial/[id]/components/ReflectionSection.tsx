import { formatDate } from "./dateUtils";
import { MemoryComposer } from "./MemoryComposer";
import type { Memory } from "@/lib/types";

interface ReflectionSectionProps {
  memorialId: string;
  memorialName: string;
  birthDate: string | null;
  deathDate: string | null;
  memories: Memory[];
  canPost: boolean;
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

export function ReflectionSection({ memorialId, memorialName, birthDate, deathDate, memories, canPost }: ReflectionSectionProps) {
  const latestLetters = memories.slice(0, 2);
  const upcomingAnniversary = nextAnniversary(deathDate);

  return (
    <section className="animate-fade-rise rounded-[28px] border border-[#e0e0e0] bg-gradient-to-br from-white via-[#f7f7f7] to-[#eef2ef] p-8 shadow-[0_22px_70px_rgba(0,0,0,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.38em] text-[#e87422]">Espacio de la familia</p>
          <h2 className="text-2xl font-serif text-[#333333]">Cartas y notas para {memorialName}</h2>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <MemoryComposer
            memorialId={memorialId}
            disabled={!canPost}
            helper={
              canPost
                ? "Solo la familia y administradores verán los mensajes hasta que decidas publicarlos."
                : "Inicia sesión con la cuenta de la familia para publicar y guardar mensajes."
            }
          />
          {latestLetters.length ? (
            latestLetters.map((memory) => (
              <article key={memory.id} className="rounded-2xl border border-[#e0e0e0] bg-white/95 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-[#e87422]">
                  <span>Carta familiar</span>
                  <span>{formatDate(memory.created_at)}</span>
                </div>
                <h3 className="mt-2 text-xl font-serif text-[#333333]">{memory.title}</h3>
                <p className="mt-2 text-[#4a4a4a]">{memory.content}</p>
              </article>
            ))
          ) : (
            <div className="space-y-3 rounded-2xl border border-dashed border-[#d5d5d5] bg-white/85 p-5 text-[#4a4a4a] shadow-[0_10px_34px_rgba(0,0,0,0.05)]">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Aún sin cartas</p>
              <p className="text-lg font-serif text-[#333333]">Escribe la primera nota</p>
              <p>Una anécdota breve, un recuerdo o algo que te hubiera gustado decirle. Este espacio es solo para la familia.</p>
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-2xl border border-[#e0e0e0] bg-white/95 p-5 shadow-[0_16px_50px_rgba(0,0,0,0.06)]">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Fechas para acompañar</p>
            <ul className="space-y-2 text-sm text-[#4a4a4a]">
              {deathDate && (
                <li className="flex items-center justify-between rounded-xl bg-[#f6f6f6] px-3 py-2">
                  <span>Próximo aniversario</span>
                  <span className="font-semibold text-[#333333]">{upcomingAnniversary ? formatDate(upcomingAnniversary) : formatDate(deathDate)}</span>
                </li>
              )}
              {birthDate && (
                <li className="flex items-center justify-between rounded-xl bg-[#f6f6f6] px-3 py-2">
                  <span>Fecha de nacimiento</span>
                  <span className="font-semibold text-[#333333]">{formatDate(birthDate)}</span>
                </li>
              )}
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Ideas para escribir</p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-[#4a4a4a]">
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
