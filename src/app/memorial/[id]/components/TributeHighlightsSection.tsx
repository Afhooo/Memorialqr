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
    <section id="intro" className="relative space-y-8 text-slate-900">
      <div className="space-y-4">
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-600">Para quienes lo quisieron</p>
        <h2 className="text-3xl lg:text-4xl font-serif leading-tight">Quién fue {memorialName} para su gente</h2>
        <p className="max-w-4xl text-base leading-relaxed text-slate-600 font-light">
          {description ||
            "Más que un gran personaje, alguien cotidiano al que extrañamos. Aquí quedan los momentos simples: sobremesas, audios, chistes internos y las fotos de siempre."}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-slate-200/50">
        {birthDate && (
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-slate-400 mb-1">Nació</span>
            <span className="text-sm font-medium text-slate-800">{formatDate(birthDate)}</span>
          </div>
        )}
        {(birthDate || deathDate) && <div className="h-8 w-px bg-slate-200/60 hidden sm:block" />}
        {deathDate && (
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-slate-400 mb-1">Despedida</span>
            <span className="text-sm font-medium text-slate-800">{formatDate(deathDate)}</span>
          </div>
        )}
        <div className="h-8 w-px bg-slate-200/60 hidden sm:block" />
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-slate-400 mb-1">Periodo</span>
          <span className="text-sm font-medium text-slate-800">{memoryWindow}</span>
        </div>
        <div className="h-8 w-px bg-slate-200/60 hidden sm:block" />
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-slate-400 mb-1">Acceso</span>
          <span className="text-sm font-medium text-slate-800">Familia y amigos</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 pt-4">
        <div className="group rounded-2xl bg-white/40 p-5 ring-1 ring-slate-900/5 transition hover:bg-white/60">
          <span className="mb-3 block h-[2px] w-8 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all group-hover:w-12" />
          <p className="text-sm text-slate-600 leading-relaxed font-light">Ficha breve: fechas, barrio, y la frase que más repetía en casa.</p>
        </div>
        <div className="group rounded-2xl bg-white/40 p-5 ring-1 ring-slate-900/5 transition hover:bg-white/60">
          <span className="mb-3 block h-[2px] w-8 rounded-full bg-gradient-to-r from-sky-400 to-blue-600 transition-all group-hover:w-12" />
          <p className="text-sm text-slate-600 leading-relaxed font-light">Un relato corrido que se mezcla con la cinta, como un hilo de cariño.</p>
        </div>
        <div className="group rounded-2xl bg-white/40 p-5 ring-1 ring-slate-900/5 transition hover:bg-white/60">
          <span className="mb-3 block h-[2px] w-8 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all group-hover:w-12" />
          <p className="text-sm text-slate-600 leading-relaxed font-light">Lo esencial, sin adornos: familia, apodos y momentos de casa.</p>
        </div>
      </div>
    </section>
  );
}
