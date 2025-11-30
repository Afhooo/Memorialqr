import { formatDate } from "./dateUtils";
import { HeroBackgroundVideo } from "@/components/HeroBackgroundVideo";

const heroVideoSources = ["/m1.mp4", "/m2.mp4", "/a1.mp4"];

interface HeroSectionProps {
  memorialName: string;
  birthDate: string | null;
  deathDate: string | null;
  description: string | null;
  memoryCount: number;
  memoryWindow: string;
  lastUpdated: string | null;
}

export function HeroSection({
  memorialName,
  birthDate,
  deathDate,
  description,
  memoryCount,
  memoryWindow,
  lastUpdated,
}: HeroSectionProps) {
  return (
    <section className="relative -mx-4 overflow-hidden rounded-[38px] bg-gradient-to-b from-[#0c0b0a] via-[#151019] to-[#1a1410] px-4 pb-14 pt-12 text-[#f7f0e6] shadow-[0_40px_140px_rgba(0,0,0,0.45)] sm:-mx-8 sm:px-8 md:-mx-12 md:px-12">
      <HeroBackgroundVideo sources={heroVideoSources} />
      <div className="pointer-events-none absolute left-[-15%] top-[-20%] h-80 w-80 rounded-full bg-[#c9a36a]/25 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10%] top-1/4 h-72 w-72 rounded-full bg-[#f9e7c4]/15 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,rgba(255,255,255,0.06),transparent_45%)]" />

      <div className="relative z-10 space-y-10">
        <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-[#f0d7b2]/80">
          <span className="rounded-full border border-[#f0d7b2]/40 bg-white/5 px-4 py-1">Memorial vivo</span>
          <span className="h-px w-12 bg-gradient-to-r from-transparent via-[#f0d7b2] to-transparent" />
          <span className="text-[#d7b07a]">Memento</span>
          <span className="h-px w-12 bg-gradient-to-r from-transparent via-[#f0d7b2] to-transparent" />
          <span className="rounded-full border border-white/10 px-4 py-1">Compartible</span>
        </div>

        <div className="space-y-7 lg:max-w-5xl">
          <div className="space-y-3">
            <h1 className="text-4xl font-serif leading-tight text-[#f8efe0] md:text-5xl lg:text-6xl">{memorialName}</h1>
            <p className="text-xs uppercase tracking-[0.42em] text-[#e3c89e]">
              {formatDate(birthDate)} · {formatDate(deathDate)}
            </p>
          </div>
          <p className="max-w-3xl text-lg leading-relaxed text-[#e6d8c3]">
            {description || "Un lugar sereno para contar quién fue y acompañar a la familia, incluso a la distancia."}
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#f0d7b2]/35 bg-white/5 p-4 shadow-[0_15px_45px_rgba(0,0,0,0.25)]">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#e3c89e]">Recuerdos curados</p>
              <p className="mt-2 text-3xl font-serif text-[#f8efe0]">{memoryCount}</p>
              <p className="text-sm text-[#e6d8c3]/90">
                {memoryCount ? "Capítulos publicados y visibles" : "Aún no hay memorias cargadas"}
              </p>
            </div>
            <div className="rounded-2xl border border-[#f0d7b2]/35 bg-white/5 p-4 shadow-[0_15px_45px_rgba(0,0,0,0.25)]">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#e3c89e]">Ventana de memorias</p>
              <p className="mt-2 text-xl font-serif text-[#f8efe0]">{memoryWindow}</p>
              <p className="text-sm text-[#e6d8c3]/90">Fechas de los aportes</p>
            </div>
            <div className="rounded-2xl border border-[#f0d7b2]/35 bg-white/5 p-4 shadow-[0_15px_45px_rgba(0,0,0,0.25)]">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#e3c89e]">Última actualización</p>
              <p className="mt-2 text-2xl font-serif text-[#f8efe0]">{formatDate(lastUpdated)}</p>
              <p className="text-sm text-[#e6d8c3]/90">Último movimiento del espacio</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.35em] text-[#e3c89e]">
            <span className="rounded-full border border-[#f0d7b2]/40 bg-white/10 px-4 py-2">Sin anuncios</span>
            <span className="rounded-full border border-[#f0d7b2]/40 bg-white/10 px-4 py-2">Enlace íntimo</span>
            <span className="rounded-full border border-[#f0d7b2]/40 bg-white/10 px-4 py-2">Velas digitales</span>
          </div>
        </div>
      </div>
    </section>
  );
}
