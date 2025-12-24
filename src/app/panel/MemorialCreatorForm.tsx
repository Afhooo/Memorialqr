/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

const templates = [
  { id: "ambar", name: "Ámbar vivo", accent: "#e87422", background: "from-[#2a1409] via-[#3c2416] to-[#e6b07c]" },
  { id: "bruma", name: "Bruma azul", accent: "#2b9fb8", background: "from-[#0b1b24] via-[#123445] to-[#7bd3e3]" },
  { id: "bosque", name: "Bosque profundo", accent: "#3f7f52", background: "from-[#0f1a11] via-[#1e3522] to-[#9ad2a3]" },
] as const;

type UploadResult = { path: string; signedUrl: string };

type MediaDraft = {
  id: string;
  file: File;
  localUrl: string;
  uploaded: UploadResult | null;
  title: string;
  content: string;
  includeAsMemory: boolean;
};

const isPreviewableFile = (file: File) => file.type.startsWith("image/") || file.type.startsWith("video/");
const isVideoUrl = (url: string) => {
  const clean = url.split("?")[0] ?? "";
  return /\.(mp4|mov|webm|ogg)$/i.test(clean);
};

export function MemorialCreatorForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [deathDate, setDeathDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [templateId, setTemplateId] = useState<string>(templates[0].id);

  const [media, setMedia] = useState<MediaDraft[]>([]);
  const [coverId, setCoverId] = useState<string | null>(null);
  const [avatarId, setAvatarId] = useState<string | null>(null);

  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const template = useMemo(() => templates.find((item) => item.id === templateId) ?? templates[0], [templateId]);
  const active = useMemo(() => (activeId ? media.find((m) => m.id === activeId) ?? null : null), [activeId, media]);

  const coverItem = useMemo(() => (coverId ? media.find((m) => m.id === coverId) ?? null : null), [coverId, media]);
  const avatarItem = useMemo(() => (avatarId ? media.find((m) => m.id === avatarId) ?? null : null), [avatarId, media]);
  const memoryItems = useMemo(() => media.filter((item) => item.includeAsMemory), [media]);

  const previewCoverUrl = coverItem?.uploaded?.signedUrl || coverItem?.localUrl || "";
  const previewAvatarUrl = avatarItem?.uploaded?.signedUrl || avatarItem?.localUrl || "";

  useEffect(() => {
    return () => {
      media.forEach((item) => URL.revokeObjectURL(item.localUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = (files: File[]) => {
    setError(null);
    if (!files.length) return;

    const rejected = files.filter((file) => !isPreviewableFile(file));
    if (rejected.length) {
      setError("Algunos archivos no se pudieron agregar (solo fotos o videos).");
    }

    const next: MediaDraft[] = files
      .filter(isPreviewableFile)
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
        localUrl: URL.createObjectURL(file),
        uploaded: null,
        title: "",
        content: "",
        includeAsMemory: true,
      }));

    if (!next.length) return;

    setMedia((prev) => [...next, ...prev]);
    setCoverId((prev) => prev ?? next[0]?.id ?? null);
    setAvatarId((prev) => prev ?? next[0]?.id ?? null);
  };

  const removeMedia = (id: string) => {
    setMedia((prev) => {
      const found = prev.find((item) => item.id === id);
      if (found) URL.revokeObjectURL(found.localUrl);
      return prev.filter((item) => item.id !== id);
    });
    setCoverId((prev) => (prev === id ? null : prev));
    setAvatarId((prev) => (prev === id ? null : prev));
    setActiveId((prev) => (prev === id ? null : prev));
  };

  const updateMedia = (id: string, patch: Partial<Pick<MediaDraft, "title" | "content" | "includeAsMemory">>) => {
    setMedia((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const moveMedia = (id: string, direction: -1 | 1) => {
    setMedia((prev) => {
      const idx = prev.findIndex((item) => item.id === id);
      if (idx < 0) return prev;
      const nextIndex = idx + direction;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const copy = [...prev];
      const [picked] = copy.splice(idx, 1);
      copy.splice(nextIndex, 0, picked);
      return copy;
    });
  };

  const uploadMediaFile = async (params: { kind: string; file: File; key: string; memorialId?: string }) => {
    setUploading((prev) => ({ ...prev, [params.key]: true }));
    setError(null);

    try {
      const form = new FormData();
      form.set("file", params.file);
      form.set("kind", params.kind);
      if (params.memorialId) {
        form.set("memorialId", params.memorialId);
      }

      const response = await fetch("/api/uploads", { method: "POST", body: form });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "No pudimos subir el archivo");
      }

      return payload as UploadResult;
    } finally {
      setUploading((prev) => ({ ...prev, [params.key]: false }));
    }
  };

  const ensureUploaded = async (id: string) => {
    const item = media.find((m) => m.id === id);
    if (!item) throw new Error("Archivo no encontrado");
    if (item.uploaded) return item.uploaded;
    const uploaded = await uploadMediaFile({ kind: "media", file: item.file, key: id });
    setMedia((prev) => prev.map((m) => (m.id === id ? { ...m, uploaded } : m)));
    return uploaded;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const trimmedName = name.trim();
      if (!trimmedName) {
        throw new Error("Ponle un nombre al memorial.");
      }

      const idsToUpload = new Set<string>();
      if (coverId) idsToUpload.add(coverId);
      if (avatarId) idsToUpload.add(avatarId);
      media.filter((item) => item.includeAsMemory).forEach((item) => idsToUpload.add(item.id));

      const uploadedMap = new Map<string, UploadResult>();
      for (const id of idsToUpload) {
        const uploaded = await ensureUploaded(id);
        uploadedMap.set(id, uploaded);
      }

      const coverUpload = coverId ? uploadedMap.get(coverId) ?? null : null;
      const avatarUpload = avatarId ? uploadedMap.get(avatarId) ?? null : null;
      const selectedMemories = media.filter((item) => item.includeAsMemory);

      const response = await fetch("/api/memorials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          birthDate: birthDate || null,
          deathDate: deathDate || null,
          description: description.trim(),
          coverMediaPath: coverUpload?.path ?? null,
          coverMediaUrl: null,
          avatarMediaPath: avatarUpload?.path ?? null,
          avatarMediaUrl: null,
          templateId: template.id,
          firstMemory: selectedMemories[0]
            ? {
                title: selectedMemories[0].title.trim() || "Recuerdo",
                content: selectedMemories[0].content.trim() || "",
                mediaUrl: null,
                mediaPath: uploadedMap.get(selectedMemories[0].id)?.path ?? null,
              }
            : undefined,
          gallery: selectedMemories.slice(1).map((item) => ({
            title: item.title.trim() || "Recuerdo",
            content: item.content.trim() || "",
            mediaUrl: null,
            mediaPath: uploadedMap.get(item.id)?.path ?? null,
          })),
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "No pudimos crear el memorial");
      }

      const memorialId = typeof payload.memorialId === "string" ? payload.memorialId : null;
      setSuccess("Listo. Te llevo al memorial para que sigas subiendo recuerdos.");
      if (memorialId) {
        router.push(`/memorial/${memorialId}`);
        return;
      }
      router.refresh();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "No pudimos crear el memorial";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <section className="space-y-5">
          <div className="overflow-hidden rounded-[28px] border border-[#e6e8ef] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className={`relative overflow-hidden bg-gradient-to-br ${template.background}`}>
              <div className="absolute inset-0 opacity-70 [background:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.20),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.12),transparent_40%)]" />
              <div className="relative">
                <div
                  className="relative aspect-[21/9] w-full overflow-hidden bg-black/15"
                  onClick={() => coverId && setActiveId(coverId)}
                >
                  {previewCoverUrl ? (
                    isVideoUrl(previewCoverUrl) ? (
                      <video
                        src={previewCoverUrl}
                        className="absolute inset-0 h-full w-full object-cover"
                        muted
                        loop
                        playsInline
                        autoPlay
                      />
                    ) : (
                      <img
                        src={previewCoverUrl}
                        alt="Portada"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-white/85">
                      <div className="space-y-2">
                        <p className="text-[11px] uppercase tracking-[0.28em] text-white/70">Portada</p>
                        <p className="text-base font-semibold">Suelta una foto aquí (o elige una de tu biblioteca).</p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center justify-center rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f172a]"
                        >
                          Agregar fotos
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                    <div className="flex items-end gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (avatarId) setActiveId(avatarId);
                        }}
                        className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-white/70 bg-white/15 shadow-[0_18px_48px_rgba(0,0,0,0.35)]"
                        title="Ver foto principal"
                      >
                        {previewAvatarUrl ? (
                          <img
                            src={previewAvatarUrl}
                            alt="Foto principal"
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
                            Foto
                          </div>
                        )}
                      </button>
                      <div className="min-w-0 text-white">
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Nombre (como lo dicen en la casa)"
                          className="w-full max-w-[520px] bg-transparent text-2xl font-semibold leading-tight placeholder:text-white/60 outline-none"
                          required
                        />
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.22em] text-white/75">
                          <label className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                            <span>Nació</span>
                            <input
                              type="date"
                              value={birthDate}
                              onChange={(e) => setBirthDate(e.target.value)}
                              className="bg-transparent text-[11px] outline-none [color-scheme:dark]"
                            />
                          </label>
                          <label className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                            <span>Partió</span>
                            <input
                              type="date"
                              value={deathDate}
                              onChange={(e) => setDeathDate(e.target.value)}
                              className="bg-transparent text-[11px] outline-none [color-scheme:dark]"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/75">
                      <span className="rounded-full bg-white/10 px-3 py-1">Fotos {media.length}</span>
                      <span className="rounded-full bg-white/10 px-3 py-1">Recuerdos {memoryItems.length}</span>
                    </div>
                  </div>
                </div>

                <div className="relative p-4">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-white/70">Unas líneas para la familia</p>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Escribe algo sencillo: quién fue, cómo lo recuerdan, qué te gustaría que se sienta al entrar."
                    className="mt-2 w-full resize-none rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/55 outline-none backdrop-blur focus:border-white/35"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#e6e8ef] bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.26em] text-[#e87422]">Biblioteca</p>
                <p className="text-sm text-[#475569]">Arrastra fotos/videos, marca portada, foto principal y qué entra como recuerdo.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full bg-[#0f172a] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_14px_40px_rgba(15,23,42,0.18)]"
                >
                  Agregar
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={(e) => addFiles(Array.from(e.target.files ?? []))}
              />
            </div>

            <div
              className="mt-4 rounded-3xl border border-dashed border-[#d4dae5] bg-[#f8fafc] p-4"
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                addFiles(Array.from(e.dataTransfer.files ?? []));
              }}
            >
              {media.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-[#64748b]">
                  <p className="text-base font-semibold text-[#0f172a]">Agrega las fotos de siempre</p>
                  <p className="max-w-md text-sm">
                    Puedes subir varias de una. Después eliges cuál es portada y cuál queda como foto principal.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {media.map((item) => {
                    const url = item.uploaded?.signedUrl || item.localUrl;
                    const isCover = item.id === coverId;
                    const isAvatar = item.id === avatarId;
                    const isUploading = Boolean(uploading[item.id]);
                    return (
                      <div
                        key={item.id}
                        className={`group relative overflow-hidden rounded-3xl border bg-white shadow-[0_14px_40px_rgba(0,0,0,0.08)] transition ${
                          isCover ? "border-[#e87422]" : "border-[#e6e8ef]"
                        }`}
                      >
                        <button
                          type="button"
                          className="relative block aspect-square w-full overflow-hidden bg-[#0f172a]/5"
                          onClick={() => setActiveId(item.id)}
                        >
                          {isVideoUrl(url) ? (
                            <video src={url} className="absolute inset-0 h-full w-full object-cover" muted playsInline />
                          ) : (
                            <img
                              src={url}
                              alt={item.file.name}
                              className="absolute inset-0 h-full w-full object-cover"
                              loading="lazy"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-0 transition group-hover:opacity-100" />
                          {(isCover || isAvatar) && (
                            <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                              {isCover && (
                                <span className="rounded-full bg-[#e87422] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                                  Portada
                                </span>
                              )}
                              {isAvatar && (
                                <span className="rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0f172a]">
                                  Foto
                                </span>
                              )}
                            </div>
                          )}
                          {isUploading && (
                            <div className="absolute inset-x-2 bottom-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                              Subiendo…
                            </div>
                          )}
                        </button>
                        <div className="p-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => setCoverId(item.id)}
                              className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] transition ${
                                isCover
                                  ? "border-[#e87422] bg-[#fff7ed] text-[#9a3412]"
                                  : "border-[#e6e8ef] bg-white text-[#334155] hover:border-[#e87422]/40"
                              }`}
                            >
                              Portada
                            </button>
                            <button
                              type="button"
                              onClick={() => setAvatarId(item.id)}
                              className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] transition ${
                                isAvatar
                                  ? "border-[#0f172a] bg-[#0f172a] text-white"
                                  : "border-[#e6e8ef] bg-white text-[#334155] hover:border-[#0f172a]/30"
                              }`}
                            >
                              Foto
                            </button>
                            <button
                              type="button"
                              onClick={() => updateMedia(item.id, { includeAsMemory: !item.includeAsMemory })}
                              className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] transition ${
                                item.includeAsMemory
                                  ? "border-[#22c55e] bg-[#f0fdf4] text-[#166534]"
                                  : "border-[#e6e8ef] bg-white text-[#334155] hover:border-[#22c55e]/40"
                              }`}
                            >
                              {item.includeAsMemory ? "Recuerdo" : "Sin recuerdo"}
                            </button>
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => moveMedia(item.id, -1)}
                                className="rounded-full border border-[#e6e8ef] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#334155] hover:border-[#0f172a]/25"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                onClick={() => moveMedia(item.id, 1)}
                                className="rounded-full border border-[#e6e8ef] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#334155] hover:border-[#0f172a]/25"
                              >
                                ↓
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeMedia(item.id)}
                              className="rounded-full border border-[#fee2e2] bg-[#fef2f2] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#b91c1c]"
                            >
                              Quitar
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-[#e6e8ef] bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.26em] text-[#0ea5e9]">Tono</p>
                <p className="text-sm text-[#475569]">Elige una atmósfera. Puedes cambiarla después.</p>
              </div>
              <span className="rounded-full border border-[#e6e8ef] bg-[#f8fafc] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0f172a]">
                {template.name}
              </span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setTemplateId(tpl.id)}
                  className={`relative overflow-hidden rounded-3xl border-2 px-4 py-4 text-left transition ${
                    templateId === tpl.id ? "border-[#0f172a]" : "border-[#e6e8ef] hover:border-[#0f172a]/25"
                  } bg-gradient-to-br ${tpl.background}`}
                >
                  <span className="absolute inset-0 bg-black/10" />
                  <div className="relative text-white">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">Tema</p>
                    <p className="mt-1 text-base font-semibold">{tpl.name}</p>
                    <span className="mt-2 block h-2 w-full rounded-full" style={{ backgroundColor: tpl.accent }} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-[28px] border border-[#e6e8ef] bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <p className="text-[11px] uppercase tracking-[0.26em] text-[#e87422]">Recuerdos</p>
            <p className="mt-1 text-sm text-[#475569]">
              Agrega una frase por foto si te nace. Si lo dejas vacío, igual se ve bonito.
            </p>

            {memoryItems.length === 0 ? (
              <div className="mt-4 rounded-3xl border border-dashed border-[#d4dae5] bg-[#f8fafc] px-4 py-10 text-center text-sm text-[#64748b]">
                Marca alguna foto como “Recuerdo” para armar el carrete inicial.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {memoryItems.slice(0, 6).map((item) => {
                  const url = item.uploaded?.signedUrl || item.localUrl;
                  return (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-3xl border border-[#e6e8ef] bg-[#fbfcff] p-3"
                    >
                      <button
                        type="button"
                        onClick={() => setActiveId(item.id)}
                        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#0f172a]/5"
                      >
                        {isVideoUrl(url) ? (
                          <video src={url} className="absolute inset-0 h-full w-full object-cover" muted playsInline />
                        ) : (
                          <img src={url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                        )}
                      </button>
                      <div className="min-w-0 flex-1 space-y-2">
                        <input
                          value={item.title}
                          onChange={(e) => updateMedia(item.id, { title: e.target.value })}
                          placeholder="Título (opcional)"
                          className="w-full rounded-2xl border border-[#e6e8ef] bg-white px-3 py-2 text-sm text-[#0f172a] outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20"
                        />
                        <textarea
                          value={item.content}
                          onChange={(e) => updateMedia(item.id, { content: e.target.value })}
                          placeholder="Una línea que acompañe esta foto…"
                          rows={2}
                          className="w-full resize-none rounded-2xl border border-[#e6e8ef] bg-white px-3 py-2 text-sm text-[#0f172a] outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20"
                        />
                      </div>
                    </div>
                  );
                })}
                {memoryItems.length > 6 && (
                  <p className="text-xs text-[#64748b]">
                    Se guardarán {memoryItems.length} recuerdos. Aquí ves los primeros 6.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-[#e6e8ef] bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.26em] text-[#22c55e]">Crear</p>
                <p className="text-sm text-[#475569]">Si falta algo, lo puedes ajustar después. Lo importante es empezar.</p>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-gradient-to-r from-[#22c55e] via-[#e87422] to-[#0ea5e9] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_48px_rgba(0,0,0,0.18)] transition hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Creando…" : "Crear memorial"}
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
                {error}
              </div>
            )}
            {success && (
              <div className="mt-4 rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-sm text-[#166534]">
                {success}
              </div>
            )}
          </div>
        </aside>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur"
          onMouseDown={() => setActiveId(null)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/15 bg-white shadow-[0_40px_140px_rgba(0,0,0,0.45)]"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-[#e6e8ef] px-4 py-3">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.26em] text-[#6b7280]">Previsualización</p>
                <p className="truncate text-sm font-semibold text-[#0f172a]">{active.file.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="rounded-full bg-[#f3f4f6] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0f172a]"
              >
                Cerrar
              </button>
            </div>
            <div className="relative aspect-[16/9] w-full bg-[#0f172a]/5">
              {(() => {
                const url = active.uploaded?.signedUrl || active.localUrl;
                return isVideoUrl(url) ? (
                  <video src={url} className="absolute inset-0 h-full w-full object-cover" controls autoPlay />
                ) : (
                  <img src={url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                );
              })()}
            </div>
            <div className="grid gap-2 p-4 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setCoverId(active.id)}
                className={`rounded-2xl border px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                  active.id === coverId
                    ? "border-[#e87422] bg-[#fff7ed] text-[#9a3412]"
                    : "border-[#e6e8ef] bg-white text-[#0f172a] hover:border-[#e87422]/40"
                }`}
              >
                Usar como portada
              </button>
              <button
                type="button"
                onClick={() => setAvatarId(active.id)}
                className={`rounded-2xl border px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                  active.id === avatarId
                    ? "border-[#0f172a] bg-[#0f172a] text-white"
                    : "border-[#e6e8ef] bg-white text-[#0f172a] hover:border-[#0f172a]/25"
                }`}
              >
                Usar como foto
              </button>
              <button
                type="button"
                onClick={() => updateMedia(active.id, { includeAsMemory: !active.includeAsMemory })}
                className={`rounded-2xl border px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                  active.includeAsMemory
                    ? "border-[#22c55e] bg-[#f0fdf4] text-[#166534]"
                    : "border-[#e6e8ef] bg-white text-[#0f172a] hover:border-[#22c55e]/40"
                }`}
              >
                {active.includeAsMemory ? "Quitar de recuerdos" : "Agregar a recuerdos"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

