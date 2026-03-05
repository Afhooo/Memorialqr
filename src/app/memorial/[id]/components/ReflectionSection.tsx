/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo } from "react";
import type { Memory } from "@/lib/types";
import { ReactionButtons } from "./ReactionButtons";
import { formatDate } from "./dateUtils";

interface ReflectionSectionProps {
  memorialName: string;
  birthDate: string | null;
  deathDate: string | null;
  memories: Memory[];
  memoryWindow: string;
  lastUpdated: string | null;
}

const isVideoUrl = (url: string | null) => {
  if (!url) return false;
  const clean = url.split("?")[0] ?? "";
  return /\.(mp4|webm|ogg)$/i.test(clean);
};

export function ReflectionSection({
  memorialName,
  birthDate,
  deathDate,
  memories,
  memoryWindow,
  lastUpdated,
}: ReflectionSectionProps) {
  const memoryList = useMemo(() => memories ?? [], [memories]);
  const collageMemories = useMemo(() => memoryList.filter((memory) => memory.media_url), [memoryList]);

  const lifeline = useMemo(() => {
    const nodes: Array<{ id: string; title: string; date: string; detail: string; media?: string | null }> = [];

    if (birthDate) {
      nodes.push({
        id: "birth",
        title: "Nació",
        date: birthDate,
        detail: "Una fecha que abre el camino de su historia.",
        media: collageMemories[0]?.media_url ?? null,
      });
    }

    if (memoryList.length) {
      const firstMemory = memoryList[memoryList.length - 1];
      const latestMemory = memoryList[0];
      nodes.push({
        id: `first-${firstMemory.id}`,
        title: "Primer recuerdo",
        date: firstMemory.created_at,
        detail: (firstMemory.content || "").slice(0, 110) || (firstMemory.title || "El primer recuerdo en este espacio."),
        media: firstMemory.media_url ?? collageMemories[1]?.media_url ?? null,
      });
      nodes.push({
        id: `last-${latestMemory.id}`,
        title: "Último recuerdo",
        date: latestMemory.created_at,
        detail: latestMemory.title || "Una última visita al memorial.",
        media: latestMemory.media_url ?? collageMemories[2]?.media_url ?? null,
      });
    }

    if (deathDate) {
      nodes.push({
        id: "farewell",
        title: "Lo despedimos",
        date: deathDate,
        detail: "Una fecha difícil, que seguimos llevando con cariño.",
        media: collageMemories[3]?.media_url ?? null,
      });
    }

    return nodes;
  }, [birthDate, deathDate, collageMemories, memoryList]);

  const renderMedia = (url: string | null) => {
    if (!url) return null;
    if (isVideoUrl(url)) {
      return <video src={url} className="absolute inset-0 h-full w-full object-cover" muted loop playsInline autoPlay />;
    }
    return <img src={url} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />;
  };

  return (
    <section id="muro" className="relative text-slate-900 pb-4">
      <header className="space-y-4 mb-8">
        <p className="text-[10px] leading-relaxed uppercase tracking-[0.3em] font-bold text-sky-600 pb-1">Cinta de Recuerdos</p>
        <h3 className="text-3xl lg:text-4xl font-serif leading-tight">Mensajes y registros de {memorialName}</h3>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600 font-light">
          El historial de momentos compartidos. A veces una sola foto dice más de lo imaginable.
        </p>
      </header>

      <div className="mt-6 mb-16">
        {memoryList.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/50 px-5 py-12 text-center text-sm font-medium text-slate-500">
            Aún no hay recuerdos publicados. Sé el primero en compartir algo.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {memoryList.map((memory, idx) => (
              <article
                key={memory.id}
                className="group overflow-hidden rounded-[28px] border border-white/60 bg-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-900/5 backdrop-blur-xl transition hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] hover:bg-white/80"
              >
                {memory.media_url && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100/50">
                    {renderMedia(memory.media_url)}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      <span className="rounded-full bg-black/30 backdrop-blur-md px-3 py-1 text-[9px] leading-normal uppercase tracking-[0.2em] text-white font-medium border border-white/20">
                        {formatDate(memory.created_at)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-4 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[9px] leading-normal uppercase tracking-[0.2em] text-slate-500 font-semibold mb-1 pb-1">
                        {memory.media_url ? "Documento visual" : "Anotación escrita"}
                        {idx === 0 ? " · Más reciente" : ""}
                      </p>
                      <h4 className="text-lg font-serif text-slate-900">{memory.title || "Recuerdo"}</h4>
                    </div>
                    {!memory.media_url && (
                      <span className="shrink-0 text-[10px] leading-normal font-medium text-slate-400">
                        {formatDate(memory.created_at)}
                      </span>
                    )}
                  </div>

                  {memory.content && <p className="text-sm leading-relaxed text-slate-600 font-light">{memory.content}</p>}

                  <div className="pt-3 border-t border-slate-200/50">
                    <ReactionButtons presetLove={18 + idx} presetCandle={6 + idx} presetShare={3 + idx} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <article id="historia" className="mt-12 pt-12 border-t border-slate-200/60">
        <div className="space-y-4 mb-8">
          <p className="text-[10px] leading-relaxed uppercase tracking-[0.3em] font-bold text-sky-600 pb-1">Fechas que enmarcan</p>
          <h3 className="text-2xl font-serif text-slate-900">Una breve línea de vida</h3>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
            <div className="flex flex-col">
              <span className="text-[9px] leading-normal uppercase tracking-[0.2em] font-semibold text-slate-400 mb-1 pb-0.5">Periodo Documentado</span>
              <span className="text-sm font-medium text-slate-800">{memoryWindow}</span>
            </div>
            <div className="h-8 w-px bg-slate-200/60 hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-[9px] leading-normal uppercase tracking-[0.2em] font-semibold text-slate-400 mb-1 pb-0.5">Última actualización</span>
              <span className="text-sm font-medium text-slate-800">{formatDate(lastUpdated)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2">
          {lifeline.map((node) => (
            <div
              key={node.id}
              className="group flex flex-col gap-4 rounded-3xl border border-white/60 bg-white/40 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] ring-1 ring-slate-900/5 backdrop-blur-md transition hover:bg-white/60"
            >
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[20px] bg-slate-100/50 shadow-inner">
                  {node.media ? (
                    isVideoUrl(node.media) ? (
                      <video src={node.media} className="h-full w-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" muted loop playsInline />
                    ) : (
                      <img src={node.media} alt={node.title} className="h-full w-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" loading="lazy" />
                    )
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] leading-normal font-semibold uppercase tracking-[0.2em] text-slate-300">
                      —
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] leading-normal uppercase tracking-[0.2em] text-slate-400 font-semibold mb-1 pb-0.5">{formatDate(node.date)}</p>
                  <p className="font-serif text-slate-900">{node.title}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 font-light leading-relaxed">{node.detail}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

