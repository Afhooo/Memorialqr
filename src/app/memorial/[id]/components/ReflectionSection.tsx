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
    <section
      id="muro"
      className="rounded-[34px] bg-white/75 px-6 py-8 shadow-[0_28px_110px_rgba(0,0,0,0.12)] backdrop-blur"
    >
      <header className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.32em] text-[#e87422]">Cinta</p>
        <h3 className="text-2xl font-semibold text-[#0f172a]">Mensajes y recuerdos de {memorialName}</h3>
        <p className="max-w-3xl text-sm text-[#475569]">
          Si quieres, deja una foto y una línea. A veces eso dice más que cualquier cosa.
        </p>
      </header>

      <div className="mt-6">
        {memoryList.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#d4dae5] bg-[#f8fafc] px-5 py-10 text-center text-sm text-[#64748b]">
            Aún no hay recuerdos publicados. Cuando llegue el primero, aparece aquí.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {memoryList.map((memory, idx) => (
              <article
                key={memory.id}
                className="overflow-hidden rounded-3xl border border-[#e6e8ef] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]"
              >
                {memory.media_url && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0f172a]/5">
                    {renderMedia(memory.media_url)}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
                    <div className="absolute bottom-3 left-3 rounded-full bg-black/45 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white backdrop-blur">
                      {formatDate(memory.created_at)}
                    </div>
                  </div>
                )}

                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-[#64748b]">
                        {memory.media_url ? "Recuerdo con foto" : "Recuerdo"}
                        {idx === 0 ? " · más reciente" : ""}
                      </p>
                      <h4 className="mt-1 text-lg font-semibold text-[#0f172a]">{memory.title || "Recuerdo"}</h4>
                    </div>
                    {!memory.media_url && (
                      <span className="shrink-0 rounded-full bg-[#0f172a]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0f172a]">
                        {formatDate(memory.created_at)}
                      </span>
                    )}
                  </div>

                  {memory.content && <p className="text-base leading-relaxed text-[#111827]">{memory.content}</p>}

                  <div className="pt-2">
                    <ReactionButtons presetLove={18 + idx} presetCandle={6 + idx} presetShare={3 + idx} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <article id="historia" className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#0f172a]/70">Fechas que enmarcan</p>
            <p className="text-sm text-[#475569]">Un resumen corto para quienes llegan por primera vez.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.24em] text-[#0f172a]/80">
            <span className="rounded-full bg-[#0f172a]/5 px-3 py-1 font-semibold text-[#0f172a]">Periodo {memoryWindow}</span>
            <span className="rounded-full bg-[#0f172a]/5 px-3 py-1 font-semibold text-[#0f172a]">Último {formatDate(lastUpdated)}</span>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {lifeline.map((node) => (
            <div
              key={node.id}
              className="flex items-center gap-3 rounded-3xl border border-[#e6e8ef] bg-white px-4 py-3 text-sm text-[#0f172a] shadow-[0_14px_40px_rgba(0,0,0,0.08)]"
            >
              <div className="h-14 w-14 overflow-hidden rounded-2xl bg-[#0f172a]/5">
                {node.media ? (
                  isVideoUrl(node.media) ? (
                    <video src={node.media} className="h-full w-full object-cover" muted loop playsInline />
                  ) : (
                    <img src={node.media} alt={node.title} className="h-full w-full object-cover" />
                  )
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.22em] text-[#64748b]">
                    —
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#0f172a]/60">{formatDate(node.date)}</p>
                <p className="font-semibold text-[#0f172a]">{node.title}</p>
                <p className="text-xs text-[#475569]">{node.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

