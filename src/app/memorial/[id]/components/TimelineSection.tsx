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

  const stripRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});
  const [activeId, setActiveId] = useState<string | null>(memories[0]?.id ?? null);

  useEffect(() => {
    if (!activeId && memories[0]) {
      setActiveId(memories[0].id);
    }
  }, [activeId, memories]);

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
      node.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    } else if (stripRef.current) {
      stripRef.current.scrollTo({ left: 0, behavior: "smooth" });
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
      className="animate-fade-rise delay-2 space-y-5 overflow-hidden rounded-[24px] border border-[#e0e0e0] bg-gradient-to-br from-white via-[#f8fafc] to-[#eef2ef] p-6 text-[#0f172a] shadow-[0_18px_60px_rgba(0,0,0,0.08)]"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Historias y fotos</p>
          <h2 className="text-2xl font-serif text-[#0f172a]">Línea de vida de {memorialName}</h2>
          <p className="text-sm text-[#4a4a4a]">Horizontal, con scroll-snap y focos que se expanden sin cambiar de página.</p>
        </div>
        <div className="text-right text-sm text-[#4a4a4a]">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#e87422]">Última nota</p>
          <p className="text-base font-semibold text-[#0f172a]">{formatDate(lastUpdated)}</p>
          <p className="text-xs text-[#4a4a4a]">{memories.length > 1 ? `Desde ${memoryWindow}` : "A la espera de más memorias"}</p>
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
          <div
            ref={stripRef}
            className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {memories.map((memory, index) => {
              const isActive = (activeId ?? memories[0]?.id) === memory.id;
              return (
                <article
                  key={memory.id}
                  ref={(node: HTMLElement | null) => {
                    itemRefs.current[memory.id] = node;
                  }}
                  onClick={() => handleSelect(memory.id)}
                  className={`relative min-w-[260px] snap-center overflow-hidden rounded-3xl border border-[#e5e7eb] bg-white/95 p-4 transition duration-300 ease-out md:min-w-[360px] ${
                    isActive
                      ? "ring-2 ring-[#e87422]/70 shadow-[0_18px_50px_rgba(0,0,0,0.08)]"
                      : "shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
                  }`}
                  style={{ animationDelay: `${0.04 * index}s` }}
                >
                  {memory.media_url && (
                    <div
                      className="absolute inset-0 opacity-15"
                      style={{
                        backgroundImage: `url(${memory.media_url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        filter: "blur(18px)",
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-white via-white/96 to-[#f8fafc]" />
                  <div className="relative space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#f3f4f6] text-center text-sm font-semibold text-[#0f172a] leading-10 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
                          {toYear(memory.created_at)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0f172a]">{memory.title}</p>
                          <p className="text-xs text-[#6b7280]">{formatDate(memory.created_at)}</p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.26em] ${
                          isActive
                            ? "border-[#e87422]/70 bg-[#e87422]/10 text-[#c2410c]"
                            : "border-[#e5e7eb] bg-[#f8fafc] text-[#6b7280]"
                        }`}
                      >
                        Capítulo {index + 1}
                      </span>
                    </div>
                    <p className="text-sm text-[#374151]">{memory.content}</p>
                    {isActive && renderMedia(memory)}
                    <div className="flex items-center justify-between">
                      <ReactionButtons
                        presetLove={120 + index}
                        presetCandle={40 + index * 2}
                        presetShare={15 + index}
                      />
                      <span className="text-[11px] uppercase tracking-[0.22em] text-[#e87422]">Scroll-snap</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white px-3 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.06)]">
            {miniMap.map((item) => {
              const isActive = (activeId ?? memories[0]?.id) === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.2em] transition shadow-[0_8px_18px_rgba(0,0,0,0.05)] ${
                    isActive
                      ? "border-[#e87422] bg-[#e87422]/10 text-[#c2410c]"
                      : "border-[#e5e7eb] bg-white text-[#0f172a] hover:border-[#e87422]/60 hover:text-[#e87422]"
                  }`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${isActive ? "bg-[#e87422]" : "bg-[#e5e7eb]"}`} />
                  <span>{item.year}</span>
                  <span className="text-[#6b7280]">{item.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
