import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { getServerSession } from "@/lib/serverSession";

export const metadata: Metadata = {
  title: "Iniciar sesión | Recuerdame",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { from?: string };
}) {
  const session = await getServerSession();

  if (session?.user?.id) {
    const redirectTo = session.user.role === "admin" ? "/admin" : searchParams?.from || "/elige-perfil";
    redirect(redirectTo);
  }

  return (
    <div className="mx-auto mt-10 flex max-w-5xl min-w-0 flex-col gap-8 rounded-[28px] border border-[#e0e0e0] bg-gradient-to-br from-white via-[#f7f7f7] to-[#eef2ef] px-4 py-8 text-[#333333] shadow-[0_26px_80px_rgba(0,0,0,0.08)] sm:px-6 lg:mt-14 lg:px-10">
      <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.38em] text-[#e87422]">Tu espacio de memoria</p>
          <h1 className="text-2xl font-serif leading-tight text-[#333333] md:text-3xl">
            Inicia sesión para seguir acompañando
          </h1>
          <p className="text-sm leading-relaxed text-[#4a4a4a] md:text-base">
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
              <p>Usa el correo con el que te acompañamos desde la funeraria o en el primer mensaje de Recuerdame.</p>
            </div>
          </div>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
