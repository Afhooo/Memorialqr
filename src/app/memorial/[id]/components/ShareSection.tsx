"use client";

import { useState } from "react";

export function ShareSection() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("No pudimos copiar el enlace", err);
    }
  };

  return (
    <div
      id="compartir"
      className="pointer-events-none fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6"
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="pointer-events-auto flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0f172a] to-[#0b1230] px-4 py-2 text-[12px] font-semibold text-white shadow-[0_18px_50px_rgba(0,0,0,0.28)] transition hover:-translate-y-[2px]"
      >
        <span className="text-base">{open ? "✖️" : "📡"}</span>
        <span>{open ? "Cerrar panel" : "Compartir"}</span>
      </button>

      <div
        className={`pointer-events-auto transition-all duration-200 ${
          open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0 pointer-events-none"
        }`}
      >
        <div className="w-[320px] rounded-3xl border border-white/10 bg-[#0b1224]/90 p-5 text-white shadow-[0_24px_90px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#67e8f9]">Panel rápido</p>
              <p className="text-sm text-white/80">Comparte como si fuera un post privado.</p>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/80">Live</span>
          </div>
          <div className="mt-4 grid gap-2">
            <button
              type="button"
              onClick={copyLink}
              className="flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-2 text-left text-sm transition hover:bg-white/15"
            >
              <span>🔗</span>
              <span>Copiar enlace íntimo</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-2 text-left text-sm transition hover:bg-white/15"
            >
              <span>📱</span>
              <span>Enviar por chat</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-2 text-left text-sm transition hover:bg-white/15"
            >
              <span>🖨️</span>
              <span>QR listo para imprimir</span>
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.24em] text-white/70">
            <span className="rounded-full bg-white/10 px-3 py-1">Moderación</span>
            <span className="rounded-full bg-white/10 px-3 py-1">Link íntimo</span>
            <span className="rounded-full bg-white/10 px-3 py-1">Chat</span>
          </div>
          {copied && <p className="mt-2 text-xs text-[#67e8f9]">Enlace copiado.</p>}
        </div>
      </div>
    </div>
  );
}
