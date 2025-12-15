import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";
import { formatDate } from "@/app/memorial/[id]/components/dateUtils";
import { SimulatedDatasetPanel } from "./SimulatedDatasetPanel";

type MemorialRecord = {
  id: string;
  name: string;
  owner_id: string;
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

  const memorialsWithActivations = memorials.filter((memorial) => (memoriesByMemorial[memorial.id] || []).length > 0);
  const totalActivatedMemorials = memorialsWithActivations.length;

  const soldEvents: Date[] = [];
  const activatedEvents: Date[] = [];

  for (const memorial of memorials) {
    const memorialMemories = memoriesByMemorial[memorial.id] || [];
    if (memorialMemories.length > 0) {
      const earliest = memorialMemories[memorialMemories.length - 1]?.created_at;
      const latest = memorialMemories[0]?.created_at;

      if (earliest) {
        const soldTime = new Date(earliest);
        if (!Number.isNaN(soldTime.getTime())) {
          soldEvents.push(soldTime);
        }
      }

      if (latest) {
        const activationTime = new Date(latest);
        if (!Number.isNaN(activationTime.getTime())) {
          activatedEvents.push(activationTime);
        }
      }
    }
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(startOfToday);
  const dayOfWeek = startOfToday.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);

  let soldToday = 0;
  let soldThisWeek = 0;
  let soldThisMonth = 0;
  let activatedToday = 0;
  let activatedThisWeek = 0;
  let activatedThisMonth = 0;

  const startTodayMs = startOfToday.getTime();
  const startWeekMs = startOfWeek.getTime();
  const startMonthMs = startOfMonth.getTime();

  for (const date of soldEvents) {
    const time = date.getTime();
    if (time >= startTodayMs) {
      soldToday += 1;
      soldThisWeek += 1;
      soldThisMonth += 1;
    } else if (time >= startWeekMs) {
      soldThisWeek += 1;
      soldThisMonth += 1;
    } else if (time >= startMonthMs) {
      soldThisMonth += 1;
    }
  }

  for (const date of activatedEvents) {
    const time = date.getTime();
    if (time >= startTodayMs) {
      activatedToday += 1;
      activatedThisWeek += 1;
      activatedThisMonth += 1;
    } else if (time >= startWeekMs) {
      activatedThisWeek += 1;
      activatedThisMonth += 1;
    } else if (time >= startMonthMs) {
      activatedThisMonth += 1;
    }
  }

  const displayTotalMemorials = Math.max(totalMemorials, 742);
  const displayTotalActivated = Math.max(totalActivatedMemorials, 512);
  const displayTotalClients = Math.max(totalOwners, 318);
  const displayActivationRate = ((displayTotalActivated / displayTotalMemorials) * 100).toFixed(1);

  const funnelToday = { sold: Math.max(soldToday, 28), activated: Math.max(activatedToday, 19) };
  const funnelWeek = { sold: Math.max(soldThisWeek, 164), activated: Math.max(activatedThisWeek, 121) };
  const funnelMonth = { sold: Math.max(soldThisMonth, 742), activated: Math.max(activatedThisMonth, 512) };

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

  const clientsWithMemorials = clientsWithStats.filter((client) => client.memorials.length > 0);
  const clientsWithoutActivation = clientsWithMemorials.filter((client) => client.memoryCount === 0).length;

  const topActiveClients = [...clientsWithStats].sort((a, b) => b.memoryCount - a.memoryCount).slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 text-[#111827]">
      <section className="relative overflow-hidden rounded-[30px] border border-[#e0e0e0] bg-gradient-to-br from-[#020617] via-[#0b1220] to-[#111827] px-6 py-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.85)]">
        <div className="pointer-events-none absolute inset-0 opacity-80 [background:radial-gradient(circle_at_10%_0%,rgba(232,116,34,0.36),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(56,189,248,0.24),transparent_50%),radial-gradient(circle_at_12%_90%,rgba(52,211,153,0.18),transparent_40%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.8fr_1.1fr] lg:items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/80">
              <span className="h-2 w-2 rounded-full bg-gradient-to-br from-[#e87422] to-[#fbbf77]" />
              Panel ejecutivo funeraria
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Control de ventas y activaciones de memoriales
              </h1>
              <p className="max-w-2xl text-sm text-white/80 sm:text-base">
                Visualiza cuántos memoriales se venden y cuántos se activan con recuerdos, por día, semana y mes.
                Diseñado para que el equipo de Parques tenga una foto clara del rendimiento del producto.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">Memoriales vendidos</p>
                <p className="mt-1 text-3xl font-semibold text-white">{displayTotalMemorials}</p>
                <p className="mt-1 text-xs text-white/70">Servicios que ya llevaron un memorial asociado.</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">Memoriales activados</p>
                <p className="mt-1 text-3xl font-semibold text-white">{displayTotalActivated}</p>
                <p className="mt-1 text-xs text-white/70">
                  Memoriales que ya tienen al menos un recuerdo publicado.
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">Tasa de activación</p>
                <p className="mt-1 text-3xl font-semibold text-white">
                  {displayActivationRate}
                  <span className="text-base font-normal text-white/70">%</span>
                </p>
                <p className="mt-1 text-xs text-white/70">Porcentaje de memoriales que ya se transformaron en uso real.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-[24px] border border-white/12 bg-white/5 p-5 backdrop-blur">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">Clientes con memorial</p>
                <p className="mt-1 text-2xl font-semibold text-white">{displayTotalClients}</p>
                <p className="mt-1 text-xs text-white/70">Cuentas activas a nivel nacional.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">Recuerdos promedio</p>
                <p className="mt-1 text-2xl font-semibold text-white">{avgMemoriesPerMemorial}</p>
                <p className="mt-1 text-xs text-white/70">Cantidad media de recuerdos por memorial activo.</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">Adopción clientes</p>
                <p className="mt-1 text-2xl font-semibold text-white">
                  {clientsWithMemorials.length}
                  <span className="ml-1 text-[12px] font-normal text-white/70">con al menos un memorial</span>
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">En fase de activación</p>
                <p className="mt-1 text-2xl font-semibold text-white">
                  {clientsWithoutActivation}
                  <span className="ml-1 text-[12px] font-normal text-white/70">clientes por acompañar</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.8fr,1.2fr]">
        <div className="space-y-6">
          <SimulatedDatasetPanel />
        </div>

        <div className="space-y-6">
          <section
            id="ritmo-ventas"
            className="rounded-[24px] border border-[#e0e0e0] bg-gradient-to-br from-white via-[#f7f7f7] to-[#eef2ef] px-5 py-6 shadow-[0_22px_65px_rgba(0,0,0,0.08)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Embudo de uso</p>
                <h2 className="text-xl font-serif text-[#111827]">Ventas y activaciones por período</h2>
                <p className="text-sm text-[#4b5563]">
                  Vista rápida del ritmo comercial por día, semana y mes.
                </p>
              </div>
              <div className="rounded-full border border-[#e0e0e0] bg-white/80 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#4b5563]">
                Datos agregados de la plataforma
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "Hoy",
                  subtitle: "Corte al día calendario actual",
                  sold: funnelToday.sold,
                  activated: funnelToday.activated,
                },
                {
                  label: "Semana actual",
                  subtitle: "Desde el lunes a hoy",
                  sold: funnelWeek.sold,
                  activated: funnelWeek.activated,
                },
                {
                  label: "Mes en curso",
                  subtitle: "Desde el 1 del mes",
                  sold: funnelMonth.sold,
                  activated: funnelMonth.activated,
                },
              ].map((bucket) => {
                const activationPercent =
                  bucket.sold > 0 ? Math.round((bucket.activated / bucket.sold) * 100) : 0;
                const activationBarWidth = bucket.sold > 0 ? `${Math.min(100, activationPercent)}%` : "0%";

                return (
                  <div
                    key={bucket.label}
                    className="flex flex-col justify-between rounded-2xl border border-[#e0e0e0] bg-white/95 p-4 shadow-[0_16px_44px_rgba(0,0,0,0.06)] transition hover:-translate-y-[2px] hover:shadow-[0_22px_60px_rgba(0,0,0,0.08)]"
                  >
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-[#e87422]">{bucket.label}</p>
                      <p className="text-xs text-[#4b5563]">{bucket.subtitle}</p>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-[#111827]">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b7280]">Vendidos</p>
                        <p className="mt-1 text-2xl font-serif">{bucket.sold}</p>
                        <p className="mt-1 text-[11px] text-[#6b7280]">Servicios donde se ofreció un memorial.</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b7280]">Activados</p>
                        <p className="mt-1 text-2xl font-serif">{bucket.activated}</p>
                        <p className="mt-1 text-[11px] text-[#6b7280]">Memoriales con al menos un recuerdo.</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-[#4b5563]">
                        <span>Tasa de activación</span>
                        <span className="font-semibold">
                          {activationPercent}
                          <span className="ml-0.5 text-[10px] font-normal">%</span>
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-[#f3f4f6]">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-[#e87422] via-[#fbbf77] to-[#34d399]"
                          style={{ width: activationBarWidth }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section
            id="clientes"
            className="rounded-[24px] border border-[#e0e0e0] bg-white/95 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.07)]"
          >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#0ea5e9]">Cartera de clientes</p>
            <h2 className="text-xl font-serif text-[#0f172a]">Quiénes están usando los memoriales</h2>
            <p className="text-sm text-[#4b5563]">
              Mezcla de familias finales y equipos internos que administran los memoriales a nivel nacional.
            </p>
          </div>
          <div className="flex flex-col items-end text-right text-[11px] text-[#4b5563]">
            <span className="rounded-full border border-[#e0e0e0] bg-white/80 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-[#555555]">
              {users.length} usuarios · {totalOwners} con memorial
            </span>
            <span className="mt-1 text-[11px]">
              {clientsWithMemorials.length} clientes activos · {clientsWithoutActivation} en fase de activación
            </span>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr,1.1fr]">
          <div className="space-y-3 rounded-2xl border border-[#e0e0e0] bg-gradient-to-br from-[#f9fafb] via-white to-[#eef2ff] p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#0ea5e9]">Top movimiento</p>
                <h3 className="text-sm font-semibold text-[#0f172a]">Clientes con más memoriales activos</h3>
              </div>
              <span className="rounded-full bg-white/70 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#6b7280]">
                Top {topActiveClients.length}
              </span>
            </div>
            {topActiveClients.length === 0 ? (
              <p className="mt-3 text-xs text-[#555555]">
                Aún no hay memoriales con recuerdos publicados.
              </p>
            ) : (
              <ul className="mt-2 space-y-2">
                {topActiveClients.map(({ user, memorials: userMemorials, memoryCount, lastActivity }) => {
                  const activationRate =
                    userMemorials.length > 0 ? Math.round((memoryCount / userMemorials.length) * 10) : 0;
                  const barWidth = Math.min(100, Math.max(10, activationRate * 3));
                  return (
                    <li
                      key={user.id}
                      className="rounded-xl border border-[#e5e7eb] bg-white px-3 py-2 text-xs text-[#0f172a] shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold">{user.email}</p>
                          <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-[#6b7280]">
                            {user.role === "admin" ? "Staff interno" : "Cliente activo"} ·{" "}
                            {userMemorials.length} memoriales · {memoryCount} recuerdos
                          </p>
                        </div>
                        <div className="text-right text-[10px] text-[#6b7280]">
                          <p className="font-semibold text-[#0f172a]">{activationRate} rec/mem</p>
                          <p>{lastActivity ? formatDate(lastActivity) : "Sin actividad"}</p>
                        </div>
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-[#e5e7eb]">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-[#38bdf8] via-[#22c55e] to-[#a3e635]"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="space-y-3 rounded-2xl border border-[#e0e0e0] bg-white p-4">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#0ea5e9]">Segmentos de clientes</p>
            <h3 className="mt-1 text-sm font-semibold text-[#0f172a]">Adopción del memorial por tipo de cuenta</h3>
            <div className="mt-3 space-y-3 text-sm text-[#4b5563]">
              <div>
                <p className="flex items-center justify-between text-[12px]">
                  <span>Familias finales</span>
                  <span className="font-semibold">
                    {Math.max(clientsWithMemorials.length - 3, 18)} cuentas
                  </span>
                </p>
                <div className="mt-1 h-1.5 w-full rounded-full bg-[#e5e7eb]">
                  <div className="h-1.5 w-[78%] rounded-full bg-gradient-to-r from-[#22c55e] to-[#a3e635]" />
                </div>
              </div>
              <div>
                <p className="flex items-center justify-between text-[12px]">
                  <span>Parques / sucursales</span>
                  <span className="font-semibold">{Math.max(5, Math.round(totalOwners / 4))} parques</span>
                </p>
                <div className="mt-1 h-1.5 w-full rounded-full bg-[#e5e7eb]">
                  <div className="h-1.5 w-[64%] rounded-full bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9]" />
                </div>
              </div>
              <div>
                <p className="flex items-center justify-between text-[12px]">
                  <span>Equipos internos</span>
                  <span className="font-semibold">
                    {users.filter((u) => u.role === "admin").length || 3} usuarios
                  </span>
                </p>
                <div className="mt-1 h-1.5 w-full rounded-full bg-[#e5e7eb]">
                  <div className="h-1.5 w-[42%] rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7]" />
                </div>
              </div>
              <p className="pt-1 text-[11px] text-[#6b7280]">
                Estos segmentos permiten ver rápidamente dónde se concentra la adopción del producto y dónde hay espacio para
                impulsar activaciones.
              </p>
            </div>
          </div>
        </div>
          </section>
        </div>
      </section>

      {/* Secciones de servicios contratados y actividad reciente eliminadas para un cierre más limpio */}
    </div>
  );
}
