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
  if (session.user.role === "admin") {
    redirect("/admin");
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
    <div className="space-y-8 py-6 lg:py-8">
      <section
        id="resumen"
        className="relative overflow-hidden rounded-[30px] border border-[#121826] bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#111827] px-6 py-8 text-white shadow-[0_26px_80px_rgba(0,0,0,0.35)]"
      >
        <div className="pointer-events-none absolute inset-0 opacity-90 [background:radial-gradient(circle_at_18%_12%,rgba(232,116,34,0.28),transparent_32%),radial-gradient(circle_at_78%_0%,rgba(41,181,165,0.18),transparent_34%),radial-gradient(circle_at_12%_80%,rgba(88,111,255,0.12),transparent_30%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.3fr,1fr] lg:items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[12px] uppercase tracking-[0.22em] text-white/80">
              <span className="h-2 w-2 rounded-full bg-gradient-to-br from-[#e87422] to-[#f0b46d]" />
              Panel del dueño
            </div>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Cuidar los memoriales de quienes ya partieron
            </h1>
            <p className="max-w-2xl text-sm text-white/75 sm:text-base">
              Administra tus espacios, revisa el avance y abre nuevos perfiles con una guía visual paso a paso. Todo queda
              bajo tu sesión segura.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/crear-memorial"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#0f172a] shadow-[0_16px_38px_rgba(255,255,255,0.12)] transition hover:-translate-y-[1px] hover:shadow-[0_24px_50px_rgba(0,0,0,0.35)]"
              >
                Crear memorial
              </Link>
              <Link
                href={safeMemorials[0] ? `/memorial/${safeMemorials[0].id}` : "/crear-memorial"}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-white transition hover:-translate-y-[1px] hover:border-white hover:bg-white/15"
              >
                {safeMemorials[0] ? "Abrir memorial" : "Crear memorial"}
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/70">Memoriales</p>
              <p className="text-3xl font-semibold text-white">{safeMemorials.length}</p>
              <p className="text-xs text-white/70">Activos en tu cuenta</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/70">Recuerdos</p>
              <p className="text-3xl font-semibold text-white">{totalMemories}</p>
              <p className="text-xs text-white/70">Publicados en tus espacios</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur sm:col-span-2 sm:flex sm:items-center sm:justify-between sm:gap-3 sm:p-4 lg:col-span-1">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-white/70">Última creación</p>
                <p className="text-lg font-semibold text-white">{lastCreatedLabel}</p>
              </div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-white/70">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#e87422]" />
                En línea
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
        <aside className="sticky top-6 flex h-fit flex-col gap-4 rounded-[22px] border border-[#e6e8ef] bg-white px-5 py-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)]">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#e87422]">Navegación rápida</p>
            <h2 className="text-lg font-semibold text-[#0f172a]">Tu consola privada</h2>
          </div>
          <SidebarNav
            items={[
              { label: "Resumen", targetId: "resumen" },
              { label: "Memoriales", targetId: "memoriales" },
              { label: "Crear nuevo", targetId: "crear-memorial" },
            ]}
          />
          <div className="rounded-xl border border-[#f0f1f5] bg-gradient-to-r from-[#fff4eb] to-[#f8fbff] px-4 py-3 text-[13px] text-[#0f172a] shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <p className="text-[12px] font-semibold text-[#e87422]">Sesión activa</p>
            <p className="truncate text-sm text-[#334155]">{session.user.email}</p>
            <p className="mt-2 text-xs text-[#475569]">
              Todo lo que publiques quedará vinculado a esta cuenta.
            </p>
          </div>
        </aside>

        <div className="flex-1 space-y-6">
          <section id="memoriales" className="space-y-4 rounded-[22px] border border-[#e6e8ef] bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#e87422]">Tus espacios</p>
                <h2 className="text-xl font-semibold text-[#0f172a]">Memoriales activos</h2>
                <p className="text-sm text-[#475569]">Abre, revisa o edita cada perfil creado.</p>
              </div>
              <Link
                href="/crear-memorial"
                className="rounded-full border border-[#e87422] bg-[#e87422] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_12px_32px_rgba(232,116,34,0.35)] transition hover:-translate-y-[1px]"
              >
                Nuevo memorial
              </Link>
            </div>
            {safeMemorials.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#d4dae5] bg-[#f8fafc] px-4 py-10 text-center text-[#475569]">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#e87422] shadow-[0_10px_26px_rgba(232,116,34,0.14)]">
                  +
                </div>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-[#0f172a]">Sin memoriales aún</p>
                  <p className="text-sm text-[#64748b]">
                    Completa el formulario inferior para abrir tu primer espacio con portada, obituario y recuerdos.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {safeMemorials.map((memorial: MemorialRecord) => (
                  <div
                    key={memorial.id}
                    className="group relative overflow-hidden rounded-2xl border border-[#e6e8ef] bg-gradient-to-br from-white via-[#fbfcff] to-[#f6f8fb] p-4 shadow-[0_16px_46px_rgba(15,23,42,0.08)] transition hover:-translate-y-[2px] hover:border-[#e87422]/60"
                  >
                    <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100 [background:radial-gradient(circle_at_20%_20%,rgba(232,116,34,0.12),transparent_35%)]" />
                    <div className="relative flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-[#e87422]">Memorial</p>
                        <h3 className="text-lg font-semibold text-[#0f172a]">{memorial.name}</h3>
                      </div>
                      <Link
                        href={`/memorial/${memorial.id}`}
                        className="rounded-full border border-[#e87422] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e87422] transition hover:bg-[#e87422] hover:text-white"
                      >
                        Abrir
                      </Link>
                    </div>
                    <p className="relative mt-2 line-clamp-3 text-sm text-[#475569]">
                      {memorial.description || "Sin descripción. Añade contexto para la familia y amigos."}
                    </p>
                    <div className="relative mt-3 flex flex-wrap gap-2 text-[12px] text-[#334155]">
                      <span className="rounded-full border border-[#e6e8ef] bg-white px-3 py-1">
                        {memorial.birth_date || "Sin fecha de nacimiento"}
                      </span>
                      <span className="rounded-full border border-[#e6e8ef] bg-white px-3 py-1">
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
            className="space-y-4 rounded-[24px] border border-[#e6e8ef] bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#e87422]">Nuevo memorial</p>
                <h2 className="text-xl font-semibold text-[#0f172a]">Crear un perfil completo</h2>
                <p className="text-sm text-[#475569]">
                  Añade datos biográficos, un relato editorial y el primer recuerdo con imagen o video opcional.
                </p>
              </div>
              <div className="rounded-xl bg-[#0f172a] px-4 py-3 text-xs text-white shadow-[0_12px_36px_rgba(15,23,42,0.25)]">
                <p className="text-[11px] uppercase tracking-[0.16em] text-white/70">Tip UX</p>
                <p className="text-sm text-white">Guarda o pega URLs limpias; la subida directa llegará pronto.</p>
              </div>
            </div>
            <MemorialCreatorForm />
          </section>
        </div>
      </div>
    </div>
  );
}
