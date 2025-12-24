"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { IconFacebook, IconInstagram, IconX } from "./Icons";

function nonEmpty(value: string | null | undefined) {
  const trimmed = (value ?? "").trim();
  return trimmed ? trimmed : null;
}

export function SocialLinksEditor({
  memorialId,
  memorialName,
  facebookUrl,
  instagramUrl,
  canEdit,
}: {
  memorialId: string;
  memorialName: string;
  facebookUrl: string | null;
  instagramUrl: string | null;
  canEdit: boolean;
}) {
  const router = useRouter();
  const hasLinks = Boolean(nonEmpty(facebookUrl) || nonEmpty(instagramUrl));
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fb, setFb] = useState(facebookUrl ?? "");
  const [ig, setIg] = useState(instagramUrl ?? "");

  useEffect(() => {
    setFb(facebookUrl ?? "");
    setIg(instagramUrl ?? "");
  }, [facebookUrl, instagramUrl]);

  const links = useMemo(
    () => [
      facebookUrl
        ? {
            key: "facebook",
            href: facebookUrl,
            label: `Ver a ${memorialName} en Facebook`,
            icon: IconFacebook,
          }
        : null,
      instagramUrl
        ? {
            key: "instagram",
            href: instagramUrl,
            label: `Ver a ${memorialName} en Instagram`,
            icon: IconInstagram,
          }
        : null,
    ].filter(Boolean) as Array<{ key: string; href: string; label: string; icon: typeof IconFacebook }>,
    [facebookUrl, instagramUrl, memorialName],
  );

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/memorials/${memorialId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facebookUrl: nonEmpty(fb),
          instagramUrl: nonEmpty(ig),
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "No pudimos guardar las redes");
      }
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos guardar las redes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {links.length > 0 && (
        <>
          <span className="text-[11px] uppercase tracking-[0.26em] text-white/70">Redes</span>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.key}
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/90 transition hover:bg-white/15"
                title={link.label}
                aria-label={link.label}
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </>
      )}

      {canEdit && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="ml-1 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 transition hover:bg-white/15"
        >
          {hasLinks ? "Editar redes" : "Agregar redes"}
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur" onMouseDown={() => setOpen(false)}>
          <div
            className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b1224]/95 text-white shadow-[0_40px_140px_rgba(0,0,0,0.55)]"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.26em] text-white/70">Redes del perfil</p>
                <p className="text-sm font-semibold">Enlaces (opcional)</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90"
              >
                <IconX className="h-4 w-4" />
                Cerrar
              </button>
            </div>

            <div className="space-y-3 px-4 py-4">
              <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                Facebook
                <input
                  value={fb}
                  onChange={(e) => setFb(e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30"
                />
              </label>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                Instagram
                <input
                  value={ig}
                  onChange={(e) => setIg(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30"
                />
              </label>

              {error && <p className="text-sm text-[#fecaca]">{error}</p>}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <p className="text-xs text-white/70">Se muestran como íconos en la portada del memorial.</p>
                <button
                  type="button"
                  onClick={save}
                  disabled={saving}
                  className="rounded-full bg-white px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0b1224] shadow-[0_18px_50px_rgba(0,0,0,0.25)] disabled:opacity-70"
                >
                  {saving ? "Guardando…" : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
