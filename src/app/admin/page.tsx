import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";
import { SalesChannelPieChart } from "./SalesChannelPieChart";
import { SalesOrdersTrendChart } from "./SalesOrdersTrendChart";
import { SalesFunnelChart } from "./SalesFunnelChart";
import { MemoriesTrendChart } from "./MemoriesTrendChart";

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
  memorial_id?: string | null;
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

  const now = new Date();
  const ordersWindowStart = new Date(now);
  ordersWindowStart.setDate(now.getDate() - 190);

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
      .select("id, buyer_id, memorial_id, channel, status, amount_cents, currency, created_at")
      .gte("created_at", ordersWindowStart.toISOString())
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

  const toValidDate = (value?: string | null) => {
    if (!value) return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
  };

  const normalizeChannelKey = (channel: string) => {
    const normalized = channel.trim().toLowerCase();
    if (normalized.includes("contact") || normalized.includes("call")) return "contact_center";
    if (normalized.includes("web") || normalized.includes("online") || normalized.includes("ecommerce")) return "web";
    if (normalized.includes("convenio") || normalized.includes("alianza")) return "convenios";
    if (normalized.includes("presencial") || normalized.includes("sucursal") || normalized.includes("parque") || normalized.includes("funer")) return "presencial";
    return normalized || "otro";
  };

  const channelMeta = [
    { key: "presencial", label: "Presencial", color: "rgba(14,165,233,0.92)" },
    { key: "contact_center", label: "Contact Center", color: "rgba(34,197,94,0.92)" },
    { key: "web", label: "Web", color: "rgba(232,116,34,0.92)" },
    { key: "convenios", label: "Convenios", color: "rgba(168,85,247,0.84)" },
  ] as const;

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(startOfToday);
  const dayOfWeek = startOfToday.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  startOfWeek.setDate(startOfWeek.getDate() + diffToMonday);

  const startWeekMs = startOfWeek.getTime();
  const startMonthMs = startOfMonth.getTime();

  const paidOrders = orders.filter((order) => (order.status || "").toLowerCase() === "paid");
  const paidOrdersByBuyer = paidOrders.reduce<Record<string, SalesOrderRecord[]>>((acc, order) => {
    acc[order.buyer_id] = acc[order.buyer_id] || [];
    acc[order.buyer_id].push(order);
    return acc;
  }, {});

  const salesEvents = paidOrders
    .map((order) => toValidDate(order.created_at))
    .filter((date): date is Date => Boolean(date));

  const activationEvents = memorials
    .map((memorial) => {
      const memorialMemories = memoriesByMemorial[memorial.id] || [];
      const earliest = memorialMemories[memorialMemories.length - 1]?.created_at;
      return toValidDate(earliest ?? null);
    })
    .filter((date): date is Date => Boolean(date));

  const totalSales = paidOrders.length;
  const totalRevenueCents = paidOrders.reduce((acc, order) => acc + (order.amount_cents || 0), 0);
  const avgTicketCents = totalSales ? Math.round(totalRevenueCents / totalSales) : 0;

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

  const channelCounts = paidOrders.reduce<Record<string, number>>((acc, order) => {
    const key = normalizeChannelKey(order.channel || "");
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const channelPoints = Object.entries(channelCounts)
    .map(([key, value]) => ({
      label: channelMeta.find((c) => c.key === key)?.label ?? key,
      value,
    }))
    .sort((a, b) => b.value - a.value);

  const customers = users.filter((user) => user.role !== "admin");
  const buyers = new Set(paidOrders.map((order) => order.buyer_id));
  const uniqueBuyers = buyers.size;

  const revenueByBuyer = paidOrders.reduce<Record<string, number>>((acc, order) => {
    acc[order.buyer_id] = (acc[order.buyer_id] || 0) + (order.amount_cents || 0);
    return acc;
  }, {});

  const ordersByBuyer = paidOrders.reduce<Record<string, number>>((acc, order) => {
    acc[order.buyer_id] = (acc[order.buyer_id] || 0) + 1;
    return acc;
  }, {});

  const channelByBuyer = paidOrders.reduce<Record<string, Record<string, number>>>((acc, order) => {
    const buyer = order.buyer_id;
    const key = normalizeChannelKey(order.channel || "");
    acc[buyer] = acc[buyer] || {};
    acc[buyer]![key] = (acc[buyer]![key] || 0) + 1;
    return acc;
  }, {});

  const userById = new Map(users.map((u) => [u.id, u]));

  const topBuyersByRevenue = Object.entries(revenueByBuyer)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([buyerId, revenueCents]) => {
      const user = userById.get(buyerId);
      const channelCountsForBuyer = channelByBuyer[buyerId] || {};
      const primaryChannelKey =
        Object.entries(channelCountsForBuyer).sort((x, y) => y[1] - x[1])[0]?.[0] ?? "presencial";
      const primaryChannelLabel = channelMeta.find((c) => c.key === primaryChannelKey)?.label ?? primaryChannelKey;
      return {
        buyerId,
        email: user?.email ?? buyerId,
        revenueCents,
        orders: ordersByBuyer[buyerId] || 0,
        primaryChannel: primaryChannelLabel,
      };
    });

  const channelRevenueCents = paidOrders.reduce<Record<string, number>>((acc, order) => {
    const key = normalizeChannelKey(order.channel || "");
    acc[key] = (acc[key] || 0) + (order.amount_cents || 0);
    return acc;
  }, {});

  const firstOrderByMemorial = paidOrders.reduce<Record<string, SalesOrderRecord>>((acc, order) => {
    if (!order.memorial_id) return acc;
    const created = toValidDate(order.created_at);
    if (!created) return acc;
    const current = acc[order.memorial_id];
    if (!current) {
      acc[order.memorial_id] = order;
      return acc;
    }
    const currentDate = toValidDate(current.created_at);
    if (!currentDate || created < currentDate) acc[order.memorial_id] = order;
    return acc;
  }, {});

  const channelSoldByMemorial = Object.values(firstOrderByMemorial).reduce<Record<string, number>>((acc, order) => {
    const key = normalizeChannelKey(order.channel || "");
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const channelActivatedByMemorial = Object.values(firstOrderByMemorial).reduce<Record<string, number>>((acc, order) => {
    if (!order.memorial_id) return acc;
    const key = normalizeChannelKey(order.channel || "");
    const activated = (memoriesByMemorial[order.memorial_id] || []).length > 0;
    if (activated) acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const channelKpis = channelMeta.map((meta) => {
    const sold = channelSoldByMemorial[meta.key] || 0;
    const activated = channelActivatedByMemorial[meta.key] || 0;
    const rate = sold ? Math.round((activated / sold) * 100) : 0;
    const revenue = channelRevenueCents[meta.key] || 0;
    return { ...meta, sold, activated, rate, revenue };
  });

  const soldMemorialIds = new Set(paidOrders.map((order) => order.memorial_id).filter((id): id is string => Boolean(id)));
  const soldMemorialCount = soldMemorialIds.size || totalSales;
  const activatedSoldMemorials = [...soldMemorialIds].filter((id) => (memoriesByMemorial[id] || []).length > 0).length;
  const engagedSoldMemorials = [...soldMemorialIds].filter((id) => (memoriesByMemorial[id] || []).length >= 3).length;
  const activationRate = (soldMemorialCount ? (activatedSoldMemorials / soldMemorialCount) * 100 : 0);

  const earliestSaleByMemorial = paidOrders.reduce<Record<string, Date>>((acc, order) => {
    if (!order.memorial_id) return acc;
    const created = toValidDate(order.created_at);
    if (!created) return acc;
    const current = acc[order.memorial_id];
    if (!current || created < current) acc[order.memorial_id] = created;
    return acc;
  }, {});

  const earliestMemoryByMemorial = Object.entries(memoriesByMemorial).reduce<Record<string, Date>>((acc, [memorialId, rows]) => {
    const earliest = rows[rows.length - 1]?.created_at ?? null;
    const date = toValidDate(earliest);
    if (date) acc[memorialId] = date;
    return acc;
  }, {});

  const activationLagsDays = Object.keys(earliestSaleByMemorial)
    .map((memorialId) => {
      const soldAt = earliestSaleByMemorial[memorialId];
      const activatedAt = earliestMemoryByMemorial[memorialId];
      if (!soldAt || !activatedAt) return null;
      const diffDays = (activatedAt.getTime() - soldAt.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays < 365 ? diffDays : null;
    })
    .filter((v): v is number => typeof v === "number");

  const avgActivationDays = activationLagsDays.length
    ? Math.round((activationLagsDays.reduce((a, b) => a + b, 0) / activationLagsDays.length) * 10) / 10
    : 0;

  const formatCLP = (amount: number) => {
    const value = Math.round(amount || 0);
    return value.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
  };

  const pctDelta = (current: number, prev: number) => {
    if (prev <= 0) return current > 0 ? 100 : 0;
    return Math.round(((current - prev) / prev) * 100);
  };

  const startOfPrevWeek = new Date(startOfWeek);
  startOfPrevWeek.setDate(startOfPrevWeek.getDate() - 7);
  const startOfPrevMonth = new Date(startOfMonth);
  startOfPrevMonth.setMonth(startOfPrevMonth.getMonth() - 1);

  const salesThisWeek = salesEvents.filter((d) => d.getTime() >= startWeekMs).length;
  const salesPrevWeek = salesEvents.filter((d) => d.getTime() >= startOfPrevWeek.getTime() && d.getTime() < startWeekMs).length;
  const revenueThisWeekCents = paidOrders.reduce((acc, order) => {
    const created = toValidDate(order.created_at);
    if (!created) return acc;
    if (created.getTime() < startWeekMs) return acc;
    return acc + (order.amount_cents || 0);
  }, 0);
  const revenuePrevWeekCents = paidOrders.reduce((acc, order) => {
    const created = toValidDate(order.created_at);
    if (!created) return acc;
    if (created.getTime() < startOfPrevWeek.getTime() || created.getTime() >= startWeekMs) return acc;
    return acc + (order.amount_cents || 0);
  }, 0);

  const salesThisMonth = salesEvents.filter((d) => d.getTime() >= startMonthMs).length;
  const salesPrevMonth = salesEvents.filter((d) => d.getTime() >= startOfPrevMonth.getTime() && d.getTime() < startMonthMs).length;

  const weeklyBuckets = Array.from({ length: 12 }).map((_, reverseIndex) => {
    const index = 11 - reverseIndex;
    const start = new Date(startOfWeek);
    start.setDate(start.getDate() - index * 7);
    const key = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;
    const label = `Sem ${start.toLocaleString("es-CL", { month: "short" }).replace(".", "")} ${String(start.getDate()).padStart(2, "0")}`;
    return { start, key, label };
  });

  const weeklySalesByChannel: Record<string, number[]> = {};
  for (const channel of channelMeta) {
    weeklySalesByChannel[channel.key] = Array.from({ length: weeklyBuckets.length }).map(() => 0);
  }
  for (const order of paidOrders) {
    const created = toValidDate(order.created_at);
    if (!created) continue;
    const monday = new Date(created);
    const dow = monday.getDay();
    const diff = dow === 0 ? -6 : 1 - dow;
    monday.setDate(monday.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    const key = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;
    const idx = weeklyBuckets.findIndex((b) => b.key === key);
    if (idx < 0) continue;
    const channelKey = normalizeChannelKey(order.channel || "");
    if (!weeklySalesByChannel[channelKey]) {
      weeklySalesByChannel[channelKey] = Array.from({ length: weeklyBuckets.length }).map(() => 0);
    }
    weeklySalesByChannel[channelKey]![idx] += 1;
  }

  const weeklyActivations = Array.from({ length: weeklyBuckets.length }).map(() => 0);
  const weeklyMemories = Array.from({ length: weeklyBuckets.length }).map(() => 0);

  for (const activation of activationEvents) {
    const monday = new Date(activation);
    const dow = monday.getDay();
    const diff = dow === 0 ? -6 : 1 - dow;
    monday.setDate(monday.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    const key = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;
    const idx = weeklyBuckets.findIndex((b) => b.key === key);
    if (idx < 0) continue;
    weeklyActivations[idx] += 1;
  }

  for (const memory of memories) {
    const created = toValidDate(memory.created_at);
    if (!created) continue;
    const monday = new Date(created);
    const dow = monday.getDay();
    const diff = dow === 0 ? -6 : 1 - dow;
    monday.setDate(monday.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    const key = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;
    const idx = weeklyBuckets.findIndex((b) => b.key === key);
    if (idx < 0) continue;
    weeklyMemories[idx] += 1;
  }

  const weeklyLabels = weeklyBuckets.map((b) => b.label);
  const weeklyChannelSeries = channelMeta.map((meta) => ({
    key: meta.key,
    label: meta.label,
    color: meta.color,
    values: weeklySalesByChannel[meta.key] ?? Array.from({ length: weeklyBuckets.length }).map(() => 0),
  }));

  const monthBuckets = Array.from({ length: 6 }).map((_, reverseIndex) => {
    const index = 5 - reverseIndex;
    const start = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const key = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`;
    const label = start.toLocaleString("es-CL", { month: "short" }).replace(".", "") + ` ${String(start.getFullYear()).slice(-2)}`;
    return { start, key, label };
  });

  const monthlySalesByChannel: Record<string, number[]> = {};
  for (const channel of channelMeta) {
    monthlySalesByChannel[channel.key] = Array.from({ length: monthBuckets.length }).map(() => 0);
  }

  for (const order of paidOrders) {
    const created = toValidDate(order.created_at);
    if (!created) continue;
    const monthKey = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, "0")}`;
    const bucketIndex = monthBuckets.findIndex((bucket) => bucket.key === monthKey);
    if (bucketIndex < 0) continue;
    const key = normalizeChannelKey(order.channel || "");
    if (!monthlySalesByChannel[key]) {
      monthlySalesByChannel[key] = Array.from({ length: monthBuckets.length }).map(() => 0);
    }
    monthlySalesByChannel[key]![bucketIndex] += 1;
  }

  const monthlyActivations = Array.from({ length: monthBuckets.length }).map(() => 0);
  for (const activation of activationEvents) {
    const monthKey = `${activation.getFullYear()}-${String(activation.getMonth() + 1).padStart(2, "0")}`;
    const bucketIndex = monthBuckets.findIndex((bucket) => bucket.key === monthKey);
    if (bucketIndex < 0) continue;
    monthlyActivations[bucketIndex] += 1;
  }

  const monthlyLabels = monthBuckets.map((b) => b.label);
  const channelSeries = channelMeta.map((meta) => ({
    key: meta.key,
    label: meta.label,
    color: meta.color,
    values: monthlySalesByChannel[meta.key] ?? Array.from({ length: monthBuckets.length }).map(() => 0),
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 text-[#111827]">
      {ordersLoadError && (
        <div className="rounded-2xl border border-[#fde68a] bg-[#fffbeb] px-5 py-4 text-sm text-[#92400e] shadow-[0_18px_55px_rgba(180,83,9,0.08)]">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#b45309]">Ventas no disponibles</p>
          <p className="mt-1">
            No se pudo leer <code className="rounded bg-white/70 px-2 py-0.5">sales_orders</code>: {ordersLoadError}
          </p>
        </div>
      )}
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
                Vista ejecutiva: ventas por canal, distribución mensual y activaciones (primer recuerdo publicado).
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  kpi: "Ventas (6M)",
                  value: totalSales.toLocaleString("es-CL"),
                  sub: `Semana: ${pctDelta(salesThisWeek, salesPrevWeek)}% · Mes: ${pctDelta(salesThisMonth, salesPrevMonth)}%`,
                },
                {
                  kpi: "Ingresos (6M)",
                  value: formatCLP(totalRevenueCents),
                  sub: `Semana: ${pctDelta(revenueThisWeekCents, revenuePrevWeekCents)}%`,
                },
                {
                  kpi: "Ticket promedio",
                  value: formatCLP(avgTicketCents),
                  sub: "Promedio por orden pagada",
                },
                {
                  kpi: "Activación",
                  value: `${activationRate.toFixed(1)}%`,
                  sub: `${activatedSoldMemorials.toLocaleString("es-CL")} activados / ${soldMemorialCount.toLocaleString("es-CL")} vendidos`,
                },
                {
                  kpi: "Tiempo a activación",
                  value: `${avgActivationDays} días`,
                  sub: "Promedio entre venta y primer recuerdo",
                },
                {
                  kpi: "Compradores únicos",
                  value: uniqueBuyers.toLocaleString("es-CL"),
                  sub: `${customers.length.toLocaleString("es-CL")} clientes (no staff)`,
                },
              ].map((card) => (
                <div key={card.kpi} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">{card.kpi}</p>
                  <p className="mt-1 text-3xl font-semibold text-white">{card.value}</p>
                  <p className="mt-1 text-xs text-white/70">{card.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-[24px] border border-white/12 bg-white/5 p-5 backdrop-blur">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">Clientes con memorial</p>
                <p className="mt-1 text-2xl font-semibold text-white">{totalOwners}</p>
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
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">Adopción (6M)</p>
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
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">Embudo comercial (6M)</p>
              <SalesFunnelChart sold={soldMemorialCount} activated={activatedSoldMemorials} engaged={engagedSoldMemorials} />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <section className="grid gap-6 lg:grid-cols-[1.55fr_0.85fr]">
          <div className="rounded-[24px] border border-[#e0e0e0] bg-white/95 px-5 py-6 shadow-[0_22px_65px_rgba(0,0,0,0.06)]">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#0ea5e9]">Tendencia semanal</p>
                <h2 className="text-xl font-serif text-[#0f172a]">Ventas por canal + activaciones</h2>
                <p className="text-sm text-[#4b5563]">Últimas 12 semanas.</p>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.22em] text-[#334155]">
                <span className="rounded-full border border-[#e5e7eb] bg-[#f8fafc] px-3 py-1">
                  Semana: <span className="font-semibold text-[#0f172a]">{salesThisWeek}</span> ({pctDelta(salesThisWeek, salesPrevWeek)}%)
                </span>
                <span className="rounded-full border border-[#e5e7eb] bg-[#f8fafc] px-3 py-1">
                  Ingresos: <span className="font-semibold text-[#0f172a]">{formatCLP(revenueThisWeekCents)}</span>
                </span>
              </div>
            </div>
            <div className="mt-5">
              <SalesOrdersTrendChart labels={weeklyLabels} channels={weeklyChannelSeries} activated={weeklyActivations} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[24px] border border-[#e0e0e0] bg-white/95 px-5 py-6 shadow-[0_22px_65px_rgba(0,0,0,0.06)]">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[#0ea5e9]">Mix comercial</p>
                  <h2 className="text-xl font-serif text-[#0f172a]">Participación por canal</h2>
                  <p className="text-sm text-[#4b5563]">Órdenes pagadas en los últimos 6 meses.</p>
                </div>
              </div>
              <div className="mt-5">
                <SalesChannelPieChart points={channelPoints} />
              </div>
            </div>

            <div className="rounded-[24px] border border-[#e0e0e0] bg-white/95 px-5 py-6 shadow-[0_22px_65px_rgba(0,0,0,0.06)]">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#0ea5e9]">Uso</p>
                <h2 className="text-xl font-serif text-[#0f172a]">Actividad de contenido</h2>
                <p className="text-sm text-[#4b5563]">Recuerdos publicados vs activaciones (primer recuerdo).</p>
              </div>
              <div className="mt-5">
                <MemoriesTrendChart labels={weeklyLabels} memories={weeklyMemories} activations={weeklyActivations} />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-[#e0e0e0] bg-white/95 px-5 py-6 shadow-[0_22px_65px_rgba(0,0,0,0.06)]">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#0ea5e9]">Tendencia mensual</p>
              <h2 className="text-xl font-serif text-[#0f172a]">Distribución por canal + activaciones</h2>
              <p className="text-sm text-[#4b5563]">Últimos 6 meses.</p>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.22em] text-[#334155]">
              <span className="rounded-full border border-[#e5e7eb] bg-[#f8fafc] px-3 py-1">
                Ventas: <span className="font-semibold text-[#0f172a]">{totalSales.toLocaleString("es-CL")}</span>
              </span>
              <span className="rounded-full border border-[#e5e7eb] bg-[#f8fafc] px-3 py-1">
                Ingresos: <span className="font-semibold text-[#0f172a]">{formatCLP(totalRevenueCents)}</span>
              </span>
            </div>
          </div>
          <div className="mt-5">
            <SalesOrdersTrendChart labels={monthlyLabels} channels={channelSeries} activated={monthlyActivations} />
          </div>
        </section>
        <section className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-[24px] border border-[#e0e0e0] bg-white/95 px-5 py-6 shadow-[0_22px_65px_rgba(0,0,0,0.06)]">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#0ea5e9]">Cartera</p>
                <h2 className="text-xl font-serif text-[#0f172a]">Top clientes por ingresos</h2>
                <p className="text-sm text-[#4b5563]">Órdenes pagadas en los últimos 6 meses.</p>
              </div>
              <span className="rounded-full border border-[#e5e7eb] bg-[#f8fafc] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#334155]">
                {topBuyersByRevenue.length} cuentas
              </span>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white">
              <div className="grid grid-cols-[1.4fr_0.8fr_0.6fr_0.8fr] gap-2 bg-[#f8fafc] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#475569]">
                <span>Cliente</span>
                <span>Canal</span>
                <span>Órdenes</span>
                <span className="text-right">Ingresos</span>
              </div>
              <div className="divide-y divide-[#e5e7eb]">
                {topBuyersByRevenue.map((buyer) => (
                  <div
                    key={buyer.buyerId}
                    className="grid grid-cols-[1.4fr_0.8fr_0.6fr_0.8fr] gap-2 px-4 py-3 text-sm text-[#0f172a]"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{buyer.email}</p>
                      <p className="truncate text-xs text-[#64748b]">ID: {buyer.buyerId}</p>
                    </div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#475569]">{buyer.primaryChannel}</p>
                    <p className="font-semibold">{buyer.orders.toLocaleString("es-CL")}</p>
                    <p className="text-right font-semibold">{formatCLP(buyer.revenueCents)}</p>
                  </div>
                ))}
                {topBuyersByRevenue.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-[#6b7280]">Sin datos suficientes aún.</div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e0e0e0] bg-white/95 px-5 py-6 shadow-[0_22px_65px_rgba(0,0,0,0.06)]">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-[#0ea5e9]">Canales</p>
                <h2 className="text-xl font-serif text-[#0f172a]">Eficiencia por canal</h2>
                <p className="text-sm text-[#4b5563]">Conversión activación + ingresos por canal (6M).</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {channelKpis.map((channel) => (
                <div key={channel.key} className="rounded-2xl border border-[#e5e7eb] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0f172a]">{channel.label}</p>
                      <p className="text-xs text-[#64748b]">
                        Vendidos: <span className="font-semibold text-[#0f172a]">{channel.sold.toLocaleString("es-CL")}</span>{" "}
                        · Activados:{" "}
                        <span className="font-semibold text-[#0f172a]">{channel.activated.toLocaleString("es-CL")}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#0f172a]">{channel.rate}%</p>
                      <p className="text-xs text-[#64748b]">{formatCLP(channel.revenue)}</p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-[#e5e7eb]">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${Math.max(2, Math.min(100, channel.rate))}%`,
                        background: `linear-gradient(90deg, ${channel.color}, rgba(15,23,42,0.22))`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>
      </section>
    </div>
  );
}
