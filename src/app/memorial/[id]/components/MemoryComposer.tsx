"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

interface MemoryComposerProps {
  memorialId: string;
  disabled?: boolean;
  helper?: string;
}

export function MemoryComposer({ memorialId, disabled = false, helper }: MemoryComposerProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; delay: number; color: string }>>([]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading || disabled) return;

    setLoading(true);
    setProgress(6);
    setError(null);

    const timer = setInterval(() => {
      setProgress((value) => Math.min(96, value + 6 + Math.random() * 8));
    }, 180);

    try {
      const response = await fetch(`/api/memorials/${memorialId}/memories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || "Mensaje",
          content: content.trim(),
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "No pudimos guardar tu mensaje");
      }

      setTitle("");
      setContent("");
      setProgress(100);
      setConfetti(
        Array.from({ length: 26 }).map((_, idx) => ({
          id: Date.now() + idx,
          x: Math.random() * 100,
          delay: Math.random() * 120,
          color: ["#e87422", "#facc15", "#38bdf8", "#22c55e"][idx % 4],
        })),
      );
      setTimeout(() => setConfetti([]), 1500);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "No pudimos guardar tu mensaje";
      setError(message);
    } finally {
      setLoading(false);
      clearInterval(timer);
      setTimeout(() => setProgress(0), 400);
    }
  };

  return (
    <form className="relative space-y-3 overflow-hidden" onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
        <label className="block text-xs uppercase tracking-[0.26em] text-[#555555]">
          Título del mensaje
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Carta, recuerdo, vela encendida…"
            className="mt-2 w-full rounded-2xl border border-[#e0e0e0] bg-white px-4 py-3 text-sm text-[#333333] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/30"
            disabled={disabled || loading}
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.26em] text-[#555555]">
          Recuerdo
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Escribe unas líneas con tu recuerdo o condolencia."
            rows={4}
            className="mt-2 w-full rounded-2xl border border-[#e0e0e0] bg-white px-4 py-3 text-sm text-[#333333] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/30"
            disabled={disabled || loading}
            required
          />
        </label>
      </div>
      {helper && <p className="text-xs text-[#555555]">{helper}</p>}
      {error && <p className="text-xs text-[#b3261e]">{error}</p>}
      <div className="h-1 overflow-hidden rounded-full bg-[#f1f5f9]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#e87422] via-[#facc15] to-[#22c55e] transition-[width]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <button
        type="submit"
        disabled={disabled || loading}
        className="w-full rounded-2xl bg-[#e87422] px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[0_14px_35px_rgba(0,0,0,0.16)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Publicando…" : "Publicar mensaje"}
      </button>
      {confetti.length > 0 && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {confetti.map((piece) => (
            <span
              key={piece.id}
              className="absolute text-lg animate-[confetti_1.2s_ease-out_forwards]"
              style={{
                left: `${piece.x}%`,
                top: "-8%",
                animationDelay: `${piece.delay}ms`,
                color: piece.color,
              }}
            >
              ✦
            </span>
          ))}
        </div>
      )}
      <style jsx>{`
        @keyframes confetti {
          0% {
            opacity: 0.9;
            transform: translateY(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: translateY(35vh) rotate(90deg);
          }
          100% {
            opacity: 0;
            transform: translateY(70vh) rotate(180deg);
          }
        }
      `}</style>
    </form>
  );
}
