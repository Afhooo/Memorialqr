import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";
import { formatDate } from "@/app/memorial/[id]/components/dateUtils";
import { AdminCustomerCreator } from "../AdminCustomerCreator";
import { AdminUserCreator } from "../AdminUserCreator";

type AdminUserRecord = {
  id: string;
  email: string;
  role: string;
  created_at?: string | null;
};

type MemorialRecord = {
  id: string;
  owner_id: string;
};

type SalesOrderRecord = {
  id: string;
  buyer_id: string;
  status: string;
  created_at?: string | null;
  channel?: string | null;
};

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?from=/admin/usuarios");
  }
  if (session.user.role !== "admin") {
    redirect("/elige-perfil?denied=admin&from=/admin/usuarios");
  }

  const supabase = createSupabaseServerClient();

  const [usersRes, memorialsRes, ordersRes] = await Promise.all([
    supabase.from("admin_users").select("id, email, role, created_at").order("created_at", { ascending: false }),
    supabase.from("memorials").select("id, owner_id"),
    supabase.from("sales_orders").select("id, buyer_id, status, created_at, channel").order("created_at", { ascending: false }),
  ]);

  const users = (usersRes.data ?? []) as AdminUserRecord[];
  const memorials = (memorialsRes.data ?? []) as MemorialRecord[];
  const orders = (ordersRes.data ?? []) as SalesOrderRecord[];

  const memorialCountByOwner = memorials.reduce<Record<string, number>>((acc, memorial) => {
    acc[memorial.owner_id] = (acc[memorial.owner_id] || 0) + 1;
    return acc;
  }, {});

  const paidOrders = orders.filter((order) => (order.status || "").toLowerCase() === "paid");
  const paidOrdersByBuyer = paidOrders.reduce<Record<string, SalesOrderRecord[]>>((acc, order) => {
    acc[order.buyer_id] = acc[order.buyer_id] || [];
    acc[order.buyer_id].push(order);
    return acc;
  }, {});

  const owners = users.filter((u) => u.role !== "admin");

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 text-[#111827]">
      <section className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#0ea5e9]">Administración</p>
          <h1 className="text-3xl font-semibold">Mantenedor de usuarios</h1>
          <p className="text-sm text-[#4b5563]">
            Crea cuentas de clientes (owner) y staff (admin). Aquí vive el flujo operacional; el dashboard queda solo para métricas.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin"
            className="rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0f172a] transition hover:bg-[#f8fafc]"
          >
            Volver a dashboard
          </Link>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <AdminCustomerCreator />
        <AdminUserCreator />
      </section>

      <section className="rounded-[24px] border border-[#e0e0e0] bg-white/95 px-5 py-6 shadow-[0_22px_65px_rgba(0,0,0,0.06)]">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#0ea5e9]">Listado</p>
            <h2 className="text-xl font-serif text-[#0f172a]">Cuentas registradas</h2>
            <p className="text-sm text-[#4b5563]">Incluye memoriales asociados y compras registradas (si existen).</p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.22em]">
            <span className="rounded-full border border-[#e5e7eb] bg-[#f8fafc] px-3 py-1 text-[#334155]">
              Total: <span className="font-semibold text-[#0f172a]">{users.length}</span>
            </span>
            <span className="rounded-full border border-[#e5e7eb] bg-[#f8fafc] px-3 py-1 text-[#334155]">
              Clientes: <span className="font-semibold text-[#0f172a]">{owners.length}</span>
            </span>
            <span className="rounded-full border border-[#e5e7eb] bg-[#f8fafc] px-3 py-1 text-[#334155]">
              Staff:{" "}
              <span className="font-semibold text-[#0f172a]">{users.filter((u) => u.role === "admin").length}</span>
            </span>
          </div>
        </div>

        {(usersRes.error || memorialsRes.error || ordersRes.error) && (
          <div className="mt-4 rounded-2xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#991b1b]">
            No se pudo cargar todo el dataset.{" "}
            <span className="text-xs">
              {usersRes.error?.message || memorialsRes.error?.message || ordersRes.error?.message}
            </span>
          </div>
        )}

        <div className="mt-5 overflow-hidden rounded-2xl border border-[#e5e7eb]">
          <div className="grid grid-cols-[1.6fr_0.5fr_0.6fr_0.6fr_0.7fr] gap-2 bg-[#f8fafc] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#475569]">
            <span>Email</span>
            <span>Rol</span>
            <span>Memoriales</span>
            <span>Compras</span>
            <span>Último</span>
          </div>
          <div className="divide-y divide-[#e5e7eb] bg-white">
            {users.map((user) => {
              const memorialCount = memorialCountByOwner[user.id] || 0;
              const ordersForBuyer = paidOrdersByBuyer[user.id] || [];
              const purchaseCount = ordersForBuyer.length;
              const lastPurchase = ordersForBuyer[0]?.created_at ?? null;
              const lastSeen = lastPurchase || user.created_at || null;
              return (
                <div
                  key={user.id}
                  className="grid grid-cols-[1.6fr_0.5fr_0.6fr_0.6fr_0.7fr] gap-2 px-4 py-3 text-sm text-[#0f172a]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{user.email}</p>
                    <p className="truncate text-xs text-[#64748b]">ID: {user.id}</p>
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-[#475569]">{user.role}</div>
                  <div className="text-sm font-semibold">{memorialCount}</div>
                  <div className="text-sm font-semibold">{purchaseCount}</div>
                  <div className="text-xs text-[#475569]">{lastSeen ? formatDate(lastSeen) : "—"}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

