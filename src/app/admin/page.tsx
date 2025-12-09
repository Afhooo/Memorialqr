import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";
import { SidebarNav } from "@/components/SidebarNav";
import { formatDate } from "@/app/memorial/[id]/components/dateUtils";
import { AdminUserCreator } from "./AdminUserCreator";

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

type ClientStats = {
  user: AdminUserRecord;
  memorials: MemorialRecord[];
  memoryCount: number;
  lastActivity: string | null;
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
          { label: "Servicios", targetId: "servicios" },
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

  if (session.user.role !== "admin") {
    redirect("/elige-perfil");
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
  const avgMemoriesPerMemorial = totalMemorials ? (totalMemories / totalMemorials).toFixed(1) : "0.0";

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

  const clientsWithStats: ClientStats[] = users.map((user) => {
    const userMemorials = memorialsByOwner[user.id] || [];
    const memoryCount = userMemorials.reduce((acc, memorial) => {
      const memorialMemories = memoriesByMemorial[memorial.id] || [];
      return acc + memorialMemories.length;
    }, 0);

    const lastActivity = userMemorials.reduce<string | null>((latest, memorial) => {
      const memorialMemories = memoriesByMemorial[memorial.id] || [];
      if (!memorialMemories.length) {
        return latest;
      }
      const newestForMemorial = memorialMemories[0]?.created_at;
      if (!newestForMemorial) return latest;
      if (!latest) return newestForMemorial;
      return new Date(newestForMemorial) > new Date(latest) ? newestForMemorial : latest;
    }, null);

    return {
      user,
      memorials: userMemorials,
      memoryCount,
      lastActivity,
    };
  });

  const recentMemorials = memorials.slice(0, 6);
  const maxMemoriesPerMemorial = Math.max(
    1,
    ...recentMemorials.map((memorial) => (memoriesByMemorial[memorial.id] || []).length),
  );

  const planLabel = (user: AdminUserRecord) => {
    if (user.role === "admin") return "Staff interno";
    if (user.role === "owner") return "Cliente activo";
    return "Demo";
  };

  const topActiveClients = [...clientsWithStats].sort((a, b) => b.memoryCount - a.memoryCount).slice(0, 5);

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
              <h1 className="text-2xl font-serif text-[#333333]">Cómo se están usando los memoriales</h1>
              <p className="text-sm text-[#4a4a4a]">
                Mira cuántas familias tienen espacios activos, cuántos recuerdos se han publicado y cómo se mueve el servicio día a día.
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
              { label: "Clientes con memorial", value: totalOwners },
              { label: "Recuerdos / memorial", value: avgMemoriesPerMemorial },
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
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#e87422]">Disponibilidad</p>
              <p className="text-xl font-serif">Alta</p>
              <p className="text-xs text-[#555555]">Pensado para estar disponible cuando la familia lo necesite.</p>
            </div>
            <div className="rounded-2xl border border-[#e0e0e0] bg-white/90 p-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#e87422]">Próximos reportes</p>
              <p className="text-xl font-serif">En preparación</p>
              <p className="text-xs text-[#555555]">Más adelante podrás ver cuántos servicios se transforman en memoriales de pago.</p>
            </div>
            <div className="rounded-2xl border border-[#e0e0e0] bg-white/90 p-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#e87422]">Soporte</p>
              <p className="text-xl font-serif">Correo y WhatsApp</p>
              <p className="text-xs text-[#555555]">Aquí luego podrás ver tiempos de respuesta por familia o funeraria.</p>
            </div>
          </div>
        </div>

        <section
          id="clientes"
          className="rounded-[20px] border border-[#e0e0e0] bg-white/95 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.07)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Familias y contactos</p>
              <h2 className="text-xl font-serif text-[#333333]">Quiénes están usando el servicio</h2>
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
              <span>Última actividad</span>
            </div>
            <div className="divide-y divide-[#e0e0e0]">
              {clientsWithStats.map(({ user, memorials: userMemorials, memoryCount, lastActivity }) => (
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
                  <div className="text-[12px] uppercase tracking-[0.18em] text-[#555555] md:text-center">
                    {lastActivity ? formatDate(lastActivity) : "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-[1.4fr_1fr]">
            <div className="rounded-2xl border border-[#e0e0e0] bg-[#f8fafc] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Top actividad</p>
                  <h3 className="text-sm font-semibold text-[#333333]">Clientes con más movimiento</h3>
                </div>
                <span className="rounded-full border border-[#e0e0e0] bg-white px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#555555]">
                  Top {topActiveClients.length}
                </span>
              </div>
              {topActiveClients.length === 0 ? (
                <p className="mt-3 text-xs text-[#555555]">
                  Aún no hay memoriales con recuerdos publicados.
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {topActiveClients.map(({ user, memorials: userMemorials, memoryCount, lastActivity }) => (
                    <li
                      key={user.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-[#e0e0e0] bg-white px-3 py-2 text-xs text-[#333333]"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{user.email}</p>
                        <p className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-[#6b7280]">
                          {userMemorials.length} memoriales · {memoryCount} recuerdos
                        </p>
                      </div>
                      <div className="text-right text-[11px] text-[#555555]">
                        <p className="uppercase tracking-[0.22em]">Último movimiento</p>
                        <p>{lastActivity ? formatDate(lastActivity) : "—"}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <AdminUserCreator />
          </div>
        </section>

        <section
          id="servicios"
          className="rounded-[20px] border border-[#e0e0e0] bg-white/95 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.07)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Servicios contratados</p>
              <h2 className="text-xl font-serif text-[#333333]">Cómo se traduce en trabajo para la funeraria</h2>
            </div>
            <span className="rounded-full border border-[#e0e0e0] bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-[#555555]">
              {totalMemorials} memoriales · {totalOwners} clientes
            </span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-[#e0e0e0] bg-white/90 p-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#e87422]">Memoriales activos</p>
              <p className="text-2xl font-serif">{totalMemorials}</p>
              <p className="text-xs text-[#555555]">
                Cada memorial suele ir asociado a un servicio que ya entregaste a la familia.
              </p>
            </div>
            <div className="rounded-2xl border border-[#e0e0e0] bg-white/90 p-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#e87422]">Ingresos (30 días)</p>
              <p className="text-2xl font-serif">—</p>
              <p className="text-xs text-[#555555]">
                Conecta tu tabla de pagos (Stripe, etc.) para ver facturación real aquí.
              </p>
            </div>
            <div className="rounded-2xl border border-[#e0e0e0] bg-white/90 p-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#e87422]">Estado del memorial</p>
              <p className="text-xs text-[#555555]">
                Más adelante podrás marcar si cada memorial es demo, gratuito o perpetuo según tu oferta.
              </p>
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
                const lastMemoryDate = (memoriesByMemorial[memorial.id] || [])[0]?.created_at ?? null;
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
                        Último recuerdo: {formatDate(lastMemoryDate)}
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
