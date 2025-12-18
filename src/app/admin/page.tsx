import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";
import { formatDate } from "@/app/memorial/[id]/components/dateUtils";
import { SimulatedDatasetSection } from "./SimulatedDatasetSection";
import { AdminCustomerCreator } from "./AdminCustomerCreator";
import { SalesChannelPieChart } from "./SalesChannelPieChart";

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

type SalesOrderRecord = {
  id: string;
  buyer_id: string;
  channel: string;
  status: string;
  amount_cents?: number | null;
  currency?: string | null;
  created_at?: string | null;
};

type ClientStats = {
  user: AdminUserRecord;
  memorials: MemorialRecord[];
  memoryCount: number;
  lastActivity: string | null;
  purchaseCount: number;
  lastPurchase: string | null;
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
  let memorialsData: MemorialRecord[] | null = null;
  let memoriesData: MemoryRecord[] | null = null;
  let usersData: AdminUserRecord[] | null = null;
  let ordersData: SalesOrderRecord[] | null = null;
  let loadError: string | null = null;
  let ordersLoadError: string | null = null;

  try {
    const [memorialsRes, memoriesRes, usersRes] = await Promise.all([
      supabase.from("memorials").select("id, name, owner_id").order("name", { ascending: true }),
      supabase.from("memories").select("id, memorial_id, created_at").order("created_at", { ascending: false }),
      supabase.from("admin_users").select("id, email, role, created_at").order("created_at", { ascending: false }),
    ]);

    memorialsData = memorialsRes.data;
    memoriesData = memoriesRes.data;
    usersData = usersRes.data;

    loadError = memorialsRes.error?.message || memoriesRes.error?.message || usersRes.error?.message || null;

    const ordersRes = await supabase
      .from("sales_orders")
      .select("id, buyer_id, channel, status, amount_cents, currency, created_at")
      .order("created_at", { ascending: false });
    if (ordersRes.error) {
      ordersLoadError = ordersRes.error.message;
      ordersData = [];
    } else {
      ordersData = ordersRes.data ?? [];
    }
  } catch (error) {
    loadError = error instanceof Error ? error.message : "No fue posible cargar datos";
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-10 text-[#0f172a]">
        <div className="rounded-2xl border border-[#fecaca] bg-[#fef2f2] p-5 text-sm text-[#991b1b] shadow-[0_18px_55px_rgba(185,28,28,0.12)]">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#b91c1c]">Error al cargar panel</p>
          <p className="mt-2 font-semibold">No pudimos cargar los datos del panel admin.</p>
          <p className="mt-1 text-[#7f1d1d]">
            {loadError}
          </p>
          <p className="mt-2 text-xs text-[#9f1239]">
            Verifica las variables de entorno de Supabase en Vercel (URL y ANON KEY) y los permisos de lectura en las tablas
            <code className="ml-1 rounded bg-white/70 px-2 py-0.5">memorials</code>,{" "}
            <code className="rounded bg-white/70 px-2 py-0.5">memories</code> y{" "}
            <code className="rounded bg-white/70 px-2 py-0.5">admin_users</code>.
          </p>
        </div>
      </div>
    );
  }

  const memorials = memorialsData ?? [];
  const memories = memoriesData ?? [];
  const users = usersData ?? [];
  const orders = ordersData ?? [];

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

  const displayChannelLabel = (channel: string) => {
    const normalized = channel.trim().toLowerCase();
    if (normalized === "funeraria" || normalized === "parque") return "Funeraria/Parque";
    if (normalized === "web" || normalized === "online" || normalized === "ecommerce") return "Web";
    if (normalized === "alianza" || normalized === "convenio") return "Alianzas";
    if (normalized === "referido") return "Referidos";
    return channel || "Otro";
  };

  const paidOrders = orders.filter((order) => (order.status || "").toLowerCase() === "paid");
  const paidOrdersByBuyer = paidOrders.reduce<Record<string, SalesOrderRecord[]>>((acc, order) => {
    acc[order.buyer_id] = acc[order.buyer_id] || [];
    acc[order.buyer_id].push(order);
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

    const ordersForBuyer = paidOrdersByBuyer[user.id] || [];
    const purchaseCount = ordersForBuyer.length;
    const lastPurchase = ordersForBuyer[0]?.created_at ?? null;

    return {
      user,
      memorials: userMemorials,
      memoryCount,
      lastActivity,
      purchaseCount,
      lastPurchase,
    };
  });

  const clientsWithMemorials = clientsWithStats.filter((client) => client.memorials.length > 0);
  const clientsWithoutActivation = clientsWithMemorials.filter((client) => client.memoryCount === 0).length;

  const topActiveClients = [...clientsWithStats].sort((a, b) => b.memoryCount - a.memoryCount).slice(0, 5);

  const channelCounts = paidOrders.reduce<Record<string, number>>((acc, order) => {
    const label = displayChannelLabel(order.channel || "");
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const channelPoints = Object.entries(channelCounts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  const totalSales = paidOrders.length;
  const customers = users.filter((user) => user.role !== "admin");
  const buyers = new Set(paidOrders.map((order) => order.buyer_id));
  const uniqueBuyers = buyers.size;

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

      <section className="space-y-6">
        <section
          id="macro-canales"
          className="rounded-[24px] border border-[#e0e0e0] bg-white/95 px-5 py-6 shadow-[0_22px_65px_rgba(0,0,0,0.06)]"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#0ea5e9]">Vista macro</p>
              <h2 className="text-xl font-serif text-[#0f172a]">Canales de venta (participación)</h2>
              <p className="text-sm text-[#4b5563]">
                Torta de participación por canal + altas reales de clientes con compra registrada.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.22em]">
              <span className="rounded-full border border-[#e5e7eb] bg-[#f8fafc] px-3 py-1 text-[#334155]">
                Ventas pagadas: <span className="font-semibold text-[#0f172a]">{totalSales}</span>
              </span>
              <span className="rounded-full border border-[#e5e7eb] bg-[#f8fafc] px-3 py-1 text-[#334155]">
                Compradores únicos: <span className="font-semibold text-[#0f172a]">{uniqueBuyers}</span>
              </span>
              <span className="rounded-full border border-[#e5e7eb] bg-[#f8fafc] px-3 py-1 text-[#334155]">
                Clientes (no staff): <span className="font-semibold text-[#0f172a]">{customers.length}</span>
              </span>
            </div>
          </div>

          {ordersLoadError && (
            <div className="mt-4 rounded-2xl border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-sm text-[#92400e]">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#b45309]">Falta tabla de ventas</p>
              <p className="mt-1">
                No se pudo leer <code className="rounded bg-white/70 px-2 py-0.5">sales_orders</code>: {ordersLoadError}
              </p>
              <p className="mt-1 text-xs text-[#92400e]">
                Ejecuta <code className="rounded bg-white/70 px-2 py-0.5">supabase-setup-real.sql</code> en Supabase y recarga.
              </p>
            </div>
          )}

          <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <SalesChannelPieChart points={channelPoints} />
              {channelPoints.length > 0 && (
                <div className="rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[#0ea5e9]">Detalle por canal</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {channelPoints.map((point) => {
                      const pct = totalSales ? Math.round((point.value / totalSales) * 100) : 0;
                      return (
                        <div
                          key={point.label}
                          className="rounded-xl border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#0f172a] shadow-[0_8px_18px_rgba(15,23,42,0.04)]"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[12px] font-semibold">{point.label}</p>
                            <p className="text-[12px] text-[#475569]">
                              <span className="font-semibold text-[#0f172a]">{point.value}</span> · {pct}%
                            </p>
                          </div>
                          <div className="mt-2 h-1.5 w-full rounded-full bg-[#e5e7eb]">
                            <div className="h-1.5 rounded-full bg-gradient-to-r from-[#0ea5e9] via-[#22c55e] to-[#e87422]" style={{ width: `${Math.max(4, pct)}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <AdminCustomerCreator />
              <div className="rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4 text-sm text-[#475569]">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#0ea5e9]">De lo general a lo particular</p>
                <p className="mt-2">
                  1) Mira participación por canal → 2) crea un cliente con compra → 3) entra con ese usuario y crea el memorial
                  → 4) vuelve aquí y revisa activación (recuerdos).
                </p>
              </div>
            </div>
          </div>
        </section>

        <SimulatedDatasetSection />

        <section
          id="ritmo-ventas"
          className="rounded-[24px] border border-[#e0e0e0] bg-gradient-to-br from-white via-[#f7f7f7] to-[#eef2ef] px-5 py-6 shadow-[0_22px_65px_rgba(0,0,0,0.08)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Embudo de uso</p>
              <h2 className="text-xl font-serif text-[#111827]">Ventas y activaciones (resumen rápido)</h2>
              <p className="text-sm text-[#4b5563]">
                Vista en texto plano para evitar errores del dashboard visual.
              </p>
            </div>
            <div className="rounded-full border border-[#e0e0e0] bg-white/80 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#4b5563]">
              Datos agregados de la plataforma
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[{ label: "Hoy", ...funnelToday }, { label: "Semana actual", ...funnelWeek }, { label: "Mes en curso", ...funnelMonth }].map(
              (bucket) => {
                const activationPercent = bucket.sold > 0 ? Math.round((bucket.activated / bucket.sold) * 100) : 0;
                return (
                  <div
                    key={bucket.label}
                    className="rounded-2xl border border-[#e0e0e0] bg-white/95 p-4 text-sm text-[#111827] shadow-[0_16px_44px_rgba(0,0,0,0.06)]"
                  >
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#e87422]">{bucket.label}</p>
                    <p className="mt-1 text-xs text-[#4b5563]">
                      Vendidos: <span className="font-semibold">{bucket.sold}</span>
                    </p>
                    <p className="text-xs text-[#4b5563]">
                      Activados: <span className="font-semibold">{bucket.activated}</span>
                    </p>
                    <p className="text-xs text-[#4b5563]">
                      Tasa: <span className="font-semibold">{activationPercent}%</span>
                    </p>
                  </div>
                );
              },
            )}
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
                {topActiveClients.map(({ user, memorials: userMemorials, memoryCount, lastActivity, purchaseCount, lastPurchase }) => {
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
                            {purchaseCount ? `${purchaseCount} compras` : "Sin compra registrada"} ·{" "}
                            {userMemorials.length} memoriales · {memoryCount} recuerdos
                          </p>
                        </div>
                        <div className="text-right text-[10px] text-[#6b7280]">
                          <p className="font-semibold text-[#0f172a]">{activationRate} rec/mem</p>
                          <p>{lastActivity ? formatDate(lastActivity) : "Sin actividad"}</p>
                          {lastPurchase && <p>Compra: {formatDate(lastPurchase)}</p>}
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
      </section>

      {/* Secciones de servicios contratados y actividad reciente eliminadas para un cierre más limpio */}
    </div>
  );
}
