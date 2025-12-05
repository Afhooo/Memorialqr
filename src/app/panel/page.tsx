import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";
import { MemorialCreatorForm } from "./MemorialCreatorForm";
import { SidebarNav } from "@/components/SidebarNav";

type MemorialRecord = {
  id: string;
  name: string;
  description: string | null;
  birth_date: string | null;
  death_date: string | null;
  created_at?: string | null;
};

export default async function OwnerPanelPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?from=/panel");
  }

  const supabase = createSupabaseServerClient();

  const { data: memorials } = await supabase
    .from("memorials")
    .select("id, name, description, birth_date, death_date")
    .eq("owner_id", session.user.id)
    .order("name", { ascending: true });

  const safeMemorials = memorials ?? [];

  const memorialIds = safeMemorials.map((memorial) => memorial.id);
  let totalMemories = 0;

  if (memorialIds.length) {
    const { count } = await supabase
      .from("memories")
      .select("id", { count: "exact", head: true })
      .in("memorial_id", memorialIds);
    totalMemories = count ?? 0;
  }

  const lastCreatedLabel = "—";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 py-6 text-[#333333] lg:flex-row">
      <aside className="sticky top-4 flex w-full flex-col gap-3 rounded-[18px] border border-[#e0e0e0] bg-white/95 px-5 py-5 shadow-[0_14px_40px_rgba(0,0,0,0.08)] lg:w-64 lg:self-start">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Recuerdame</p>
          <h2 className="text-lg font-serif text-[#333333]">Panel del dueño</h2>
        </div>
        <SidebarNav
          items={[
            { label: "Resumen", targetId: "resumen" },
            { label: "Memoriales", targetId: "memoriales" },
            { label: "Crear nuevo", targetId: "crear-memorial" },
          ]}
        />
        <div className="rounded-lg border border-[#e0e0e0] bg-[#fdf7f2] px-3 py-2 text-[12px] text-[#e87422]">
          Sesión: {session.user.email}
        </div>
      </aside>

      <div className="flex-1 space-y-8">
        <div id="resumen" className="rounded-[22px] border border-[#e0e0e0] bg-gradient-to-br from-white via-[#f7f7f7] to-[#eef2ef] px-5 py-6 shadow-[0_22px_65px_rgba(0,0,0,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Resumen</p>
              <h1 className="text-2xl font-serif text-[#333333]">Controla tus memoriales</h1>
              <p className="text-sm text-[#4a4a4a]">
                Crea, abre y revisa tus espacios privados. Todo queda bajo tu sesión como dueño.
              </p>
            </div>
            <Link
              href={safeMemorials[0] ? `/memorial/${safeMemorials[0].id}` : "/memorial/pablo-neruda"}
              className="rounded-full bg-[#e87422] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-white shadow-[0_14px_35px_rgba(0,0,0,0.2)] transition hover:translate-y-[-1px]"
            >
              Ir a mi memorial
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#e0e0e0] bg-white/90 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Memoriales creados</p>
              <p className="text-3xl font-serif">{safeMemorials.length}</p>
              <p className="text-xs text-[#555555]">Activos en tu cuenta</p>
            </div>
            <div className="rounded-2xl border border-[#e0e0e0] bg-white/90 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Recuerdos publicados</p>
              <p className="text-3xl font-serif">{totalMemories}</p>
              <p className="text-xs text-[#555555]">Mensajes dentro de tus memoriales</p>
            </div>
            <div className="rounded-2xl border border-[#e0e0e0] bg-white/90 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Última creación</p>
              <p className="text-xl font-serif">{lastCreatedLabel}</p>
              <p className="text-xs text-[#555555]">Fecha en que abriste el último memorial</p>
            </div>
          </div>
        </div>

        <section id="memoriales" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Tus espacios</p>
              <h2 className="text-xl font-serif text-[#333333]">Memoriales activos</h2>
            </div>
            <Link
              href="#crear-memorial"
              className="text-[11px] uppercase tracking-[0.28em] text-[#e87422] underline decoration-[#e87422]/60"
            >
              Crear memorial
            </Link>
          </div>
          {safeMemorials.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#e0e0e0] bg-white/80 p-6 text-center text-sm text-[#555555]">
              Aún no tienes memoriales creados. Completa el formulario de abajo para abrir el primero.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {safeMemorials.map((memorial: MemorialRecord) => (
                <div
                  key={memorial.id}
                  className="flex flex-col gap-3 rounded-2xl border border-[#e0e0e0] bg-white/90 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-[#e87422]">Memorial</p>
                      <h3 className="truncate text-lg font-serif text-[#333333]">{memorial.name}</h3>
                    </div>
                    <Link
                      href={`/memorial/${memorial.id}`}
                      className="rounded-full border border-[#e87422] px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-[#e87422] transition hover:bg-[#e87422] hover:text-white"
                    >
                      Abrir
                    </Link>
                  </div>
                  <p className="text-sm text-[#4a4a4a] line-clamp-3">{memorial.description || "Sin descripción"}</p>
                  <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.22em] text-[#555555]">
                    <span className="rounded-full border border-[#e0e0e0] bg-white/80 px-3 py-1">
                      {memorial.birth_date || "Sin fecha de nacimiento"}
                    </span>
                    <span className="rounded-full border border-[#e0e0e0] bg-white/80 px-3 py-1">
                      {memorial.death_date || "Sin fecha de fallecimiento"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section
          id="crear-memorial"
          className="space-y-3 rounded-[22px] border border-[#e0e0e0] bg-white/95 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.07)]"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Nuevo memorial</p>
            <h2 className="text-xl font-serif text-[#333333]">Crear un perfil completo</h2>
            <p className="text-sm text-[#555555]">
              Añade datos biográficos, una descripción y el primer recuerdo con imagen o video opcional.
            </p>
          </div>
          <MemorialCreatorForm />
        </section>
      </div>
    </div>
  );
}
