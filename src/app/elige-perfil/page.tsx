import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";

type MemorialRecord = {
  id: string;
  name: string;
  description: string | null;
  birth_date: string | null;
  death_date: string | null;
};

export default async function ChooseProfilePage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const supabase = createSupabaseServerClient();
  const { data: memorials = [] } = await supabase
    .from("memorials")
    .select("id, name, description, birth_date, death_date")
    .eq("owner_id", session.user.id)
    .order("name", { ascending: true });

  const isAdmin = session.user.role === "admin";

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 text-[#333333] sm:px-6">
      <div className="flex flex-col gap-4 rounded-[22px] border border-[#e0e0e0] bg-gradient-to-br from-white via-[#f8f8f8] to-[#eef2ef] px-5 py-6 shadow-[0_22px_65px_rgba(0,0,0,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Sesión activa</p>
            <h1 className="text-2xl font-serif">Elige cómo quieres entrar</h1>
          </div>
          <span className="rounded-full border border-[#e0e0e0] bg-white/80 px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-[#555555]">
            {session.user.email}
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-[18px] border border-[#e0e0e0] bg-white/95 p-5 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#e87422]">Modo negocio</p>
            <h3 className="text-xl font-serif text-[#333333]">Entrar como administrador</h3>
            <p className="text-sm text-[#4a4a4a]">
              Gestiona clientes, memoriales y actividad global. Vista estilo CRM para operar la plataforma.
            </p>
            <Link
              href="/admin"
              className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.24em] transition ${
                isAdmin
                  ? "border-[#e87422] text-[#e87422] hover:bg-[#e87422] hover:text-white"
                  : "border-[#e0e0e0] text-[#aaaaaa] cursor-not-allowed"
              }`}
              aria-disabled={!isAdmin}
            >
              {isAdmin ? "Ir al panel admin" : "Requiere rol admin"}
            </Link>
          </div>
          <div className="flex flex-col gap-3 rounded-[18px] border border-[#e0e0e0] bg-white/95 p-5 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#e87422]">Modo cliente</p>
            <h3 className="text-xl font-serif text-[#333333]">Entrar como propietario</h3>
            <p className="text-sm text-[#4a4a4a]">
              Crea y administra tus memoriales, actualiza datos y revisa condolencias como dueño.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/panel"
                className="rounded-full border border-[#e87422] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#e87422] transition hover:bg-[#e87422] hover:text-white"
              >
                Ir a panel de dueño
              </Link>
              <Link
                href="/panel#crear-memorial"
                className="rounded-full border border-[#e0e0e0] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#555555] transition hover:bg-[#f6f6f6]"
              >
                Crear memorial
              </Link>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-[#e0e0e0] bg-white/90 px-4 py-3 text-sm text-[#4a4a4a] shadow-[0_14px_40px_rgba(0,0,0,0.05)]">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#e87422]">Demo</p>
          <p>Elige un perfil propio o abre el demo público para mostrar la experiencia completa.</p>
        </div>
      </div>

    </div>
  );
}
