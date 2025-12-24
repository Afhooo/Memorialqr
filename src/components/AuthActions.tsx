"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logoutClient } from "@/lib/logoutClient";

interface AuthActionsProps {
  userEmail: string | null;
  userRole?: string | null;
}

export function AuthActions({ userEmail, userRole }: AuthActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isAdmin = userRole === "admin";
  const hasSession = Boolean(userEmail);

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    await logoutClient(router);
    setLoading(false);
  };

  if (hasSession) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/80">
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white/90">
          {isAdmin ? "Admin" : "Dueño"}
        </span>
        <span className="whitespace-nowrap text-white/80">{userEmail}</span>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className="rounded-full border border-white/25 bg-white/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-white transition hover:border-[#e87422] hover:bg-[#e87422] disabled:opacity-60"
        >
          {loading ? "Saliendo…" : "Cerrar sesión"}
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
