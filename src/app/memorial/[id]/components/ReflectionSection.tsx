"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Memory } from "@/lib/types";
import { ReactionButtons } from "./ReactionButtons";
import { formatDate } from "./dateUtils";

interface ReflectionSectionProps {
  memorialId: string;
  memorialName: string;
  birthDate: string | null;
  deathDate: string | null;
  memories: Memory[];
  canPost: boolean;
  memoryWindow: string;
  lastUpdated: string | null;
}

type FloatingReaction = { id: number; x: number; emoji: string };

const demoMedia = (memorialId: string): Memory[] => [
  {
    id: "demo-media-1",
    memorial_id: memorialId,
    title: "Oda al mar",
    content: "El sonido de las olas frente a Isla Negra.",
    media_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    created_at: "2024-02-02T12:00:00Z",
  },
  {
    id: "demo-media-2",
    memorial_id: memorialId,
    title: "Cuadernos y tinta",
    content: "La mesa donde escribía cada oda elemental.",
    media_url: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=1400&q=80",
    created_at: "2024-02-03T12:00:00Z",
  },
  {
    id: "demo-media-3",
    memorial_id: memorialId,
    title: "Recital",
    content: "Lectura pública que aún retumba.",
    media_url: "https://images.unsplash.com/photo-1515165562835-c3b8c8b01ff6?auto=format&fit=crop&w=1400&q=80",
    created_at: "2024-02-04T12:00:00Z",
  },
  {
    id: "demo-media-4",
    memorial_id: memorialId,
    title: "Flores encendidas",
    content: "Velas y flores digitales de la familia.",
    media_url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1400&q=80",
    created_at: "2024-02-05T12:00:00Z",
  },
];

const isVideo = (url: string | null) => {
  if (!url) return false;
  const clean = url.split("?")[0] ?? "";
  return /\.(mp4|webm|ogg)$/i.test(clean);
};

export function ReflectionSection({
  memorialId,
  memorialName,
  birthDate,
  deathDate,
  memories,
  canPost,
  memoryWindow,
  lastUpdated,
}: ReflectionSectionProps) {
  const memoryList = useMemo(() => memories ?? [], [memories]);
  const collageMemories = memoryList.filter((memory) => memory.media_url);
  const galleryItems = collageMemories.length ? collageMemories : demoMedia(memorialId);
  const [floating, setFloating] = useState<FloatingReaction[]>([]);
  const floatingId = useRef(0);
  const lastSpawn = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastSpawn.current < 1100) return;
      lastSpawn.current = now;
      const id = ++floatingId.current;
      const emoji = Math.random() > 0.55 ? "🕯️" : "❤️";
      const x = 6 + Math.random() * 10;
      setFloating((prev) => [...prev, { id, x, emoji }]);
      setTimeout(() => {
        setFloating((prev) => prev.filter((item) => item.id !== id));
      }, 2400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const lifeline = useMemo(() => {
    const nodes: Array<{ id: string; title: string; date: string; detail: string; media?: string | null }> = [];
    if (birthDate) {
      nodes.push({
        id: "birth",
        title: "Nace",
        date: birthDate,
        detail: "El inicio de la línea de vida.",
        media: galleryItems[0]?.media_url,
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
        media: firstMemory.media_url ?? galleryItems[1]?.media_url,
      });
      nodes.push({
        id: `last-${latestMemory.id}`,
        title: "Último movimiento",
        date: latestMemory.created_at,
        detail: latestMemory.title,
        media: latestMemory.media_url ?? galleryItems[2]?.media_url,
      });
    }
    if (deathDate) {
      nodes.push({
        id: "farewell",
        title: "Despedida",
        date: deathDate,
        detail: "La fecha que sigue convocando el recuerdo.",
        media: galleryItems[3]?.media_url,
      });
    }
    return nodes;
  }, [birthDate, deathDate, galleryItems, memoryList]);

  const composerHint = canPost
    ? "Composer fijo a la derecha, escribe mientras recorres la cinta."
    : "Inicia sesión para que el composer lateral se active.";

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
    <section id="muro" className="relative mt-4" data-memorial-id={memorialId}>
      <div className="pointer-events-none absolute left-[10px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#e87422] via-[#0ea5e9] to-transparent" />
      <div className="pointer-events-none absolute inset-0">
        {floating.map((item) => (
          <span
            key={item.id}
            className="absolute text-xl animate-[floatLine_2.4s_ease-out_forwards]"
            style={{ left: `${item.x}%`, bottom: "-4%" }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      <div className="space-y-10 pl-8 sm:pl-12">
        <header className="space-y-1 pr-6">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#e87422]">Cinta continua estilo feed</p>
          <h3 className="text-xl font-semibold text-[#0f172a]">Historias de {memorialName} como si fuera un muro social</h3>
          <p className="text-sm text-[#475569]">
            Párrafos corridos, emojis flotando y la galería metida en la misma pista, como un Facebook familiar sin ruido. {composerHint}
          </p>
        </header>

        <div className="space-y-12">
          {memoryList.length === 0 ? (
            <div className="relative pl-3 pr-10">
              <span className="absolute -left-5 top-2 h-3 w-3 rounded-full bg-gradient-to-br from-[#e87422] to-[#0ea5e9] shadow-[0_0_0_8px_rgba(232,116,34,0.15)]" />
              <p className="text-sm text-[#475569]">
                Aún no hay cartas publicadas. Usa el composer fijo para iniciar la cinta y que las reacciones se muevan sobre el texto.
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

          {galleryItems.length > 0 && (
            <article id="galeria" className="relative space-y-3 pl-3 pr-12">
              <span className="absolute -left-5 top-2 h-3 w-3 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#22c55e] shadow-[0_0_0_8px_rgba(14,165,233,0.12)]" />
              <div className="flex flex-wrap items-center gap-3 pr-6">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[#0ea5e9]">Galería embebida</p>
                  <p className="text-sm text-[#0f172a]">Fotos y clips insertados en la misma cinta.</p>
                </div>
                <ReactionButtons presetLove={32} presetCandle={12} presetShare={6} />
              </div>
              <div className="columns-2 gap-3 md:columns-3">
                {galleryItems.map((memory) => (
                  <figure
                    key={memory.id}
                    className="group relative mb-3 overflow-hidden rounded-3xl bg-white/70 shadow-[0_18px_44px_rgba(0,0,0,0.14)]"
                  >
                    <div className="relative h-full max-h-[260px] overflow-hidden">
                      {renderMedia(memory.media_url || "")}
                      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent px-3 pb-3 pt-10 text-sm text-white">
                        <p className="font-semibold">{memory.title}</p>
                        <p className="text-xs text-white/80">{memory.content}</p>
                      </figcaption>
                    </div>
                  </figure>
                ))}
              </div>
            </article>
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
                      <div className="flex h-full w-full items-center justify-center text-lg">🕯️</div>
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

      <style jsx>{`
        @keyframes floatLine {
          0% {
            opacity: 0.9;
            transform: translateY(0) scale(0.9);
          }
          60% {
            opacity: 1;
            transform: translateY(-30vh) scale(1.05);
          }
          100% {
            opacity: 0;
            transform: translateY(-44vh) scale(1.08);
          }
        }
      `}</style>
    </section>
  );
}
