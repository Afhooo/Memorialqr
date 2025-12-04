"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AuthActionsProps {
  userEmail: string | null;
}

export function AuthActions({ userEmail }: AuthActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/session", { method: "DELETE" });
    router.replace("/login");
  };

  if (userEmail) {
    return (
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/80">
        <span className="whitespace-nowrap">{userEmail}</span>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className="rounded-full border border-white/25 bg-white/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-white transition hover:border-[#e87422] hover:bg-[#e87422] disabled:opacity-60"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition hover:text-[#e87422]"
    >
      <span>Iniciar sesión</span>
      <span className="text-xs">→</span>
    </Link>
  );
}
