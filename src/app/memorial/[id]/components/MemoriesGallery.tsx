/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import type { Memory } from "@/lib/types";
import { formatDate } from "./dateUtils";
import { IconChevronLeft, IconChevronRight, IconX } from "./Icons";

const isVideoUrl = (url: string) => {
  const clean = url.split("?")[0] ?? "";
  return /\.(mp4|mov|webm|ogg)$/i.test(clean);
};

export function MemoriesGallery({
  memorialName,
  memories,
}: {
  memorialName: string;
  memories: Memory[];
}) {
  const items = useMemo(() => (memories ?? []).filter((memory) => Boolean(memory.media_url)) as Memory[], [memories]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const active = activeIndex !== null ? items[activeIndex] ?? null : null;
  const carouselActive = items[carouselIndex] ?? null;

  const goNext = () => {
    setActiveIndex((prev) => {
      if (prev === null) return 0;
      return (prev + 1) % items.length;
    });
  };

  const goPrev = () => {
    setActiveIndex((prev) => {
      if (prev === null) return 0;
      return prev - 1 < 0 ? items.length - 1 : prev - 1;
    });
  };

  useEffect(() => {
    if (activeIndex === null) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, items.length]);

  if (items.length === 0) {
    return (
      <section id="carrete" className="rounded-[34px] bg-white/75 px-6 py-10 shadow-[0_28px_110px_rgba(0,0,0,0.12)] backdrop-blur">
        <p className="text-[11px] uppercase tracking-[0.32em] text-[#0ea5e9]">Carrete</p>
        <h3 className="mt-2 text-2xl font-semibold text-[#0f172a]">Todavía no hay fotos en este memorial</h3>
        <p className="mt-2 max-w-3xl text-sm text-[#475569]">
          Cuando subas la primera, aparece aquí como en una biblioteca: ordenada, limpia y fácil de recorrer.
        </p>
      </section>
    );
  }

  return (
    <>
      <section id="carrete" className="rounded-[34px] bg-white/75 px-6 py-8 shadow-[0_28px_110px_rgba(0,0,0,0.12)] backdrop-blur">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#0ea5e9]">Carrete</p>
            <h3 className="mt-2 text-2xl font-semibold text-[#0f172a]">Fotos y videos de {memorialName}</h3>
            <p className="mt-2 max-w-3xl text-sm text-[#475569]">
              Toca una foto para verla grande. Flechas ← → para avanzar si estás en computador.
            </p>
          </div>
          <span className="rounded-full bg-[#0f172a]/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0f172a]">
            {items.length} elementos
          </span>
        </div>

        {carouselActive && (
          <div className="mt-6 overflow-hidden rounded-3xl border border-[#e6e8ef] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="relative aspect-[21/9] w-full bg-[#0f172a]/5">
              {carouselActive.media_url ? (
                isVideoUrl(carouselActive.media_url) ? (
                  <video src={carouselActive.media_url} className="absolute inset-0 h-full w-full object-cover" muted loop playsInline autoPlay />
                ) : (
                  <img src={carouselActive.media_url} alt={carouselActive.title} className="absolute inset-0 h-full w-full object-cover" />
                )
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3 text-white">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-white/70">{formatDate(carouselActive.created_at)}</p>
                  <p className="truncate text-lg font-semibold">{carouselActive.title || "Recuerdo"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveIndex(carouselIndex)}
                  className="rounded-full bg-white/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur transition hover:bg-white/20"
                >
                  Ver grande
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <button
                type="button"
                onClick={() => setCarouselIndex((i) => (i - 1 < 0 ? items.length - 1 : i - 1))}
                className="inline-flex items-center gap-2 rounded-full border border-[#e6e8ef] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0f172a] transition hover:border-[#0f172a]/20"
              >
                <IconChevronLeft className="h-4 w-4" />
                Anterior
              </button>

              <div className="flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex snap-x snap-mandatory gap-2">
                  {items.slice(0, 18).map((memory, idx) => {
                    const selected = idx === carouselIndex;
                    const url = memory.media_url ?? "";
                    return (
                      <button
                        key={memory.id}
                        type="button"
                        onClick={() => setCarouselIndex(idx)}
                        className={`relative h-14 w-14 shrink-0 snap-start overflow-hidden rounded-2xl border transition ${
                          selected ? "border-[#0f172a] ring-2 ring-[#0f172a]/10" : "border-[#e6e8ef] hover:border-[#0f172a]/20"
                        }`}
                        title={memory.title || "Recuerdo"}
                      >
                        {isVideoUrl(url) ? (
                          <video src={url} className="absolute inset-0 h-full w-full object-cover" muted playsInline />
                        ) : (
                          <img src={url} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCarouselIndex((i) => (i + 1) % items.length)}
                className="inline-flex items-center gap-2 rounded-full border border-[#e6e8ef] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0f172a] transition hover:border-[#0f172a]/20"
              >
                Siguiente
                <IconChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 grid auto-rows-[140px] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.slice(0, 12).map((memory, idx) => {
            const url = memory.media_url ?? "";
            const isHero = idx === 0;
            return (
              <button
                key={memory.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`group relative overflow-hidden rounded-3xl bg-[#0f172a]/5 shadow-[0_18px_50px_rgba(0,0,0,0.12)] transition hover:-translate-y-[1px] ${
                  isHero ? "col-span-2 row-span-2" : ""
                }`}
              >
                {isVideoUrl(url) ? (
                  <video src={url} className="absolute inset-0 h-full w-full object-cover" muted playsInline />
                ) : (
                  <img src={url} alt={memory.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-10 text-left text-white opacity-0 transition group-hover:opacity-100">
                  <p className="text-sm font-semibold">{memory.title || "Recuerdo"}</p>
                  <p className="text-xs text-white/80">{formatDate(memory.created_at)}</p>
                </div>
              </button>
            );
          })}
        </div>

        {items.length > 12 && (
          <p className="mt-4 text-xs text-[#64748b]">
            Se muestran 12 para mantener la página liviana. El resto aparece igual en la cinta de recuerdos.
          </p>
        )}
      </section>

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur" onMouseDown={() => setActiveIndex(null)}>
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/15 bg-white shadow-[0_40px_140px_rgba(0,0,0,0.45)]"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6e8ef] px-4 py-3">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.26em] text-[#6b7280]">{formatDate(active.created_at)}</p>
                <p className="truncate text-sm font-semibold text-[#0f172a]">{active.title || "Recuerdo"}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  className="inline-flex items-center gap-2 rounded-full bg-[#f3f4f6] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0f172a]"
                >
                  <IconChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Anterior</span>
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0f172a] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <IconChevronRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIndex(null)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#f3f4f6] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0f172a]"
                >
                  <IconX className="h-4 w-4" />
                  Cerrar
                </button>
              </div>
            </div>

            <div className="relative max-h-[70vh] min-h-[320px] bg-[#0f172a]/5">
              {active.media_url && isVideoUrl(active.media_url) ? (
                <video src={active.media_url} className="h-full w-full object-contain" controls autoPlay />
              ) : (
                <img src={active.media_url ?? ""} alt="" className="h-full w-full object-contain" />
              )}
            </div>
            {active.content && (
              <div className="border-t border-[#e6e8ef] px-4 py-3 text-sm text-[#334155]">{active.content}</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
