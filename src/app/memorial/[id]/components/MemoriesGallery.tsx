/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import type { Memory } from "@/lib/types";
import { formatDate } from "./dateUtils";
import { IconChevronLeft, IconChevronRight, IconX } from "./Icons";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon } from "lucide-react";

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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const active = activeIndex !== null ? items[activeIndex] ?? null : null;

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
  }, [activeIndex, items.length]);

  if (items.length === 0) {
    return (
      <section id="fotos" className="rounded-2xl border border-slate-200/60 bg-white text-center p-16 flex flex-col items-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200/60 bg-slate-50 mb-6 text-slate-400">
          <ImageIcon size={24} />
        </div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-amber-600 font-semibold mb-3">Archivo Visual</p>
        <h3 className="text-2xl font-light text-slate-900 font-serif">Lienzo Inmaculado</h3>
        <p className="mt-4 text-sm text-slate-500 max-w-md mx-auto font-light leading-relaxed">
          Sube el primer documento o fotografía para comenzar a construir el archivo permanente de {memorialName}.
        </p>
      </section>
    );
  }

  // Masonry layout arrays
  const columns = [[], [], []] as Memory[][];
  items.slice(0, 15).forEach((item, i) => columns[i % 3].push(item));

  return (
    <>
      <section id="fotos" className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/60">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-amber-600 font-semibold mb-3">Archivo Visual</p>
            <h3 className="text-3xl font-light text-slate-900 font-serif">Registros Fotográficos</h3>
          </div>
          <span className="rounded-lg bg-white border border-slate-200/60 shadow-sm px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            {items.length} Entradas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {columns.map((col, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-6">
              {col.map((memory) => {
                const url = memory.media_url ?? "";
                const originalIndex = items.findIndex((i) => i.id === memory.id);
                return (
                  <motion.div
                    key={memory.id}
                    layoutId={`media-${memory.id}`}
                    className="relative overflow-hidden cursor-pointer rounded-2xl border border-slate-200/60 bg-white group hover:border-slate-300 hover:shadow-lg transition-all"
                    onClick={() => setActiveIndex(originalIndex)}
                  >
                    {isVideoUrl(url) ? (
                      <video src={url} className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity" muted playsInline />
                    ) : (
                      <img src={url} alt={memory.title} className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity" loading="lazy" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <p className="text-white font-serif text-lg leading-tight mb-2 tracking-wide text-shadow-sm">{memory.title || "Documento Sin Título"}</p>
                      <p className="text-slate-200 text-[10px] font-semibold tracking-widest uppercase text-shadow-sm">{formatDate(memory.created_at)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox is intentionally kept dark-themed for cinematic media viewing */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-2xl"
            onMouseDown={() => setActiveIndex(null)}
          >
            <motion.div
              layoutId={`media-${active.id}`}
              className="relative w-full max-w-6xl max-h-[90vh] flex flex-col items-center justify-center"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="absolute top-6 right-6 z-10 flex gap-4">
                <button onClick={() => setActiveIndex(null)} className="h-12 w-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-zinc-300 hover:bg-white hover:text-black hover:border-white transition-all duration-300 backdrop-blur-md">
                  <IconX className="h-5 w-5" />
                </button>
              </div>

              <button onClick={goPrev} className="absolute left-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-zinc-300 hover:bg-white hover:text-black hover:border-white transition-all duration-300 backdrop-blur-md hidden sm:flex">
                <IconChevronLeft className="h-6 w-6" />
              </button>

              <button onClick={goNext} className="absolute right-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-zinc-300 hover:bg-white hover:text-black hover:border-white transition-all duration-300 backdrop-blur-md hidden sm:flex">
                <IconChevronRight className="h-6 w-6" />
              </button>

              <div className="object-contain max-h-[75vh] max-w-[90vw] overflow-hidden rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/[0.04]">
                {active.media_url && isVideoUrl(active.media_url) ? (
                  <video src={active.media_url} className="h-full w-full object-contain" controls autoPlay />
                ) : (
                  <img src={active.media_url ?? ""} alt="" className="h-full w-full object-contain" />
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 text-center max-w-2xl px-6"
              >
                <h3 className="text-2xl font-light text-white mb-2 font-serif">{active.title || "Documento Visual"}</h3>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-500 mb-4">{formatDate(active.created_at)}</p>
                {active.content && <p className="text-zinc-300 text-sm font-light leading-relaxed">{active.content}</p>}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
