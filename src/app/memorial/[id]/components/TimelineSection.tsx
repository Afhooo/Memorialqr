"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Memory } from "@/lib/types";
import { formatDate } from "./dateUtils";
import { ReactionButtons } from "./ReactionButtons";

interface TimelineSectionProps {
  memorialName: string;
  memories: Memory[];
  lastUpdated: string | null;
  memoryWindow: string;
}

export function TimelineSection({ memorialName, memories, lastUpdated, memoryWindow }: TimelineSectionProps) {
  const toYear = (date: string) => {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "—";
    return parsed.getFullYear();
  };

  const railRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});
  const [activeId, setActiveId] = useState<string | null>(memories[0]?.id ?? null);
  const miniMap = useMemo(
    () =>
      memories.map((memory, idx) => ({
        id: memory.id,
        year: toYear(memory.created_at),
        label: `Cap ${idx + 1}`,
      })),
    [memories],
  );

  const handleSelect = (id: string) => {
    setActiveId(id);
    const node = itemRefs.current[id];
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (railRef.current) {
      railRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderMedia = (memory: Memory) => {
    if (!memory.media_url) return null;
    const safe = memory.media_url.split("?")[0] ?? "";
    const isVideo = /\.(mp4|webm|ogg)$/i.test(safe);
    if (isVideo) {
      return (
        <video
          src={memory.media_url}
          className="h-40 w-full rounded-2xl border border-[#e5e7eb] object-cover shadow-[0_16px_36px_rgba(0,0,0,0.12)]"
          muted
          loop
          playsInline
          autoPlay
        />
      );
    }
    return (
      <img
        src={memory.media_url}
        alt={memory.title}
        className="h-40 w-full rounded-2xl border border-[#e5e7eb] object-cover shadow-[0_16px_36px_rgba(0,0,0,0.12)]"
      />
    );
  };

  return (
    <section
      id="historia"
      className="relative animate-fade-rise delay-2 space-y-5 overflow-hidden rounded-[28px] border border-[#0f172a]/25 bg-gradient-to-br from-[#0c1c32] via-[#0f172a] to-[#0b1224] p-6 text-white shadow-[0_22px_70px_rgba(0,0,0,0.25)]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_16%_14%,rgba(232,116,34,0.2),transparent_36%),radial-gradient(circle_at_84%_8%,rgba(99,102,241,0.22),transparent_34%)]" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#fcd34d]">Historias y fotos</p>
          <h2 className="text-2xl font-serif text-white">Línea de vida de {memorialName}</h2>
          <p className="text-sm text-white/70">Timeline vertical con focos que se abren al click; sin tarjetas repetidas.</p>
        </div>
        <div className="text-right text-sm text-white/70">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#fcd34d]">Última nota</p>
          <p className="text-base font-semibold text-white">{formatDate(lastUpdated)}</p>
          <p className="text-xs text-white/70">{memories.length > 1 ? `Desde ${memoryWindow}` : "A la espera de más memorias"}</p>
        </div>
      </div>

      {memories.length === 0 ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-dashed border-[#e0e0e0] bg-white px-4 py-5 text-sm text-[#4a4a4a] shadow-[0_10px_28px_rgba(0,0,0,0.05)]">
            Escribe el obituario y los detalles de la despedida para quienes no pudieron estar ese día.
          </div>
          <div className="rounded-2xl border border-dashed border-[#e0e0e0] bg-white px-4 py-5 text-sm text-[#4a4a4a] shadow-[0_10px_28px_rgba(0,0,0,0.05)]">
            Sube fotos, videos o audios; la primera imagen llena el altar superior.
          </div>
          <div className="rounded-2xl border border-dashed border-[#e0e0e0] bg-white px-4 py-5 text-sm text-[#4a4a4a] shadow-[0_10px_28px_rgba(0,0,0,0.05)]">
            Publica y comparte el enlace para recibir condolencias cuidadas.
          </div>
        </div>
      ) : (
        <>
          <div ref={railRef} className="relative grid gap-5 overflow-hidden rounded-[22px] border border-white/10 bg-white/5 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.2)] backdrop-blur">
            <div className="pointer-events-none absolute left-5 top-6 bottom-6 w-px bg-gradient-to-b from-[#f59e0b] via-white/50 to-transparent" />
            <div className="relative space-y-4">
              {memories.map((memory, index) => {
                const isActive = (activeId ?? memories[0]?.id) === memory.id;
                return (
                  <article
                    key={memory.id}
                    ref={(node: HTMLElement | null) => {
                      itemRefs.current[memory.id] = node;
                    }}
                    onClick={() => handleSelect(memory.id)}
                    className={`relative flex cursor-pointer flex-col gap-2 rounded-[18px] border border-white/10 bg-gradient-to-r from-white/6 via-white/4 to-white/6 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.18)] transition ${
                      isActive ? "ring-2 ring-[#f59e0b]/60" : "hover:border-[#f59e0b]/40"
                    }`}
                    style={{ animationDelay: `${0.04 * index}s` }}
                  >
                    <span
                      className={`absolute left-[-30px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full ${
                        isActive ? "bg-[#f59e0b] shadow-[0_0_0_6px_rgba(245,158,11,0.25)]" : "bg-white/50"
                      }`}
                    />
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-white/10 text-center text-sm font-semibold text-white leading-10 shadow-[0_6px_18px_rgba(0,0,0,0.2)]">
                          {toYear(memory.created_at)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{memory.title}</p>
                          <p className="text-xs text-white/70">{formatDate(memory.created_at)}</p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.26em] ${
                          isActive
                            ? "border-[#f59e0b]/60 bg-[#f59e0b]/10 text-[#fcd34d]"
                            : "border-white/10 bg-white/5 text-white/70"
                        }`}
                      >
                        Capítulo {index + 1}
                      </span>
                    </div>
                    <p className="text-sm text-white/80">{memory.content}</p>
                    {isActive && (
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-3 shadow-[0_12px_34px_rgba(0,0,0,0.3)]">
                        {renderMedia(memory)}
                        <div className="mt-3 flex items-center justify-between">
                          <ReactionButtons
                            presetLove={120 + index}
                            presetCandle={40 + index * 2}
                            presetShare={15 + index}
                          />
                          <span className="text-[11px] uppercase tracking-[0.22em] text-[#fcd34d]">Foco abierto</span>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-white shadow-[0_12px_32px_rgba(0,0,0,0.18)]">
            {miniMap.map((item) => {
              const isActive = (activeId ?? memories[0]?.id) === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.2em] transition shadow-[0_8px_18px_rgba(0,0,0,0.12)] ${
                    isActive
                      ? "border-[#f59e0b] bg-[#f59e0b]/10 text-[#fcd34d]"
                      : "border-white/10 bg-white/5 text-white hover:border-[#f59e0b]/60 hover:text-[#fcd34d]"
                  }`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${isActive ? "bg-[#f59e0b]" : "bg-white/30"}`} />
                  <span>{item.year}</span>
                  <span className="text-white/60">{item.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
