"use client";

import { useState } from "react";

export function AdminUserCreator() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ email: string; password: string; role: string } | null>(null);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    setCreated(null);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "No se pudo crear el usuario");
      }
      setCreated(payload);
      setEmail("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo crear el usuario";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 rounded-[18px] border border-[#e0e0e0] bg-white/95 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#e87422]">Altas</p>
          <h3 className="text-lg font-serif text-[#333333]">Crear usuario</h3>
        </div>
        <span className="rounded-full border border-[#e0e0e0] bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#555555]">
          Admin
        </span>
      </div>
      <form className="space-y-3" onSubmit={handleCreate}>
        <label className="block text-xs uppercase tracking-[0.26em] text-[#555555]">
          Correo
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="usuario@cliente.com"
            className="mt-2 w-full rounded-2xl border border-[#e0e0e0] bg-white px-4 py-3 text-sm text-[#333333] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/30"
          />
        </label>
        <label className="block text-xs uppercase tracking-[0.26em] text-[#555555]">
          Rol
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-[#e0e0e0] bg-white px-4 py-3 text-sm text-[#333333] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/30"
          >
            <option value="admin">Administrador</option>
            <option value="owner">Propietario</option>
          </select>
        </label>
        {error && <p className="text-xs text-[#b3261e]">{error}</p>}
        {created && (
          <div className="rounded-xl border border-[#e87422] bg-[#fdf7f2] px-3 py-2 text-xs text-[#333333]">
            <p className="text-[10px] uppercase tracking-[0.26em] text-[#e87422]">Usuario creado</p>
            <p>
              Email: <strong>{created.email}</strong>
            </p>
            <p>
              Contraseña: <strong>{created.password}</strong>
            </p>
            <p>Compártela con el cliente; podrá iniciar sesión y crear memoriales.</p>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[#e87422] px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[0_14px_35px_rgba(0,0,0,0.2)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Creando…" : "Crear usuario"}
        </button>
      </form>
    </div>
  );
}
