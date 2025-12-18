"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type Item = { href: string; label: string; description: string };

const ITEMS: Item[] = [
  { href: "/admin", label: "Dashboard", description: "KPIs, ventas, activación" },
  { href: "/admin/usuarios", label: "Usuarios", description: "Clientes y staff" },
  { href: "/panel", label: "Panel Cliente", description: "Vista owner (mis memoriales)" },
  { href: "/crear-memorial", label: "Crear Memorial", description: "Flujo RRSS (owner/admin)" },
];

export function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/session", { method: "DELETE" });
    router.replace("/login");
  };

  return (
    <aside className="hidden w-[280px] shrink-0 flex-col gap-4 rounded-[28px] border border-[#e5e7eb] bg-white/95 p-4 shadow-[0_22px_65px_rgba(0,0,0,0.06)] lg:flex">
      <div className="rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#111827] p-4 text-white shadow-[0_18px_60px_rgba(15,23,42,0.45)]">
        <p className="text-[10px] uppercase tracking-[0.32em] text-white/70">Empresa</p>
        <p className="mt-2 text-lg font-semibold leading-tight">Panel comercial</p>
        <p className="mt-1 text-xs text-white/70">{userEmail}</p>
      </div>

      <nav className="space-y-2">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group block rounded-2xl border px-4 py-3 transition ${
                active
                  ? "border-[#0ea5e9]/60 bg-[#eff6ff] shadow-[0_12px_30px_rgba(14,165,233,0.10)]"
                  : "border-[#e5e7eb] bg-white hover:-translate-y-[1px] hover:border-[#0ea5e9]/40 hover:bg-[#f8fafc]"
              }`}
            >
              <p className="text-sm font-semibold text-[#0f172a]">{item.label}</p>
              <p className="mt-1 text-xs text-[#64748b]">{item.description}</p>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2">
        <div className="rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] px-4 py-3 text-xs text-[#475569]">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#0ea5e9]">Nota</p>
          <p className="mt-1">Admin puede operar como empresa y también crear/editar memoriales como owner.</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          className="w-full rounded-2xl bg-[#0f172a] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-white shadow-[0_16px_44px_rgba(15,23,42,0.22)] transition hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Saliendo…" : "Cerrar sesión"}
        </button>
      </div>
    </aside>
  );
}

