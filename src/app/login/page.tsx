"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body.error ?? "No fue posible iniciar sesión");
      setLoading(false);
      return;
    }

    const redirectTo = searchParams.get("from") || "/memorial/pablo-neruda";
    router.replace(redirectTo);
    router.refresh();
  };

  return (
    <div className="mx-auto mt-10 flex max-w-5xl flex-col gap-8 rounded-[28px] border border-[#e0e0e0] bg-gradient-to-br from-white via-[#f7f7f7] to-[#eef2ef] px-6 py-8 text-[#333333] shadow-[0_26px_80px_rgba(0,0,0,0.08)] sm:px-10 lg:mt-14">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.38em] text-[#e87422]">Tu espacio de memoria</p>
          <h1 className="text-3xl font-serif leading-tight text-[#333333] md:text-4xl">
            Inicia sesión para seguir acompañando
          </h1>
          <p className="text-base leading-relaxed text-[#4a4a4a]">
            Aquí accedes al memorial que estás creando o a los que ya compartiste con tu familia. Sin publicidad y con
            moderación cuidada para que cada palabra acompañe.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#e0e0e0] bg-white/95 px-4 py-3 text-sm text-[#4a4a4a] shadow-[0_14px_40px_rgba(0,0,0,0.04)]">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Para qué sirve</p>
              <p>Entrar a tu memorial, actualizar datos y volver a leer condolencias cuando lo necesites.</p>
            </div>
            <div className="rounded-2xl border border-[#e0e0e0] bg-white/95 px-4 py-3 text-sm text-[#4a4a4a] shadow-[0_14px_40px_rgba(0,0,0,0.04)]">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Si es tu primera vez</p>
              <p>Usa el correo con el que te acompañamos desde la funeraria o en el primer mensaje de Memento.</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md rounded-[22px] border border-[#e0e0e0] bg-white/98 p-6 shadow-[0_22px_65px_rgba(0,0,0,0.08)]">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#e87422]">Acceso a tu cuenta</p>
            <h2 className="text-2xl font-serif text-[#333333]">Entrar al memorial</h2>
          </div>
          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-xs uppercase tracking-[0.26em] text-[#555555]">
              Correo electrónico
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#e0e0e0] bg-white px-4 py-3 text-sm text-[#333333] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/30"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.26em] text-[#555555]">
              Contraseña
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-0 w-full rounded-2xl border border-[#e0e0e0] bg-white px-4 py-3 text-sm text-[#333333] outline-none transition focus:border-[#e87422] focus:ring-2 focus:ring-[#e87422]/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#555555] hover:text-[#333333]"
                >
                  {showPassword ? "Ocultar" : "Ver"}
                </button>
              </div>
            </label>
            {error && <p className="text-xs text-[#b3261e]">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#e87422] px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[0_14px_35px_rgba(0,0,0,0.2)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Ingresando…" : "Entrar a mi espacio"}
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-[#555555]">
            Si no recuerdas tus datos, puedes pedir ayuda desde el contacto de la funeraria o por correo y te acompañamos.
          </p>
        </div>
      </div>
    </div>
  );
}
