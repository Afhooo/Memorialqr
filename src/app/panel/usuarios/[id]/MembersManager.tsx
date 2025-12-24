"use client";

import { useMemo, useState } from "react";

type Member = {
  id: string;
  userId: string;
  email: string;
  createdAt: string | null;
};

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("es-CL", { year: "numeric", month: "short", day: "2-digit" });
}

export function MembersManager(props: { memorialId: string; initialMembers: Member[] }) {
  const { memorialId, initialMembers } = props;
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const sorted = useMemo(() => members.slice(), [members]);

  const handleAdd = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setTempPassword(null);

    try {
      const res = await fetch(`/api/memorials/${memorialId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload.error || "No fue posible agregar el usuario");
      }

      const createdPassword = typeof payload.tempPassword === "string" ? payload.tempPassword : null;
      if (createdPassword) setTempPassword(createdPassword);

      const listRes = await fetch(`/api/memorials/${memorialId}/members`, { cache: "no-store" });
      const listPayload = await listRes.json().catch(() => ({}));
      if (listRes.ok && Array.isArray(listPayload.members)) {
        setMembers(listPayload.members as Member[]);
      }

      setEmail("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No fue posible agregar el usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId: string) => {
    setLoading(true);
    setError(null);
    setTempPassword(null);
    try {
      const res = await fetch(`/api/memorials/${memorialId}/members`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload.error || "No fue posible quitar el usuario");
      }
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "No fue posible quitar el usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[#e5e7eb] bg-white/95 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#e87422]">Agregar usuario</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none focus:border-[#e87422]"
            disabled={loading}
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={loading || !email.trim()}
            className="rounded-2xl bg-[#e87422] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white disabled:opacity-60"
          >
            {loading ? "Guardando…" : "Agregar"}
          </button>
        </div>

        {tempPassword && (
          <div className="mt-4 rounded-2xl border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-sm text-[#92400e]">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#b45309]">Cuenta creada</p>
            <p className="mt-1">
              Contraseña temporal: <span className="font-semibold">{tempPassword}</span>
            </p>
          </div>
        )}
        {error && <p className="mt-3 text-sm text-[#b91c1c]">{error}</p>}
      </section>

      <section className="rounded-3xl border border-[#e5e7eb] bg-white/95 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#e87422]">Usuarios con acceso</p>
            <h2 className="mt-1 text-xl font-semibold text-[#0f172a]">{sorted.length}</h2>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-[#e5e7eb]">
          <div className="grid grid-cols-[1.4fr_0.7fr_0.6fr] gap-2 bg-[#f8fafc] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#475569]">
            <span>Email</span>
            <span>Agregado</span>
            <span className="text-right">Acciones</span>
          </div>
          <div className="divide-y divide-[#e5e7eb] bg-white">
            {sorted.map((m) => (
              <div key={m.id} className="grid grid-cols-[1.4fr_0.7fr_0.6fr] gap-2 px-4 py-3 text-sm text-[#0f172a]">
                <span className="truncate font-semibold">{m.email}</span>
                <span className="text-xs text-[#64748b]">{formatDate(m.createdAt)}</span>
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => handleRemove(m.userId)}
                    disabled={loading}
                    className="rounded-full border border-[#e5e7eb] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0f172a] transition hover:bg-[#f8fafc] disabled:opacity-60"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}
            {sorted.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-[#6b7280]">Aún no hay usuarios agregados.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

