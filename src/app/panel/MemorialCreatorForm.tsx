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

type GalleryItem = {
  title: string;
  content: string;
  mediaUrl: string;
};

const templates = [
  { id: "ambar", name: "Ámbar vivo", accent: "#e87422", background: "from-[#2a1409] via-[#3c2416] to-[#e6b07c]" },
  { id: "bruma", name: "Bruma azul", accent: "#2b9fb8", background: "from-[#0b1b24] via-[#123445] to-[#7bd3e3]" },
  { id: "bosque", name: "Bosque profundo", accent: "#3f7f52", background: "from-[#0f1a11] via-[#1e3522] to-[#9ad2a3]" },
];

export function MemorialCreatorForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [deathDate, setDeathDate] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [draftMemory, setDraftMemory] = useState<DraftMemory>(initialDraftMemory);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [template, setTemplate] = useState(templates[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const completionBase = [name, birthDate, deathDate, description, coverUrl, avatarUrl].filter(Boolean).length;
  const completionExtras =
    (draftMemory.title || draftMemory.content || draftMemory.mediaUrl ? 1 : 0) + (gallery.length > 0 ? 1 : 0);
  const completion = Math.min(100, Math.round(((completionBase + completionExtras) / 8) * 100));

  const stepData = [
    { key: "identidad", label: "Identidad", done: Boolean(name && description) },
    { key: "portada", label: "Portada/Avatar", done: Boolean(coverUrl && avatarUrl) },
    { key: "tema", label: "Tema", done: Boolean(template) },
    { key: "primer", label: "Primer recuerdo", done: Boolean(draftMemory.title || draftMemory.mediaUrl || draftMemory.content) },
    { key: "galeria", label: "Galería", done: gallery.length > 0 },
    { key: "publicar", label: "Publicar", done: completion >= 80 },
  ];

  const carouselItems =
    (draftMemory.mediaUrl
      ? [
          {
            title: draftMemory.title || "Primer recuerdo",
            mediaUrl: draftMemory.mediaUrl,
            content: draftMemory.content,
          },
        ]
      : []) as Array<{ title: string; mediaUrl: string; content?: string }>;

  gallery.forEach((item, index) => {
    if (item.mediaUrl) {
      carouselItems.push({
        title: item.title || `Galería ${index + 1}`,
        mediaUrl: item.mediaUrl,
        content: item.content,
      });
    }
  });

  const addGalleryItem = () => {
    setGallery((prev) => [...prev, { title: "", content: "", mediaUrl: "" }]);
  };

  const updateGalleryItem = (index: number, field: keyof GalleryItem, value: string) => {
    setGallery((prev) => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));
  };

  const removeGalleryItem = (index: number) => {
    setGallery((prev) => prev.filter((_, idx) => idx !== index));
  };

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
          coverUrl,
          avatarUrl,
          template: template.id,
          firstMemory: draftMemory.mediaUrl || draftMemory.content || draftMemory.title ? draftMemory : undefined,
          gallery: gallery.filter((item) => item.mediaUrl || item.content || item.title),
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
      setCoverUrl("");
      setAvatarUrl("");
      setDraftMemory(initialDraftMemory);
      setGallery([]);
      router.refresh();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "No pudimos crear el memorial";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-[22px] border border-[#e6e8ef] bg-gradient-to-r from-[#0f172a] via-[#152238] to-[#0f172a] p-5 text-white shadow-[0_18px_55px_rgba(15,23,42,0.25)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.14em] text-white/70">Guía de creación</p>
            <h3 className="text-xl font-semibold leading-tight">Completa cada etapa con claridad</h3>
            <p className="text-sm text-white/70">Identidad, portada, recuerdo y publicación en un recorrido guiado.</p>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]">
              Avance
            </span>
            <span className="text-xl font-semibold text-white">{completion}%</span>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stepData.map((step, index) => (
            <div
              key={step.key}
              className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-xs ${
                step.done ? "border-white/30 bg-white/10 text-white" : "border-white/10 bg-white/5 text-white/70"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${
                    step.done ? "bg-white text-[#0f172a]" : "bg-white/10 text-white"
                  }`}
                >
                  {step.done ? "✓" : index + 1}
                </span>
                <span className="leading-tight">{step.label}</span>
              </div>
              <span className="text-[11px] uppercase tracking-[0.12em]">{step.done ? "Listo" : "Pend."}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 h-2 rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#e87422] via-[#f3b172] to-[#33c2b3]"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[22px] border border-[#e6e8ef] bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
        <div id="identidad" className="absolute -top-24 left-0 h-1 w-1 opacity-0" />
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[12px] uppercase tracking-[0.14em] text-[#e87422]">Identidad editorial</p>
            <p className="text-sm text-[#475569]">Dale un tono cuidado a nombre, fechas y obituario.</p>
          </div>
          <div className="w-full max-w-[220px]">
            <div className="flex items-center justify-between text-xs text-[#475569]">
              <span>Progreso</span>
              <span className="font-semibold text-[#e87422]">{completion}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-[#f1f5f9]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#e87422] via-[#f3b172] to-[#33c2b3]"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2 text-sm font-semibold text-[#0f172a]">
            Nombre del memorial
            <input
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nombre y apellidos"
              className="mt-2 w-full rounded-xl border border-[#e6e8ef] bg-[#f8fafc] px-4 py-3 text-sm text-[#0f172a] shadow-[0_10px_26px_rgba(15,23,42,0.05)] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/20"
            />
          </label>
          <label className="text-sm font-semibold text-[#0f172a]">
            Fecha de nacimiento
            <input
              type="date"
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#e6e8ef] bg-[#f8fafc] px-4 py-3 text-sm text-[#0f172a] shadow-[0_10px_26px_rgba(15,23,42,0.05)] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/20"
            />
          </label>
          <label className="text-sm font-semibold text-[#0f172a]">
            Fecha de fallecimiento
            <input
              type="date"
              value={deathDate}
              onChange={(event) => setDeathDate(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#e6e8ef] bg-[#f8fafc] px-4 py-3 text-sm text-[#0f172a] shadow-[0_10px_26px_rgba(15,23,42,0.05)] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/20"
            />
          </label>
        </div>
        <label className="mt-3 block text-sm font-semibold text-[#0f172a]">
          Descripción / obituario
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            placeholder="Perfil, logros, anécdotas o mensaje editorial."
            className="mt-2 w-full rounded-xl border border-[#e6e8ef] bg-[#f8fafc] px-4 py-3 text-sm text-[#0f172a] shadow-[0_10px_26px_rgba(15,23,42,0.05)] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/20"
          />
        </label>
      </div>

      <div className="relative overflow-hidden rounded-[22px] border border-[#e6e8ef] bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
        <div id="multimedia" className="absolute -top-24 left-0 h-1 w-1 opacity-0" />
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[12px] uppercase tracking-[0.14em] text-[#e87422]">Portada y avatar</p>
            <p className="text-sm text-[#475569]">Usa URLs limpias mientras habilitamos la subida directa.</p>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-[#e6e8ef] bg-[#f8fafc] px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#0f172a] sm:flex">
            <span className="h-2 w-2 rounded-full bg-gradient-to-br from-[#e87422] to-[#33c2b3]" />
            En línea
          </div>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr,0.95fr]">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-[#0f172a]">
              URL portada (imagen o video)
              <input
                type="url"
                value={coverUrl}
                onChange={(event) => setCoverUrl(event.target.value)}
                placeholder="https://..."
                className="mt-2 w-full rounded-xl border border-[#e6e8ef] bg-[#f8fafc] px-4 py-3 text-sm text-[#0f172a] shadow-[0_10px_26px_rgba(15,23,42,0.05)] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/20"
              />
            </label>
            <label className="block text-sm font-semibold text-[#0f172a]">
              URL avatar (foto)
              <input
                type="url"
                value={avatarUrl}
                onChange={(event) => setAvatarUrl(event.target.value)}
                placeholder="https://..."
                className="mt-2 w-full rounded-xl border border-[#e6e8ef] bg-[#f8fafc] px-4 py-3 text-sm text-[#0f172a] shadow-[0_10px_26px_rgba(15,23,42,0.05)] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/20"
              />
            </label>
            <div className="rounded-xl border border-[#e6e8ef] bg-[#f8fafc] px-4 py-3 text-sm text-[#0f172a]">
              <p className="font-semibold text-[#e87422]">Tip editorial</p>
              <p className="text-[#475569]">Portadas horizontales y retratos nítidos mejoran la lectura en móvil y escritorio.</p>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-[#e6e8ef] bg-gradient-to-br from-[#0f172a] via-[#111c2f] to-[#0f172a] text-white shadow-[0_18px_55px_rgba(15,23,42,0.25)]">
            <div className="relative h-44 w-full overflow-hidden">
              {coverUrl ? (
                coverUrl.match(/\.mp4|\.mov|\.webm/i) ? (
                  <video src={coverUrl} autoPlay loop muted className="h-full w-full object-cover" />
                ) : (
                  <img src={coverUrl} alt="Portada mini" className="h-full w-full object-cover" />
                )
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm uppercase tracking-[0.14em] text-white/70">
                  Portada
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            </div>
            <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">
              <div className="h-12 w-12 overflow-hidden rounded-full border border-white/70 bg-white/30">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar mini" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[11px] uppercase tracking-[0.16em]">
                    Avatar
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{name || "Nombre del memorial"}</p>
                <p className="text-xs text-white/75">
                  {birthDate || "Nacimiento"} · {deathDate || "Fallecimiento"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="tema"
        className="relative overflow-hidden rounded-[24px] border border-[#0f172a] bg-gradient-to-br from-[#0b1220] via-[#0f172a] to-[#0b1220] text-white shadow-[0_24px_70px_rgba(15,23,42,0.35)]"
      >
        <div className="pointer-events-none absolute inset-0 opacity-80 [background:radial-gradient(circle_at_18%_12%,rgba(232,116,34,0.2),transparent_36%),radial-gradient(circle_at_80%_0%,rgba(41,181,165,0.16),transparent_36%)]" />
        <div className="relative grid gap-5 p-5 lg:grid-cols-[1fr,1.1fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] uppercase tracking-[0.14em] text-white/70">Plantilla y atmósfera</p>
                <p className="text-sm text-white/70">Define el tono visual del memorial.</p>
              </div>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]">
                {template.name}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setTemplate(tpl)}
                  className={`relative overflow-hidden rounded-2xl border-2 px-3 py-3 text-left text-sm transition ${
                    template.id === tpl.id
                      ? "border-white shadow-[0_18px_48px_rgba(0,0,0,0.35)]"
                      : "border-white/15 hover:border-white/50"
                  } bg-gradient-to-br ${tpl.background}`}
                >
                  <span className="absolute inset-0 bg-black/10" />
                  <div className="relative space-y-1 text-white drop-shadow">
                    <span className="block text-[11px] uppercase tracking-[0.18em]">Tema</span>
                    <span className="text-base font-semibold">{tpl.name}</span>
                    <span className="mt-1 block h-2 w-full rounded-full" style={{ backgroundColor: tpl.accent }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/5 p-3 backdrop-blur">
            <div className="relative overflow-hidden rounded-xl border border-white/15 bg-black/10">
              <div className="relative h-56 w-full overflow-hidden">
                {coverUrl ? (
                  coverUrl.match(/\.mp4|\.mov|\.webm/i) ? (
                    <video src={coverUrl} autoPlay loop muted className="h-full w-full object-cover" />
                  ) : (
                    <img src={coverUrl} alt="Portada" className="h-full w-full object-cover" />
                  )
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.16em] text-white/80">
                    Portada
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-3 text-white drop-shadow">
                  <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white/80 bg-white/30">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[11px] uppercase tracking-[0.16em]">
                        Foto
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[12px] uppercase tracking-[0.2em]">{name || "Nombre del memorial"}</p>
                    <p className="text-xs text-white/80">
                      {birthDate || "Nacimiento"} · {deathDate || "Fallecimiento"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 px-3 pb-3 pt-3">
                <div className="rounded-xl border border-white/15 bg-white/90 p-3 text-[#0f172a] shadow-[0_10px_26px_rgba(15,23,42,0.12)]">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#64748b]">Obituario</p>
                  <p className="text-sm leading-relaxed">
                    {description || "Aquí verás el obituario o resumen editorial del memorial."}
                  </p>
                </div>

                {(draftMemory.mediaUrl || draftMemory.content) && (
                  <div className="rounded-xl border border-white/15 bg-white/90 p-3 text-[#0f172a] shadow-[0_10px_26px_rgba(15,23,42,0.12)]">
                    <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: template.accent }}>
                      {draftMemory.title || "Primer recuerdo"}
                    </p>
                    {draftMemory.mediaUrl && (
                      <div className="mt-2 overflow-hidden rounded-lg border border-[#e6e8ef] bg-black/5">
                        {draftMemory.mediaUrl.match(/\.mp4|\.mov|\.webm/i) ? (
                          <video src={draftMemory.mediaUrl} controls className="h-44 w-full object-cover" />
                        ) : (
                          <img src={draftMemory.mediaUrl} alt="Vista previa" className="h-44 w-full object-cover" />
                        )}
                      </div>
                    )}
                    {draftMemory.content && <p className="mt-2 text-sm text-[#0f172a]">{draftMemory.content}</p>}
                  </div>
                )}

                {carouselItems.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-white/80">Carrusel multimedia</p>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#0b1220] via-[#0b1220]/70 to-transparent pointer-events-none" />
                      <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0b1220] via-[#0b1220]/70 to-transparent pointer-events-none" />
                      <div className="flex gap-3 overflow-x-auto pb-3 pr-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {carouselItems.map((item, index) => (
                          <div
                            key={`${item.title}-${index}`}
                            className="snap-start min-w-[230px] max-w-[260px] rounded-xl border border-white/15 bg-white/90 p-3 text-[#0f172a] shadow-[0_12px_30px_rgba(15,23,42,0.15)]"
                          >
                            <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: template.accent }}>
                              {item.title}
                            </p>
                            {item.mediaUrl && (
                              <div className="mt-2 overflow-hidden rounded-lg border border-[#e6e8ef] bg-black/5">
                                {item.mediaUrl.match(/\.mp4|\.mov|\.webm/i) ? (
                                  <video src={item.mediaUrl} controls className="h-36 w-full object-cover" />
                                ) : (
                                  <img src={item.mediaUrl} alt="Vista previa" className="h-36 w-full object-cover" />
                                )}
                              </div>
                            )}
                            {item.content && <p className="mt-2 text-xs text-[#0f172a]">{item.content}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <p className="text-[12px] uppercase tracking-[0.14em] text-white/70">
              Vista previa editable; cambia datos y mira el resultado al instante.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[22px] border border-[#e6e8ef] bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[12px] uppercase tracking-[0.14em] text-[#e87422]">Primer recuerdo</p>
            <p className="text-sm text-[#475569]">Acompaña el obituario con un recuerdo visual.</p>
          </div>
          <span className="rounded-full border border-[#e6e8ef] bg-[#f8fafc] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0f172a]">
            Opcional
          </span>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <label className="block text-sm font-semibold text-[#0f172a]">
            Título
            <input
              type="text"
              value={draftMemory.title}
              onChange={(event) => setDraftMemory((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Carta, foto, video…"
              className="mt-2 w-full rounded-xl border border-[#e6e8ef] bg-[#f8fafc] px-4 py-3 text-sm text-[#0f172a] shadow-[0_10px_26px_rgba(15,23,42,0.05)] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/20"
            />
          </label>
          <label className="block text-sm font-semibold text-[#0f172a]">
            URL de imagen o video
            <input
              type="url"
              value={draftMemory.mediaUrl}
              onChange={(event) => setDraftMemory((prev) => ({ ...prev, mediaUrl: event.target.value }))}
              placeholder="https://..."
              className="mt-2 w-full rounded-xl border border-[#e6e8ef] bg-[#f8fafc] px-4 py-3 text-sm text-[#0f172a] shadow-[0_10px_26px_rgba(15,23,42,0.05)] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/20"
            />
          </label>
        </div>
        <label className="mt-3 block text-sm font-semibold text-[#0f172a]">
          Texto del recuerdo
          <textarea
            value={draftMemory.content}
            onChange={(event) => setDraftMemory((prev) => ({ ...prev, content: event.target.value }))}
            rows={3}
            placeholder="Palabras que acompañan el material."
            className="mt-2 w-full rounded-xl border border-[#e6e8ef] bg-[#f8fafc] px-4 py-3 text-sm text-[#0f172a] shadow-[0_10px_26px_rgba(15,23,42,0.05)] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/20"
          />
        </label>
      </div>

      <div className="rounded-[22px] border border-[#e6e8ef] bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[12px] uppercase tracking-[0.14em] text-[#e87422]">Mantenedor multimedia</p>
            <p className="text-sm text-[#475569]">Prepara el carrusel: cada item entra a la vista previa.</p>
          </div>
          <button
            type="button"
            onClick={addGalleryItem}
            className="rounded-full border border-[#e87422] bg-[#e87422] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_12px_32px_rgba(232,116,34,0.35)] transition hover:-translate-y-[1px]"
          >
            Añadir
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {gallery.length === 0 && (
            <p className="rounded-xl border border-dashed border-[#e6e8ef] bg-[#f8fafc] px-4 py-3 text-sm text-[#475569]">
              Aún no hay elementos en la galería. Pega URLs de fotos, cartas o videos (próximo: subida directa).
            </p>
          )}
          {gallery.map((item, index) => (
            <div
              key={index}
              className="space-y-2 rounded-2xl border border-[#e6e8ef] bg-gradient-to-br from-white via-[#fbfcff] to-[#f6f8fb] p-3 shadow-[0_12px_32px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-[12px] uppercase tracking-[0.14em] text-[#e87422]">Secuencia {index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeGalleryItem(index)}
                  className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#b3261e]"
                >
                  Quitar
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="block text-sm font-semibold text-[#0f172a]">
                  Título
                  <input
                    type="text"
                    value={item.title}
                    onChange={(event) => updateGalleryItem(index, "title", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#e6e8ef] bg-[#f8fafc] px-3 py-2.5 text-sm text-[#0f172a] shadow-[0_10px_26px_rgba(15,23,42,0.05)] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/20"
                  />
                </label>
                <label className="block text-sm font-semibold text-[#0f172a]">
                  URL imagen o video
                  <input
                    type="url"
                    value={item.mediaUrl}
                    onChange={(event) => updateGalleryItem(index, "mediaUrl", event.target.value)}
                    placeholder="https://..."
                    className="mt-1 w-full rounded-xl border border-[#e6e8ef] bg-[#f8fafc] px-3 py-2.5 text-sm text-[#0f172a] shadow-[0_10px_26px_rgba(15,23,42,0.05)] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/20"
                  />
                </label>
              </div>
              <label className="block text-sm font-semibold text-[#0f172a]">
                Texto / pie
                <textarea
                  value={item.content}
                  onChange={(event) => updateGalleryItem(index, "content", event.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-[#e6e8ef] bg-[#f8fafc] px-3 py-2.5 text-sm text-[#0f172a] shadow-[0_10px_26px_rgba(15,23,42,0.05)] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/20"
                />
              </label>
              {item.mediaUrl && (
                <div className="overflow-hidden rounded-lg border border-[#e6e8ef] bg-black/5">
                  {item.mediaUrl.match(/\.mp4|\.mov|\.webm/i) ? (
                    <video src={item.mediaUrl} controls className="h-48 w-full object-cover" />
                  ) : (
                    <img src={item.mediaUrl} alt="Vista previa galería" className="h-48 w-full object-cover" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div
        id="publicar"
        className="relative overflow-hidden rounded-[24px] border border-[#0f172a] bg-gradient-to-r from-[#0f172a] via-[#182b45] to-[#0f172a] p-5 text-white shadow-[0_22px_70px_rgba(15,23,42,0.35)]"
      >
        <div className="pointer-events-none absolute inset-0 opacity-90 [background:radial-gradient(circle_at_20%_10%,rgba(232,116,34,0.24),transparent_36%),radial-gradient(circle_at_80%_-10%,rgba(41,181,165,0.18),transparent_36%)]" />
        <div className="relative space-y-3">
          {error && <p className="text-xs text-[#ffb1a8]">{error}</p>}
          {success && <p className="text-xs text-[#b3ffcc]">{success}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#0f172a] shadow-[0_18px_45px_rgba(0,0,0,0.25)] transition hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creando…" : "Publicar memorial"}
          </button>
          <p className="text-[12px] uppercase tracking-[0.14em] text-white/75">
            Revisa datos y tono antes de publicar.
          </p>
        </div>
      </div>
    </form>
  );
}
