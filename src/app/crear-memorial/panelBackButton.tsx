"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export function PanelBackButton() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = useCallback(() => {
    if (isNavigating) return;
    setIsNavigating(true);
    try {
      router.push("/panel");
    } catch (error) {
      // Fallback duro si algo falla con el router.
      window.location.href = "/panel";
    } finally {
      // No bloqueamos el botón; en la práctica el cambio de ruta corta el estado.
      setIsNavigating(false);
    }
  }, [isNavigating, router]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isNavigating}
      className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white transition hover:border-[#e87422] hover:text-[#e87422] disabled:opacity-60"
    >
      Volver al panel
    </button>
  );
}
