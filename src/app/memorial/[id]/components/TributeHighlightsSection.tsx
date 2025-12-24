import { formatDate } from "./dateUtils";

interface TributeHighlightsSectionProps {
  memorialName: string;
  description: string | null;
  birthDate: string | null;
  deathDate: string | null;
  memoryWindow: string;
}

export function TributeHighlightsSection({
  memorialName,
  description,
  birthDate,
  deathDate,
  memoryWindow,
}: TributeHighlightsSectionProps) {
  return (
    <section id="intro" className="relative space-y-4 pl-6 text-[#0f172a]">
      <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-gradient-to-b from-[#e87422] via-[#0ea5e9] to-transparent" />
      <p className="text-[11px] uppercase tracking-[0.32em] text-[#e87422]">Para quienes lo quisieron</p>
      <h2 className="text-2xl font-serif leading-tight">Quién fue {memorialName} para su gente</h2>
      <p className="max-w-4xl text-base leading-relaxed text-[#374151]">
        {description ||
          "Más que un gran personaje, alguien cotidiano al que extrañamos. Aquí quedan los momentos simples: sobremesas, audios, chistes internos y las fotos de siempre."}
      </p>
      <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.24em] text-[#0f172a]/80">
        {birthDate && (
          <span className="rounded-full bg-[#0f172a]/5 px-3 py-1 font-semibold text-[#0f172a]">Nació {formatDate(birthDate)}</span>
        )}
        {deathDate && (
          <span className="rounded-full bg-[#0f172a]/5 px-3 py-1 font-semibold text-[#0f172a]">Lo despedimos {formatDate(deathDate)}</span>
        )}
        <span className="rounded-full bg-[#0f172a]/5 px-3 py-1 font-semibold text-[#0f172a]">Periodo {memoryWindow}</span>
        <span className="rounded-full bg-[#0f172a]/5 px-3 py-1 font-semibold text-[#0f172a]">Familia y amigos</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex items-start gap-3 text-sm text-[#334155]">
          <span className="mt-1 h-9 w-[3px] rounded-full bg-gradient-to-b from-[#f59e0b] via-[#fb923c] to-transparent" />
          <p>Ficha breve: fechas, barrio, y la frase que más repetía en casa.</p>
        </div>
        <div className="flex items-start gap-3 text-sm text-[#334155]">
          <span className="mt-1 h-9 w-[3px] rounded-full bg-gradient-to-b from-[#22d3ee] via-[#60a5fa] to-transparent" />
          <p>Un relato corrido que se mezcla con la cinta, como un hilo que se sigue escribiendo con cariño.</p>
        </div>
        <div className="flex items-start gap-3 text-sm text-[#334155]">
          <span className="mt-1 h-9 w-[3px] rounded-full bg-gradient-to-b from-[#10b981] via-[#34d399] to-transparent" />
          <p>Lo esencial, sin adornos: familia, apodos y momentos de casa.</p>
        </div>
      </div>
    </section>
  );
}
