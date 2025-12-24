"use client";

/* eslint-disable @next/next/no-img-element */

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";

interface MemoryComposerProps {
  memorialId: string;
  disabled?: boolean;
  helper?: string;
}

type UploadResult = { path: string; signedUrl: string };

const isVideoUrl = (url: string) => {
  const clean = url.split("?")[0] ?? "";
  return /\.(mp4|mov|webm|ogg)$/i.test(clean);
};

const isVideoFile = (file: File) => file.type.startsWith("video/") || isVideoUrl(file.name);

export function MemoryComposer({ memorialId, disabled = false, helper }: MemoryComposerProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>("");
  const [uploaded, setUploaded] = useState<UploadResult | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; delay: number; color: string }>>([]);

  useEffect(() => {
    if (!file) {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl("");
      setUploaded(null);
      return;
    }
    const nextUrl = URL.createObjectURL(file);
    setFilePreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextUrl;
    });
    setUploaded(null);
    return () => URL.revokeObjectURL(nextUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const uploadSelectedFile = async (): Promise<UploadResult | null> => {
    if (!file) return null;
    if (uploaded) return uploaded;

    setUploadingFile(true);
    setError(null);
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("kind", "memory");
      form.set("memorialId", memorialId);

      const response = await fetch("/api/uploads", { method: "POST", body: form });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "No pudimos subir el archivo");
      }
      const result = payload as UploadResult;
      setUploaded(result);
      return result;
    } finally {
      setUploadingFile(false);
    }
  };

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
      const trimmedTitle = title.trim() || "Mensaje";
      const trimmedContent = content.trim();
      const hasAttachment = Boolean(file);
      if (!trimmedContent && !hasAttachment) {
        throw new Error("Escribe algo o adjunta una foto/video.");
      }

      const upload = hasAttachment ? await uploadSelectedFile() : null;

      const response = await fetch(`/api/memorials/${memorialId}/memories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmedTitle,
          content: trimmedContent,
          mediaPath: upload?.path ?? null,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "No pudimos guardar tu mensaje");
      }

      setTitle("");
      setContent("");
      setFile(null);
      setUploaded(null);
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
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0f172a]">Deja un recuerdo</p>
          <p className="text-xs text-[#64748b]">Un mensaje corto o una foto del carrete. Se guarda al instante.</p>
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
            placeholder="Una anécdota corta, una frase de cariño o el contexto de la foto."
            rows={4}
            className="mt-2 w-full rounded-2xl border border-[#d7dee8] bg-white px-4 py-3 text-sm text-[#0f172a] outline-none transition focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/25"
            disabled={disabled || loading}
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs uppercase tracking-[0.2em] text-[#475569]">Adjunto</div>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => {
              const picked = e.target.files?.[0] ?? null;
              setFile(picked);
            }}
            disabled={disabled || loading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || loading}
            className="rounded-full border border-[#e2e8f0] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0f172a] transition hover:border-[#0ea5e9]/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {file ? "Cambiar" : "Agregar foto/video"}
          </button>
          {file && (
            <button
              type="button"
              onClick={() => setFile(null)}
              disabled={disabled || loading}
              className="rounded-full border border-[#fee2e2] bg-[#fef2f2] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b91c1c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Quitar
            </button>
          )}
        </div>
      </div>

      {file && (
        <div className="overflow-hidden rounded-3xl border border-[#e2e8f0] bg-white shadow-[0_16px_44px_rgba(0,0,0,0.08)]">
          <div className="relative aspect-[16/9] w-full bg-[#0f172a]/5">
            {filePreviewUrl ? (
              isVideoFile(file) ? (
                <video src={filePreviewUrl} className="absolute inset-0 h-full w-full object-cover" controls />
              ) : (
                <img src={filePreviewUrl} alt="Previsualización" className="absolute inset-0 h-full w-full object-cover" />
              )
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-[#64748b]">Preparando vista previa…</div>
            )}
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-[#475569]">
            <span className="truncate">{file.name}</span>
            <span>{uploadingFile ? "Subiendo…" : uploaded ? "Listo" : "Se sube al publicar"}</span>
          </div>
        </div>
      )}

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
