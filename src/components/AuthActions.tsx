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
      <div className="flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-widest font-semibold text-slate-500">
        <span className="text-slate-800 hidden md:inline-block">{userEmail}</span>
        {isAdmin && <span className="rounded-md bg-amber-50 border border-amber-200/50 text-amber-600 px-2 py-1 text-[9px]">ADMIN</span>}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className="transition hover:text-red-600 disabled:opacity-50"
        >
          {loading ? "Saliendo…" : "Cerrar sesión"}
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="rounded-lg bg-slate-900 px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-white transition hover:bg-slate-800 shadow-sm"
    >
      <span>Iniciar sesión</span>
    </Link>
  );
}
