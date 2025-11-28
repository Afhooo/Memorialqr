"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signinError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signinError || !data?.session) {
      setError(signinError?.message ?? "No fue posible iniciar sesión");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in,
        userId: data.session.user?.id,
      }),
    });

    if (!response.ok) {
      const body = await response.json();
      setError(body?.error ?? "No fue posible guardar la sesión");
      setLoading(false);
      return;
    }

    router.replace("/");
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-black/30">
      <p className="text-xs uppercase tracking-[0.4em] text-white/60">Memorial digital</p>
      <h1 className="mt-4 text-3xl font-semibold text-white">Inicia sesión</h1>
      <p className="mt-2 text-sm text-white/70">
        Usa el correo y la contraseña que registraste en Supabase para acceder a tus memoriales.
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="text-xs uppercase tracking-[0.3em] text-white/60">
          Correo electrónico
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/20 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-white"
          />
        </label>
        <label className="text-xs uppercase tracking-[0.3em] text-white/60">
          Contraseña
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/20 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-white"
          />
        </label>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-white/20 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white/40"
        >
          {loading ? "Validando…" : "Continuar"}
        </button>
      </form>
    </div>
  );
}
