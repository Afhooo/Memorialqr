"use client";

import { useState } from "react";

type CreatedCustomer = {
  user: { id: string; email: string; role: string };
  password: string | null;
  order: { id: string; channel: string; status: string } | null;
};

const CHANNELS = [
  { value: "presencial", label: "Presencial (sucursal/parque)" },
  { value: "contact_center", label: "Contact Center (tel/whatsapp)" },
  { value: "web", label: "Web (landing/ecommerce)" },
  { value: "convenios", label: "Convenios (alianzas)" },
];

export function AdminCustomerCreator() {
  const [email, setEmail] = useState("");
  const [createOrder, setCreateOrder] = useState(true);
  const [channel, setChannel] = useState(CHANNELS[0]?.value ?? "funeraria");
  const [amountCents, setAmountCents] = useState<string>("");
  const [externalRef, setExternalRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedCustomer | null>(null);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    setCreated(null);

    try {
      const parsedAmount = amountCents.trim() ? Number(amountCents.trim()) : null;
      const response = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          role: "owner",
          createOrder,
          channel,
          amountCents: parsedAmount,
          currency: "CLP",
          externalRef: externalRef.trim() || null,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as CreatedCustomer & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || "No se pudo crear el cliente");
      }

      setCreated(payload);
      setEmail("");
      setAmountCents("");
      setExternalRef("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo crear el cliente";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 rounded-[18px] border border-[#e0e0e0] bg-white/95 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#0ea5e9]">Mantenedor</p>
          <h3 className="text-lg font-serif text-[#333333]">Alta de cliente + compra</h3>
        </div>
        <span className="rounded-full border border-[#e0e0e0] bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#555555]">
          Rol: owner
        </span>
      </div>

      <form className="space-y-3" onSubmit={handleCreate}>
        <label className="block text-xs uppercase tracking-[0.26em] text-[#555555]">
          Correo del cliente
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="cliente@correo.com"
            className="mt-2 w-full rounded-2xl border border-[#e0e0e0] bg-white px-4 py-3 text-sm text-[#333333] outline-none transition focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/25"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs uppercase tracking-[0.26em] text-[#555555]">
            Canal de venta
            <select
              value={channel}
              onChange={(event) => setChannel(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-[#e0e0e0] bg-white px-4 py-3 text-sm text-[#333333] outline-none transition focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/25"
              disabled={!createOrder}
            >
              {CHANNELS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs uppercase tracking-[0.26em] text-[#555555]">
            Monto (centavos)
            <input
              type="number"
              inputMode="numeric"
              value={amountCents}
              onChange={(event) => setAmountCents(event.target.value)}
              placeholder="Ej: 19990"
              className="mt-2 w-full rounded-2xl border border-[#e0e0e0] bg-white px-4 py-3 text-sm text-[#333333] outline-none transition focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/25"
              disabled={!createOrder}
            />
          </label>
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-[#e0e0e0] bg-white px-4 py-3 text-sm text-[#333333]">
          <input
            type="checkbox"
            checked={createOrder}
            onChange={(event) => setCreateOrder(event.target.checked)}
            className="h-4 w-4"
          />
          Registrar compra como pagada (sales_orders)
        </label>

        <label className="block text-xs uppercase tracking-[0.26em] text-[#555555]">
          Referencia externa (opcional)
          <input
            type="text"
            value={externalRef}
            onChange={(event) => setExternalRef(event.target.value)}
            placeholder="N° servicio / boleta / convenio"
            className="mt-2 w-full rounded-2xl border border-[#e0e0e0] bg-white px-4 py-3 text-sm text-[#333333] outline-none transition focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/25"
            disabled={!createOrder}
          />
        </label>

        {error && <p className="text-xs text-[#b3261e]">{error}</p>}
        {created && (
          <div className="rounded-xl border border-[#0ea5e9] bg-[#eff6ff] px-3 py-2 text-xs text-[#0f172a]">
            <p className="text-[10px] uppercase tracking-[0.26em] text-[#0ea5e9]">Cliente listo</p>
            <p>
              Email: <strong>{created.user.email}</strong>
            </p>
            {created.password ? (
              <p>
                Contraseña inicial: <strong>{created.password}</strong>
              </p>
            ) : (
              <p className="text-[#475569]">El usuario ya existía (no se regeneró contraseña).</p>
            )}
            {created.order && (
              <p className="text-[#475569]">
                Compra: <strong>{created.order.status}</strong> · canal <strong>{created.order.channel}</strong>
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[#0ea5e9] px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[0_14px_35px_rgba(14,165,233,0.22)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Creando…" : "Crear cliente"}
        </button>
      </form>
    </div>
  );
}
