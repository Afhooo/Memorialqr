"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateDemoMemorialButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/demo-memorial", { method: "POST" });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "No fue posible crear el memorial demo");
      }

      const memorialId = payload.memorialId as string | undefined;
      if (!memorialId) {
        throw new Error("Respuesta inválida del servidor");
      }

      router.replace(`/memorial/${memorialId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "No fue posible crear el memorial demo";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleCreate}
        disabled={loading}
        className="rounded-full bg-[#e87422] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-white shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition hover:translate-y-[-2px] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Creando…" : "Crear memorial"}
      </button>
      {error && <p className="text-xs text-[#b3261e]">{error}</p>}
    </div>
  );
}
