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

const isVideo = (url: string | null) => {
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
        title: "Nace",
        date: birthDate,
        detail: "El inicio de la línea de vida.",
        media: collageMemories[0]?.media_url ?? null,
      });
    }
    if (memoryList.length) {
      const firstMemory = memoryList[memoryList.length - 1];
      const latestMemory = memoryList[0];
      nodes.push({
        id: `first-${firstMemory.id}`,
        title: "Primer recuerdo publicado",
        date: firstMemory.created_at,
        detail: firstMemory.content.slice(0, 110),
        media: firstMemory.media_url ?? collageMemories[1]?.media_url ?? null,
      });
      nodes.push({
        id: `last-${latestMemory.id}`,
        title: "Último movimiento",
        date: latestMemory.created_at,
        detail: latestMemory.title,
        media: latestMemory.media_url ?? collageMemories[2]?.media_url ?? null,
      });
    }
    if (deathDate) {
      nodes.push({
        id: "farewell",
        title: "Despedida",
        date: deathDate,
        detail: "La fecha que sigue convocando el recuerdo.",
        media: collageMemories[3]?.media_url ?? null,
      });
    }
    return nodes;
  }, [birthDate, deathDate, collageMemories, memoryList]);

  const renderMedia = (url: string | null) => {
    if (!url) return null;
    if (isVideo(url)) {
      return (
        <video
          src={url}
          className="h-full w-full object-cover"
          muted
          loop
          playsInline
          autoPlay
        />
      );
    }
    return <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />;
  };

  return (
    <section id="muro" className="relative mt-4">
      <div className="pointer-events-none absolute left-[10px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#e87422] via-[#0ea5e9] to-transparent" />

      <div className="space-y-10 pl-8 sm:pl-12">
        <header className="space-y-1 pr-6">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#e87422]">Cinta de recuerdos</p>
          <h3 className="text-xl font-semibold text-[#0f172a]">Fotos, mensajes y momentos de {memorialName}</h3>
          <p className="text-sm text-[#475569]">
            Un lugar para ir dejando lo importante: una foto del carrete, una anécdota corta, una frase que se repite en la familia.
          </p>
        </header>

        <div className="space-y-12">
          {memoryList.length === 0 ? (
            <div className="relative pl-3 pr-10">
              <span className="absolute -left-5 top-2 h-3 w-3 rounded-full bg-gradient-to-br from-[#e87422] to-[#0ea5e9] shadow-[0_0_0_8px_rgba(232,116,34,0.15)]" />
              <p className="text-sm text-[#475569]">
                Aún no hay recuerdos publicados. Si quieres, sube una foto o deja un mensaje para empezar el carrete.
              </p>
            </div>
          ) : (
            memoryList.map((memory, idx) => (
              <article key={memory.id} className="relative pl-3 pr-16">
                <span className="absolute -left-5 top-2 h-3 w-3 rounded-full bg-gradient-to-br from-[#e87422] to-[#0ea5e9] shadow-[0_0_0_8px_rgba(232,116,34,0.15)]" />
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#0f172a]/70">
                    {formatDate(memory.created_at)} · Capítulo {idx + 1}
                  </p>
                  <h4 className="text-lg font-semibold text-[#0f172a]">{memory.title}</h4>
                  <p className="text-base leading-relaxed text-[#111827]">{memory.content}</p>
                  {memory.media_url && (
                    <div className="mt-2 overflow-hidden rounded-2xl bg-white/70 shadow-[0_18px_44px_rgba(0,0,0,0.12)]">
                      <div className="relative h-[260px] w-full overflow-hidden rounded-2xl">{renderMedia(memory.media_url)}</div>
                    </div>
                  )}
                </div>
                <div className="absolute right-0 top-0 hidden sm:block">
                  <ReactionButtons presetLove={18 + idx} presetCandle={6 + idx} presetShare={3 + idx} />
                </div>
                <div className="mt-2 sm:hidden">
                  <ReactionButtons presetLove={18 + idx} presetCandle={6 + idx} presetShare={3 + idx} />
                </div>
              </article>
            ))
          )}

          <article id="historia" className="relative space-y-4 pl-3 pr-10">
            <span className="absolute -left-5 top-2 h-3 w-3 rounded-full bg-gradient-to-br from-[#22c55e] to-[#e87422] shadow-[0_0_0_8px_rgba(34,197,94,0.12)]" />
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#0f172a]/70">Línea de vida en la misma pista</p>
              <span className="rounded-full bg-[#0f172a]/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#0f172a]">
                Ventana {memoryWindow}
              </span>
              <span className="rounded-full bg-[#0f172a]/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#0f172a]">
                Último {formatDate(lastUpdated)}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {lifeline.map((node) => (
                <div
                  key={node.id}
                  className="flex items-center gap-3 rounded-2xl bg-white/75 p-3 text-sm text-[#0f172a] shadow-[0_14px_40px_rgba(0,0,0,0.08)]"
                >
                  <div className="h-14 w-14 overflow-hidden rounded-xl bg-[#0f172a]/5">
                    {node.media ? (
                      isVideo(node.media) ? (
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
        </div>
      </div>

    </section>
  );
}
