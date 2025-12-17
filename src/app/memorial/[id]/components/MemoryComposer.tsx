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
    <form
      className="relative space-y-4 overflow-hidden rounded-3xl border border-[#e2e8f0] bg-white/95 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.08)] sm:p-5"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0f172a]">Composer fijo</p>
          <p className="text-xs text-[#64748b]">Escribe mientras lees; se guarda al instante.</p>
        </div>
        <span className="rounded-full bg-[#0f172a] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
          En vivo
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs uppercase tracking-[0.2em] text-[#475569]">
          Título
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Carta, recuerdo, apodo…"
            className="mt-2 w-full rounded-2xl border border-[#d7dee8] bg-white px-4 py-3 text-sm text-[#0f172a] outline-none transition focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/25"
            disabled={disabled || loading}
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.2em] text-[#475569]">
          Recuerdo
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Una anécdota corta, una nota de voz descrita o unas líneas de cariño."
            rows={4}
            className="mt-2 w-full rounded-2xl border border-[#d7dee8] bg-white px-4 py-3 text-sm text-[#0f172a] outline-none transition focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/25"
            disabled={disabled || loading}
            required
          />
        </label>
      </div>

      {helper && <p className="text-xs text-[#475569]">{helper}</p>}
      {error && <p className="text-xs text-[#b3261e]">{error}</p>}

      <div className="h-2 overflow-hidden rounded-full bg-[#f1f5f9]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#0ea5e9] via-[#22c55e] to-[#eab308] transition-[width]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <button
        type="submit"
        disabled={disabled || loading}
        className="w-full rounded-2xl bg-gradient-to-r from-[#0ea5e9] via-[#22c55e] to-[#e87422] px-4 py-3 text-sm font-semibold uppercase tracking-[0.26em] text-white shadow-[0_16px_40px_rgba(0,0,0,0.14)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
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
