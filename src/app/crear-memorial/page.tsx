import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/serverSession";
import { MemorialCreatorForm } from "@/app/panel/MemorialCreatorForm";
import { PanelBackButton } from "./panelBackButton";

export default async function CrearMemorialPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?from=/crear-memorial");
  }
  if (session.user.role === "admin") {
    redirect("/admin");
  }

  return (
    <div className="relative mx-auto max-w-[1400px] space-y-8 px-4 py-10 text-[#1f1a15] sm:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70 blur-3xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(232,116,34,0.25),transparent_42%),radial-gradient(circle_at_82%_0%,rgba(41,181,165,0.2),transparent_36%)]" />
      </div>

      <section className="relative overflow-hidden rounded-[34px] border border-white/15 bg-[radial-gradient(circle_at_15%_20%,rgba(232,116,34,0.22),transparent_36%),radial-gradient(circle_at_80%_0%,rgba(41,181,165,0.16),transparent_30%),linear-gradient(135deg,#1f1b17,#0f0d0a)] px-6 py-8 text-white shadow-[0_30px_90px_rgba(0,0,0,0.4)]">
        <div className="absolute left-12 top-10 hidden h-32 w-32 rounded-full bg-white/5 blur-3xl lg:block" />
        <div className="absolute bottom-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="relative flex flex-col gap-6">
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.32em] text-white/70">Crear memorial</p>
            <h1 className="text-3xl font-semibold leading-[1.15]">Un espacio bonito y respetuoso para recordar.</h1>
            <p className="text-sm text-white/80">
              Sube fotos, elige portada y foto principal, y deja unas líneas que acompañen a la familia cuando entren.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Fotos primero", "Portada + foto principal", "Recuerdos iniciales", "Tema"].map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/80"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.22em] text-white/75">
            <PanelBackButton />
          </div>
        </div>
      </section>

      <div className="rounded-[30px] border border-[#e3d8cc] bg-gradient-to-br from-white via-[#fff9f2] to-[#f1e8df] p-1 shadow-[0_22px_70px_rgba(0,0,0,0.08)]">
        <div className="rounded-[28px] bg-white/95 px-3 py-4 sm:px-5 sm:py-6">
          <MemorialCreatorForm />
        </div>
      </div>
    </div>
  );
}
