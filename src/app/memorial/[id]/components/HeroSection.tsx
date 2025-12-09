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
  const isNeruda = memorialName.trim().toLowerCase() === "pablo neruda";
  const profileSrc = isNeruda ? "/neruda-profile.png" : null;

  return (
    <section className="relative -mx-4 overflow-hidden rounded-[38px] bg-gradient-to-b from-[#1f1f1f] via-[#2a2a2a] to-[#1a1a1a] px-4 pb-14 pt-12 text-white shadow-[0_40px_140px_rgba(0,0,0,0.45)] sm:-mx-8 sm:px-8 md:-mx-12 md:px-12">
      <HeroBackgroundVideo sources={heroVideoSources} />
      <div className="pointer-events-none absolute left-[-15%] top-[-20%] h-80 w-80 rounded-full bg-[#4caf50]/18 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10%] top-1/4 h-72 w-72 rounded-full bg-[#e87422]/18 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,rgba(255,255,255,0.06),transparent_45%)]" />

      <div className="relative z-10 space-y-10">
        <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-white/75">
          <span className="rounded-full border border-white/25 bg-white/5 px-4 py-1">Memorial vivo</span>
          <span className="h-px w-12 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          <span className="text-[#ff9800]">Recuerdame</span>
          <span className="h-px w-12 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          <span className="rounded-full border border-white/15 px-4 py-1">Compartible</span>
        </div>

        <div className="space-y-7 lg:max-w-5xl">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              {profileSrc && (
                <div className="h-16 w-16 overflow-hidden rounded-full border border-white/30 bg-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
                  <img src={profileSrc} alt={`Foto de ${memorialName}`} className="h-full w-full object-cover" />
                </div>
              )}
              <h1 className="text-3xl font-serif leading-tight text-white md:text-4xl lg:text-5xl">{memorialName}</h1>
            </div>
            <p className="text-xs uppercase tracking-[0.42em] text-[#ff9800]">
              {formatDate(birthDate)} · {formatDate(deathDate)}
            </p>
          </div>
          <p className="max-w-3xl text-lg leading-relaxed text-white/85">
            {description || "Un lugar sereno para contar quién fue y acompañar a la familia, incluso a la distancia."}
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-[0_15px_45px_rgba(0,0,0,0.25)]">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#ff9800]">Recuerdos publicados</p>
              <p className="mt-2 text-2xl font-serif text-white">{memoryCount}</p>
              <p className="text-xs text-white/80">
                {memoryCount ? "Capítulos publicados y visibles" : "Aún no hay memorias cargadas"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-[0_15px_45px_rgba(0,0,0,0.25)]">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#ff9800]">Ventana de memorias</p>
              <p className="mt-2 text-xl font-serif text-white">{memoryWindow}</p>
              <p className="text-xs text-white/80">Fechas de los aportes</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-4 shadow-[0_15px_45px_rgba(0,0,0,0.25)]">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#ff9800]">Última actualización</p>
              <p className="mt-2 text-xl font-serif text-white">{formatDate(lastUpdated)}</p>
              <p className="text-xs text-white/80">Último movimiento del espacio</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.35em] text-white/75">
            <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2">Sin anuncios</span>
            <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2">Enlace íntimo</span>
            <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2">Velas digitales</span>
          </div>
        </div>
      </div>
    </section>
  );
}
