"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Memory } from "@/lib/types";
import { MemoryComposer } from "./MemoryComposer";
import { ReactionButtons } from "./ReactionButtons";
import { StoryReel } from "./StoryReel";
import { formatDate } from "./dateUtils";

interface ReflectionSectionProps {
  memorialId: string;
  memorialName: string;
  birthDate: string | null;
  deathDate: string | null;
  memories: Memory[];
  canPost: boolean;
}

type FloatingReaction = { id: number; x: number; emoji: string };
type HoverTilt = Record<string, { x: number; y: number }>;

const nextAnniversary = (date: string | null) => {
  if (!date) return null;
  const now = new Date();
  const original = new Date(date);
  if (Number.isNaN(original.getTime())) return null;
  const year = now.getFullYear();
  const candidate = new Date(year, original.getMonth(), original.getDate());
  if (candidate < now) {
    candidate.setFullYear(year + 1);
  }
  return candidate.toISOString();
};

export function ReflectionSection({ memorialId, memorialName, birthDate, deathDate, memories, canPost }: ReflectionSectionProps) {
  const latestLetters = memories.slice(0, 3);
  const mediaMemories = memories.filter((memory) => memory.media_url);
  const demoMedia: Memory[] = [
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
  const collageMemories = mediaMemories.length ? mediaMemories : demoMedia;
  const hasMedia = collageMemories.length > 0;
  const upcomingAnniversary = nextAnniversary(deathDate);
  const storyItems = collageMemories.slice(0, 12);
  const [altarItem, setAltarItem] = useState<Memory | null>(null);
  const [modalMedia, setModalMedia] = useState<Memory | null>(null);
  const [modalZoom, setModalZoom] = useState(1.05);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hoverTilt, setHoverTilt] = useState<HoverTilt>({});
  const dragging = useRef(false);
  const dragOrigin = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const [floating, setFloating] = useState<FloatingReaction[]>([]);
  const floatingId = useRef(0);
  const lastSpawn = useRef(0);
  const inlineComments = useMemo(
    () => [
      { id: "c1", author: "Claudia", text: "“Siento la brisa y su voz en esta escena.”" },
      { id: "c2", author: "Matías", text: "Gracias por mantener esta foto en el altar." },
    ],
    [],
  );

  useEffect(() => {
    if (!altarItem && collageMemories.length) {
      setAltarItem(collageMemories[0]);
    }
  }, [altarItem, collageMemories]);

  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastSpawn.current < 1100) return;
      lastSpawn.current = now;
      const id = ++floatingId.current;
      const emoji = Math.random() > 0.6 ? "🕯️" : "❤️";
      const x = Math.random() * 100;
      setFloating((prev) => [...prev, { id, x, emoji }]);
      setTimeout(() => {
        setFloating((prev) => prev.filter((item) => item.id !== id));
      }, 3600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderMediaPreview = (url: string) => {
    const safeUrl = url || "";
    const isVideo = /\.(mp4|webm|ogg)$/i.test(safeUrl.split("?")[0] || "");
    if (isVideo) {
      return (
        <video
          src={safeUrl}
          className="h-full w-full object-cover"
          muted
          loop
          playsInline
          controls
        />
      );
    }
    return <img src={safeUrl} alt="" className="h-full w-full object-cover" loading="lazy" />;
  };

  return (
    <section
      id="muro"
      className="relative animate-fade-rise space-y-6 overflow-hidden rounded-[24px] border border-transparent bg-gradient-to-b from-white via-[#f8fafc] to-white p-6 shadow-[0_24px_70px_rgba(0,0,0,0.1)]"
    >
      <div className="pointer-events-none fixed inset-0 z-10">
        {floating.map((bubble) => (
          <span
            key={bubble.id}
            className="absolute animate-[floatRise_3.6s_ease-out_forwards] text-3xl drop-shadow"
            style={{ left: `${bubble.x}%`, bottom: "-6%" }}
          >
            {bubble.emoji}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#6b7280]">Muro de familia</p>
          <h2 className="text-2xl font-semibold text-[#0f172a]">Cuenta la historia con fotos y notas</h2>
          <p className="text-sm text-[#6b7280]">Feed sin tarjetas rígidas, reacciones flotantes y collage inmersivo.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-[#0f172a]">
          <span className="rounded-full bg-[#f3f4f6] px-3 py-1">❤️ 214</span>
          <span className="rounded-full bg-[#f3f4f6] px-3 py-1">🕯️ 42</span>
          <span className="rounded-full bg-[#f3f4f6] px-3 py-1">💐 19</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.85fr)]">
        <div className="space-y-5">
          {storyItems.length > 0 && <StoryReel stories={storyItems as any} />}

          <div className="overflow-hidden rounded-[22px] bg-gradient-to-br from-white/90 via-[#f8fafc]/80 to-white/95 shadow-[0_18px_48px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-3 px-4 pt-4">
              <div className="h-10 w-10 rounded-full bg-[#e87422]/15 text-center text-base font-semibold text-[#e87422] leading-10 shadow-[0_12px_24px_rgba(232,116,34,0.3)]">
                ✏️
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#0f172a]">¿Qué quieres compartir hoy?</p>
                <p className="text-xs text-[#6b7280]">Un recuerdo cotidiano, una foto, un video corto o una nota breve.</p>
              </div>
            </div>
            <div className="mt-2 border-t border-[#e5e7eb]/80 px-4 py-4">
              <MemoryComposer
                memorialId={memorialId}
                disabled={!canPost}
                helper={
                  canPost
                    ? "Solo la familia y administradores verán los mensajes hasta que decidas publicarlos."
                    : "Inicia sesión con la cuenta de la familia para publicar y guardar mensajes."
                }
              />
            </div>
          </div>

          {hasMedia && (
            <div id="galeria" className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#6b7280]">Fotos y videos</p>
                  <p className="text-sm font-semibold text-[#0f172a]">Collage inmersivo</p>
                </div>
                <span className="rounded-full bg-[#f8fafc] px-3 py-1 text-[11px] uppercase tracking-[0.26em] text-[#6b7280]">
                  {collageMemories.length} piezas
                </span>
              </div>
              <div className="columns-2 gap-3 md:columns-3">
                {collageMemories.map((memory, idx) => {
                  const tilt = hoverTilt[memory.id] ?? { x: 0, y: 0 };
                  return (
                    <article
                      key={memory.id}
                      className="group relative mb-3 break-inside-avoid overflow-hidden rounded-3xl bg-gradient-to-br from-white/70 via-white/50 to-white/70 shadow-[0_16px_38px_rgba(0,0,0,0.12)] backdrop-blur"
                      style={{
                        transform: `rotate(${(idx % 2 === 0 ? -1 : 1) * 1.6}deg) translate3d(${tilt.x}px, ${tilt.y}px, 0)`,
                        transition: "transform 220ms ease, box-shadow 220ms ease",
                      }}
                      onMouseMove={(event) => {
                        const rect = event.currentTarget.getBoundingClientRect();
                        const relX = (event.clientX - rect.left) / rect.width - 0.5;
                        const relY = (event.clientY - rect.top) / rect.height - 0.5;
                        setHoverTilt((prev) => ({ ...prev, [memory.id]: { x: relX * 14, y: relY * 12 } }));
                      }}
                      onMouseLeave={() => setHoverTilt((prev) => ({ ...prev, [memory.id]: { x: 0, y: 0 } }))}
                    >
                      <button
                        type="button"
                        onClick={() => setModalMedia(memory)}
                        className="relative block w-full overflow-hidden rounded-3xl"
                      >
                        <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100 group-hover:backdrop-brightness-110" />
                        {renderMediaPreview(memory.media_url || "")}
                        <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-1 text-[10px] uppercase tracking-[0.26em] text-white">
                          {formatDate(memory.created_at)}
                        </span>
                        <span className="absolute right-2 bottom-2 rounded-full bg-black/45 px-2 py-1 text-[10px] uppercase tracking-[0.26em] text-white">
                          Tap para abrir
                        </span>
                      </button>
                      <div className="space-y-1 px-3 pb-3 pt-2">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold text-[#0f172a]">{memory.title}</h3>
                          <button
                            type="button"
                            onClick={() => setAltarItem(memory)}
                            className="flex items-center gap-1 rounded-full bg-[#0f172a]/70 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition hover:translate-y-[-1px]"
                          >
                            🕯️ Agregar a altar
                          </button>
                        </div>
                        <p className="text-xs text-[#6b7280]">{memory.content}</p>
                        <ReactionButtons presetLove={12 + idx} presetCandle={4 + idx} presetShare={3 + idx} />
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          <div className="rounded-[22px] bg-gradient-to-br from-white/90 via-[#f8fafc]/80 to-white shadow-[0_16px_40px_rgba(0,0,0,0.08)] p-4">
            {latestLetters.length ? (
              <div className="columns-1 gap-4 md:columns-2">
                {latestLetters.map((memory, idx) => (
                  <article
                    key={memory.id}
                    className="mb-4 break-inside-avoid rounded-[20px] bg-[radial-gradient(circle_at_20%_20%,rgba(248,113,113,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(244,163,65,0.12),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.9),rgba(248,250,252,0.85))] p-4 shadow-[0_14px_36px_rgba(0,0,0,0.08)] backdrop-blur"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#e87422]/70 to-[#facc15]/70 text-center text-sm font-semibold text-white leading-10 shadow-[0_10px_24px_rgba(232,116,34,0.4)]">
                          {memorialName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0f172a]">Familia · {memorialName}</p>
                          <p className="text-xs text-[#6b7280]">{formatDate(memory.created_at)}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] uppercase tracking-[0.26em] text-[#6b7280]">
                        Historia {idx + 1}
                      </span>
                    </div>
                    <h3 className="mt-3 text-base font-semibold text-[#0f172a]">{memory.title}</h3>
                    <p className="text-sm text-[#374151]">{memory.content}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <ReactionButtons presetLove={24 + idx} presetCandle={8 + idx} presetShare={3 + idx} />
                      <span className="text-xs text-[#6b7280]">Feed sin bordes · Masonry</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="space-y-2 px-4 py-5 text-[#374151]">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#6b7280]">Aún sin cartas</p>
                <p className="text-lg font-semibold text-[#0f172a]">Escribe la primera nota</p>
                <p className="text-sm">
                  Un recuerdo cotidiano, una foto o algo que te hubiera gustado decirle. Así arrancamos el muro.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-[#0f172a] p-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.3)]">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/70">Altar vivo</p>
            {altarItem ? (
              <div className="relative mt-3 overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/50" />
                <img src={altarItem.media_url || ""} alt={altarItem.title} className="h-52 w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 space-y-1 px-3 pb-3">
                  <p className="text-sm font-semibold text-white">{altarItem.title}</p>
                  <p className="text-xs text-white/80 line-clamp-2">{altarItem.content}</p>
                </div>
                <div className="absolute inset-x-4 bottom-2 flex justify-between text-2xl">
                  <span className="animate-[floatSoft_3.4s_ease-in-out_infinite]">🕯️</span>
                  <span className="animate-[floatSoft_3.2s_ease-in-out_infinite] delay-1">🕯️</span>
                  <span className="animate-[floatSoft_3s_ease-in-out_infinite] delay-2">🕯️</span>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-white/80">Selecciona una foto y clavala al altar con el botón.</p>
            )}
            <p className="mt-3 text-xs text-white/70">Banda fija lateral con velas animadas.</p>
          </div>

          <div className="space-y-2 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-5 shadow-[0_12px_36px_rgba(0,0,0,0.05)]">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#6b7280]">Perfil y fechas</p>
            <ul className="space-y-2 text-sm text-[#374151]">
              {deathDate && (
                <li className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-[0_6px_20px_rgba(0,0,0,0.03)]">
                  <span>Próximo aniversario</span>
                  <span className="font-semibold text-[#0f172a]">
                    {upcomingAnniversary ? formatDate(upcomingAnniversary) : formatDate(deathDate)}
                  </span>
                </li>
              )}
              {birthDate && (
                <li className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-[0_6px_20px_rgba(0,0,0,0.03)]">
                  <span>Fecha de nacimiento</span>
                  <span className="font-semibold text-[#0f172a]">{formatDate(birthDate)}</span>
                </li>
              )}
            </ul>

            <div className="pt-1">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#6b7280]">Atajos</p>
              <div className="mt-2 flex flex-wrap gap-2 text-sm text-[#0f172a]">
                <a
                  href="#historia"
                  className="rounded-full border border-[#e5e7eb] bg-white px-3 py-1 shadow-[0_6px_16px_rgba(0,0,0,0.03)]"
                >
                  Ver línea de vida
                </a>
                <a
                  href="#galeria"
                  className="rounded-full border border-[#e5e7eb] bg-white px-3 py-1 shadow-[0_6px_16px_rgba(0,0,0,0.03)]"
                >
                  Abrir galería
                </a>
                <a
                  href="#compartir"
                  className="rounded-full border border-[#e5e7eb] bg-white px-3 py-1 shadow-[0_6px_16px_rgba(0,0,0,0.03)]"
                >
                  Compartir enlace
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur">
          <div
            className="absolute inset-0"
            onClick={() => setModalMedia(null)}
          />
          <div className="relative z-10 flex w-full max-w-5xl flex-col gap-4 rounded-3xl bg-[#0b1220] p-5 text-white shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Modal inmersivo</p>
                <p className="text-lg font-semibold text-white">{modalMedia.title}</p>
                <p className="text-xs text-white/70">{formatDate(modalMedia.created_at)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalZoom((z) => Math.min(2.2, z + 0.15))}
                  className="rounded-full bg-white/10 px-3 py-1 text-sm"
                >
                  Zoom +
                </button>
                <button
                  type="button"
                  onClick={() => setModalZoom((z) => Math.max(1, z - 0.15))}
                  className="rounded-full bg-white/10 px-3 py-1 text-sm"
                >
                  Zoom -
                </button>
                <button
                  type="button"
                  onClick={() => setAltarItem(modalMedia)}
                  className="rounded-full bg-[#e87422] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white"
                >
                  🕯️ Agregar al altar
                </button>
                <button
                  type="button"
                  onClick={() => setModalMedia(null)}
                  className="rounded-full bg-white/10 px-3 py-1 text-sm"
                >
                  Cerrar
                </button>
              </div>
            </div>
            <div
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-black"
              onWheel={(event) => {
                event.preventDefault();
                const direction = event.deltaY > 0 ? -1 : 1;
                setModalZoom((z) => {
                  const next = z + direction * 0.08;
                  return Math.min(2.3, Math.max(1, next));
                });
              }}
              onMouseDown={(event) => {
                dragging.current = true;
                dragOrigin.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y };
              }}
              onMouseMove={(event) => {
                if (!dragging.current) return;
                const dx = event.clientX - dragOrigin.current.x;
                const dy = event.clientY - dragOrigin.current.y;
                setOffset({ x: dragOrigin.current.ox + dx, y: dragOrigin.current.oy + dy });
              }}
              onMouseUp={() => (dragging.current = false)}
              onMouseLeave={() => (dragging.current = false)}
            >
              <div
                className="transition-transform duration-150"
                style={{
                  transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${modalZoom})`,
                  cursor: dragging.current ? "grabbing" : "grab",
                }}
              >
                {renderMediaPreview(modalMedia.media_url || "")}
              </div>
            </div>
            <div className="grid gap-3 lg:grid-cols-[1fr_0.8fr]">
              <div className="rounded-xl bg-white/5 p-4 text-sm text-white/90">
                <p className="text-white">{modalMedia.content}</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-white/60">Parallax · Zoom · Pan</p>
              </div>
              <div className="space-y-2 rounded-xl bg-white/5 p-4">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Comentarios inline</p>
                <ul className="space-y-2">
                  {inlineComments.map((comment) => (
                    <li key={comment.id} className="rounded-lg bg-white/5 px-3 py-2 text-sm text-white/90">
                      <span className="font-semibold text-white">{comment.author}</span> · {comment.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes floatRise {
          0% {
            opacity: 0.8;
            transform: translateY(0) scale(0.9);
          }
          60% {
            opacity: 1;
            transform: translateY(-40vh) scale(1.05);
          }
          100% {
            opacity: 0;
            transform: translateY(-55vh) scale(1.08);
          }
        }
        @keyframes floatSoft {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
