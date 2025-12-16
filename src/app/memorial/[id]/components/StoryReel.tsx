"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { formatDate } from "./dateUtils";

type Story = {
  id: string;
  title: string;
  media_url: string | null;
  created_at: string;
  content?: string | null;
};

interface StoryReelProps {
  stories: Story[];
}

export function StoryReel({ stories }: StoryReelProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const duration = 5200;

  const selected = useMemo(
    () => (activeIndex !== null ? stories[activeIndex] ?? null : null),
    [activeIndex, stories],
  );

  const goNext = () => {
    setProgress(0);
    setActiveIndex((prev) => {
      if (prev === null) return 0;
      return (prev + 1) % stories.length;
    });
  };

  const goPrev = () => {
    setProgress(0);
    setActiveIndex((prev) => {
      if (prev === null) return stories.length - 1;
      return prev - 1 < 0 ? stories.length - 1 : prev - 1;
    });
  };

  useEffect(() => {
    if (activeIndex === null || isPaused) return;
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const delta = timestamp - start;
      const nextProgress = Math.min(1, delta / duration);
      setProgress(nextProgress);
      if (nextProgress >= 1) {
        start = timestamp;
        goNext();
        return;
      }
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [activeIndex, isPaused]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "Escape") setActiveIndex(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex]);

  if (!stories.length) return null;

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {stories.map((story) => (
          <button
            key={story.id}
            type="button"
            onClick={() => setActiveIndex(stories.findIndex((s) => s.id === story.id))}
            className="group relative flex w-[86px] flex-col items-center gap-2"
          >
            <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-[#e87422] bg-[#0f172a]/5 shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition group-hover:scale-105 group-hover:border-[#facc15]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#e87422]/22 via-transparent to-[#facc15]/24 blur-md" />
              {story.media_url ? (
                <img src={story.media_url} alt={story.title} className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm text-[#0f172a]">{story.title[0] ?? "S"}</span>
              )}
              <span className="absolute -left-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#facc15] text-[10px] shadow-[0_0_12px_rgba(250,204,21,0.8)]">
                🕯️
              </span>
              <span className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#22c55e] text-[10px] shadow-[0_0_12px_rgba(34,197,94,0.7)]">
                ⭐
              </span>
            </div>
            <span className="line-clamp-1 text-center text-[11px] text-[#0f172a]">{story.title || "Historia"}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: selected.media_url ? `url(${selected.media_url})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(22px)",
            }}
          />
          <div
            className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-[0_30px_120px_rgba(0,0,0,0.35)]"
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              const endX = e.changedTouches[0].clientX;
              if (touchStartX !== null && endX - touchStartX > 50) {
                goPrev();
              } else if (touchStartX !== null && touchStartX - endX > 50) {
                goNext();
              }
              setTouchStartX(null);
            }}
          >
            <div className="absolute inset-x-0 top-0 z-10 flex gap-1 px-3 pt-3">
              {stories.map((story, idx) => {
                const value =
                  idx < (activeIndex ?? 0)
                    ? 1
                    : idx === activeIndex
                      ? progress
                      : 0;
                return (
                  <div key={story.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
                    <span
                      className="block h-full bg-gradient-to-r from-white via-[#facc15] to-[#e87422]"
                      style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between px-4 pb-2 pt-6">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-[#6b7280]">Historia</p>
                <p className="text-sm font-semibold text-[#0f172a]">{selected.title}</p>
                <p className="text-xs text-[#6b7280]">{formatDate(selected.created_at)}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-full bg-[#f3f4f6] px-2 py-1 text-[11px] text-[#0f172a]">
                  <span className="animate-[pulse_2s_ease_infinite] text-base">🕯️</span>
                  <span>vela viva</span>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-[#ecfeff] px-2 py-1 text-[11px] text-[#0f172a]">
                  <span className="animate-[pulse_2.4s_ease_infinite] text-base">⭐</span>
                  <span>insignia</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="rounded-full bg-[#f3f4f6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f172a]"
              >
                Cerrar
              </button>
            </div>
            <div
              className="relative h-[420px] bg-[#0f172a]/5"
              onClick={() => goNext()}
            >
              {selected.media_url ? (
                selected.media_url.match(/\.mp4|\.mov|\.webm/i) ? (
                  <video src={selected.media_url} className="h-full w-full object-cover" controls autoPlay />
                ) : (
                  <img src={selected.media_url} alt={selected.title} className="h-full w-full object-cover" />
                )
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-[#6b7280]">
                  Sin imagen cargada
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent px-4 py-3 text-sm text-white">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.26em] text-white/70">Toca o usa ← → para avanzar</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-full bg-white/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        goPrev();
                      }}
                    >
                      Anterior
                    </button>
                    <button
                      type="button"
                      className="rounded-full bg-[#e87422] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        goNext();
                      }}
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-white/90">
                  {selected.content || "Recuerdo breve en formato historia."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
