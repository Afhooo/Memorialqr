"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

type DraftMemory = {
  title: string;
  content: string;
  mediaUrl: string;
};

const initialDraftMemory: DraftMemory = {
  title: "",
  content: "",
  mediaUrl: "",
};

export function MemorialCreatorForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [deathDate, setDeathDate] = useState("");
  const [description, setDescription] = useState("");
  const [draftMemory, setDraftMemory] = useState<DraftMemory>(initialDraftMemory);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/memorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          birthDate: birthDate || null,
          deathDate: deathDate || null,
          description,
          firstMemory: draftMemory.mediaUrl || draftMemory.content || draftMemory.title ? draftMemory : undefined,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "No pudimos crear el memorial");
      }

      setSuccess("Memorial creado. Abriendo lista actualizada…");
      setName("");
      setBirthDate("");
      setDeathDate("");
      setDescription("");
      setDraftMemory(initialDraftMemory);
      router.refresh();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "No pudimos crear el memorial";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]" onSubmit={handleSubmit}>
      <div className="space-y-3">
        <label className="block text-xs uppercase tracking-[0.26em] text-[#555555]">
          Nombre del memorial
          <input
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nombre y apellidos"
            className="mt-2 w-full rounded-2xl border border-[#e0e0e0] bg-white px-4 py-3 text-sm text-[#333333] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/30"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs uppercase tracking-[0.26em] text-[#555555]">
            Fecha de nacimiento
            <input
              type="date"
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-[#e0e0e0] bg-white px-4 py-3 text-sm text-[#333333] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/30"
            />
          </label>
          <label className="block text-xs uppercase tracking-[0.26em] text-[#555555]">
            Fecha de fallecimiento
            <input
              type="date"
              value={deathDate}
              onChange={(event) => setDeathDate(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-[#e0e0e0] bg-white px-4 py-3 text-sm text-[#333333] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/30"
            />
          </label>
        </div>
        <label className="block text-xs uppercase tracking-[0.26em] text-[#555555]">
          Descripción / obituario
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            placeholder="Perfil, logros, anécdotas o mensaje editorial."
            className="mt-2 w-full rounded-2xl border border-[#e0e0e0] bg-white px-4 py-3 text-sm text-[#333333] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/30"
          />
        </label>
        <div className="rounded-2xl border border-[#e0e0e0] bg-white/90 p-4">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#e87422]">Primer recuerdo (opcional)</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block text-xs uppercase tracking-[0.26em] text-[#555555]">
              Título
              <input
                type="text"
                value={draftMemory.title}
                onChange={(event) => setDraftMemory((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Carta, foto, video…"
                className="mt-2 w-full rounded-2xl border border-[#e0e0e0] bg-white px-4 py-3 text-sm text-[#333333] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/30"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.26em] text-[#555555]">
              URL de imagen o video
              <input
                type="url"
                value={draftMemory.mediaUrl}
                onChange={(event) => setDraftMemory((prev) => ({ ...prev, mediaUrl: event.target.value }))}
                placeholder="https://…"
                className="mt-2 w-full rounded-2xl border border-[#e0e0e0] bg-white px-4 py-3 text-sm text-[#333333] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/30"
              />
            </label>
          </div>
          <label className="mt-3 block text-xs uppercase tracking-[0.26em] text-[#555555]">
            Texto del recuerdo
            <textarea
              value={draftMemory.content}
              onChange={(event) => setDraftMemory((prev) => ({ ...prev, content: event.target.value }))}
              rows={3}
              placeholder="Palabras que acompañan el material."
              className="mt-2 w-full rounded-2xl border border-[#e0e0e0] bg-white px-4 py-3 text-sm text-[#333333] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/30"
            />
          </label>
        </div>
        {error && <p className="text-xs text-[#b3261e]">{error}</p>}
        {success && <p className="text-xs text-[#2e7d32]">{success}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[#e87422] px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[0_14px_35px_rgba(0,0,0,0.2)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Creando…" : "Crear memorial"}
        </button>
      </div>

      <div className="space-y-3 rounded-2xl border border-[#e0e0e0] bg-white/90 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.05)]">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#e87422]">Previsualización</p>
        <div className="space-y-2 rounded-2xl border border-[#e0e0e0] bg-gradient-to-br from-white via-[#f9f9f9] to-[#eef2ef] p-4">
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#555555]">
            <span className="rounded-full border border-[#e87422] bg-[#e87422]/10 px-3 py-1 text-[#e87422]">
              {name || "Nombre del memorial"}
            </span>
            <span className="rounded-full border border-[#e0e0e0] bg-white/80 px-3 py-1">
              {birthDate || "Fecha de nacimiento"}
            </span>
            <span className="rounded-full border border-[#e0e0e0] bg-white/80 px-3 py-1">
              {deathDate || "Fecha de fallecimiento"}
            </span>
          </div>
          <p className="text-sm text-[#4a4a4a]">
            {description || "Aquí verás el obituario o resumen editorial del memorial."}
          </p>
          {(draftMemory.mediaUrl || draftMemory.content) && (
            <div className="rounded-xl border border-[#e0e0e0] bg-white/95 p-3">
              <p className="text-[10px] uppercase tracking-[0.26em] text-[#e87422]">
                {draftMemory.title || "Primer recuerdo"}
              </p>
              {draftMemory.mediaUrl && (
                <div className="mt-2 overflow-hidden rounded-lg border border-[#e0e0e0] bg-black/5">
                  {draftMemory.mediaUrl.match(/\.mp4|\.mov|\.webm/i) ? (
                    <video src={draftMemory.mediaUrl} controls className="h-48 w-full object-cover" />
                  ) : (
                    <img src={draftMemory.mediaUrl} alt="Vista previa" className="h-48 w-full object-cover" />
                  )}
                </div>
              )}
              {draftMemory.content && <p className="mt-2 text-sm text-[#4a4a4a]">{draftMemory.content}</p>}
            </div>
          )}
        </div>
        <p className="text-xs text-[#555555]">
          Para archivos locales, sube primero a un almacenamiento seguro y pega aquí la URL (pendiente integrar subida directa).
        </p>
      </div>
    </form>
  );
}
