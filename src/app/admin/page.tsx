import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";
import { SidebarNav } from "@/components/SidebarNav";

type MemorialRecord = {
  id: string;
  name: string;
  owner_id: string;
  created_at?: string | null;
};

type MemoryRecord = {
  id: string;
  memorial_id: string;
  created_at?: string | null;
};

type AdminUserRecord = {
  id: string;
  email: string;
  role: string;
  created_at?: string | null;
};

const badgeBase =
  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.22em]";

function AdminSidebar({ email }: { email: string }) {
  return (
    <aside className="sticky top-4 flex w-full flex-col gap-3 rounded-[18px] border border-[#e0e0e0] bg-white/95 px-5 py-5 shadow-[0_14px_40px_rgba(0,0,0,0.08)] lg:w-64 lg:self-start">
      <div>
        <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Recuerdame</p>
        <h2 className="text-lg font-serif text-[#333333]">Panel admin</h2>
      </div>
      <SidebarNav
        items={[
          { label: "Tablero", targetId: "kpis" },
          { label: "Clientes", targetId: "clientes" },
          { label: "Actividad", targetId: "actividad" },
        ]}
      />
      <div className="rounded-lg border border-[#e0e0e0] bg-[#fdf7f2] px-3 py-2 text-[12px] text-[#e87422]">
        Sesión: {email}
      </div>
    </aside>
  );
}

export default async function AdminPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?from=/admin");
  }

  const supabase = createSupabaseServerClient();

  const [
    { data: memorialsData, error: memorialsError },
    { data: memoriesData, error: memoriesError },
    { data: usersData, error: usersError },
  ] = await Promise.all([
    supabase
      .from("memorials")
      .select("id, name, owner_id")
      .order("name", { ascending: true }),
    supabase.from("memories").select("id, memorial_id, created_at").order("created_at", { ascending: false }),
    supabase.from("admin_users").select("id, email, role, created_at").order("created_at", { ascending: false }),
  ]);

  if (memorialsError || memoriesError || usersError) {
    throw new Error(memorialsError?.message || memoriesError?.message || usersError?.message || "Error al cargar datos");
  }

  const memorials = memorialsData ?? [];
  const memories = memoriesData ?? [];
  const users = usersData ?? [];

  const totalMemorials = memorials.length;
  const totalMemories = memories.length;
  const owners = new Set(memorials.map((memorial) => memorial.owner_id));
  const totalOwners = owners.size;
  const activeMemorials = memorials.length;

  const ownerLookup = new Map(users.map((user) => [user.id, user.email]));
  const memorialsByOwner = memorials.reduce<Record<string, MemorialRecord[]>>((acc, memorial) => {
    acc[memorial.owner_id] = acc[memorial.owner_id] || [];
    acc[memorial.owner_id].push(memorial);
    return acc;
  }, {});

  const memoriesByMemorial = memories.reduce<Record<string, MemoryRecord[]>>((acc, memory) => {
    acc[memory.memorial_id] = acc[memory.memorial_id] || [];
    acc[memory.memorial_id].push(memory);
    return acc;
  }, {});

  const recentMemorials = memorials.slice(0, 6);
  const maxMemoriesPerMemorial = Math.max(
    1,
    ...recentMemorials.map((memorial) => (memoriesByMemorial[memorial.id] || []).length),
  );

  const planLabel = (user: AdminUserRecord) => {
    if (user.role === "admin") return "Staff";
    return "Cliente demo";
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 py-6 text-[#333333] lg:flex-row">
      <AdminSidebar email={session.user.email} />

      <div className="flex-1 space-y-8">
        <div
          id="kpis"
          className="rounded-[22px] border border-[#e0e0e0] bg-gradient-to-br from-white via-[#f7f7f7] to-[#eef2ef] px-5 py-6 shadow-[0_22px_65px_rgba(0,0,0,0.08)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Panel administrador</p>
              <h1 className="text-2xl font-serif text-[#333333]">Salud de la plataforma</h1>
              <p className="text-sm text-[#4a4a4a]">
                Vista ejecutiva tipo CRM: actividad, clientes y memoriales en tiempo real.
              </p>
            </div>
            <Link
              href="/panel"
              className="rounded-full border border-[#e87422] px-4 py-2 text-[10px] uppercase tracking-[0.26em] text-[#e87422] transition hover:bg-[#e87422] hover:text-white"
            >
              Ver panel de dueño
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            {[
              { label: "Memoriales", value: totalMemorials },
              { label: "Recuerdos", value: totalMemories },
              { label: "Clientes únicos", value: totalOwners },
              { label: "Activos 30d", value: activeMemorials },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-[#e0e0e0] bg-white/90 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.06)]"
              >
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#e87422]">{item.label}</p>
                <p className="text-3xl font-serif">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-[#e0e0e0] bg-white/90 p-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#e87422]">SLA</p>
              <p className="text-xl font-serif">99.9%</p>
              <p className="text-xs text-[#555555]">Disponibilidad objetivo (placeholder demo)</p>
            </div>
            <div className="rounded-2xl border border-[#e0e0e0] bg-white/90 p-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#e87422]">Conversiones</p>
              <p className="text-xl font-serif">—</p>
              <p className="text-xs text-[#555555]">Integra analytics para ver altas pagas</p>
            </div>
            <div className="rounded-2xl border border-[#e0e0e0] bg-white/90 p-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#e87422]">Tickets</p>
              <p className="text-xl font-serif">—</p>
              <p className="text-xs text-[#555555]">Próximamente: soporte y SLA por cliente</p>
            </div>
          </div>
        </div>

        <section
          id="clientes"
          className="rounded-[20px] border border-[#e0e0e0] bg-white/95 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.07)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Clientes y planes</p>
              <h2 className="text-xl font-serif text-[#333333]">Dueños activos</h2>
            </div>
            <span className="rounded-full border border-[#e0e0e0] bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-[#555555]">
              {users.length} usuarios registrados
            </span>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-[#e0e0e0]">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] bg-[#f7f7f7] px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-[#555555] max-md:hidden">
              <span>Cliente</span>
              <span>Memoriales</span>
              <span>Recuerdos</span>
              <span>Plan</span>
            </div>
            <div className="divide-y divide-[#e0e0e0]">
              {users.map((user) => {
                const userMemorials = memorialsByOwner[user.id] || [];
                const memoryCount = userMemorials.reduce(
                  (acc, memorial) => acc + (memoriesByMemorial[memorial.id]?.length || 0),
                  0,
                );
                return (
                  <div
                    key={user.id}
                    className="grid grid-cols-1 gap-2 px-3 py-3 text-sm text-[#333333] max-md:rounded-none md:grid-cols-[1.5fr_1fr_1fr_1fr]"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold">{user.email}</p>
                      <div className="flex flex-wrap gap-1">
                        <span className={`${badgeBase} border-[#e87422] bg-[#e87422]/10 text-[#e87422]`}>
                          {user.role}
                        </span>
                        <span className={`${badgeBase} border-[#e0e0e0] text-[#555555]`}>{planLabel(user)}</span>
                      </div>
                    </div>
                    <div className="text-[13px] text-[#4a4a4a] md:text-center">{userMemorials.length}</div>
                    <div className="text-[13px] text-[#4a4a4a] md:text-center">{memoryCount}</div>
                    <div className="text-[12px] uppercase tracking-[0.18em] text-[#555555] md:text-center">—</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="actividad"
          className="rounded-[20px] border border-[#e0e0e0] bg-white/95 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.07)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Actividad reciente</p>
              <h2 className="text-xl font-serif text-[#333333]">Memoriales y recuerdos</h2>
            </div>
            <span className="rounded-full border border-[#e0e0e0] bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-[#555555]">
              Últimos {recentMemorials.length}
            </span>
          </div>

          {recentMemorials.length === 0 ? (
            <p className="mt-4 text-sm text-[#555555]">Sin datos aún.</p>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {recentMemorials.map((memorial) => {
                const ownerEmail = ownerLookup.get(memorial.owner_id) ?? "Usuario";
                const memoryCount = (memoriesByMemorial[memorial.id] || []).length;
                const barPct = Math.max(6, Math.min(100, Math.round((memoryCount / maxMemoriesPerMemorial) * 100)));
                return (
                  <div
                    key={memorial.id}
                    className="rounded-2xl border border-[#e0e0e0] bg-white/90 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.05)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.28em] text-[#e87422]">Memorial</p>
                        <h3 className="truncate text-lg font-serif text-[#333333]">{memorial.name}</h3>
                        <p className="text-xs uppercase tracking-[0.22em] text-[#555555]">Propietario: {ownerEmail}</p>
                      </div>
                      <Link
                        href={`/memorial/${memorial.id}`}
                        className="rounded-full border border-[#e87422] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#e87422] transition hover:bg-[#e87422] hover:text-white"
                      >
                        Ver
                      </Link>
                    </div>
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-[12px] text-[#555555]">
                        <span>Recuerdos</span>
                        <span>{memoryCount}</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#f2f2f2]">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-[#e87422] to-[#ff9800]"
                          style={{ width: `${barPct}%` }}
                        />
                      </div>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-[#555555]">
                        Creado: {"—"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
