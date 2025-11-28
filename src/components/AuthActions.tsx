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
      <div className="flex items-center gap-3 text-xs text-white/80">
        <span className="whitespace-nowrap">{userEmail}</span>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className="rounded-full border border-white/30 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white transition hover:border-white/60"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:border-white/60"
    >
      Iniciar sesión
    </Link>
  );
}
