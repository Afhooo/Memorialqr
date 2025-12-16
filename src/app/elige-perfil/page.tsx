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

export default async function ChooseProfilePage({
  searchParams,
}: {
  searchParams?: Promise<{ denied?: string; from?: string }> | { denied?: string; from?: string };
}) {
  const resolvedSearch =
    typeof searchParams === "object" && searchParams !== null && "then" in searchParams
      ? await (searchParams as Promise<{ denied?: string; from?: string }>)
      : (searchParams as { denied?: string; from?: string } | undefined);
  const denied = resolvedSearch?.denied;
  const requestedFrom = resolvedSearch?.from;

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

  const memorialCount = memorials?.length ?? 0;
  const isAdmin = session.user.role === "admin";

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 text-[#333333] sm:px-6">
      <div className="flex flex-col gap-5 rounded-[22px] border border-[#e0e0e0] bg-gradient-to-br from-white via-[#f8f8f8] to-[#eef2ef] px-5 py-6 shadow-[0_22px_65px_rgba(0,0,0,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Sesión activa</p>
            <h1 className="text-2xl font-serif">Elige cómo quieres entrar</h1>
          </div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#555555]">
            <span className="rounded-full border border-[#e0e0e0] bg-white/80 px-3 py-2">{session.user.email}</span>
            <span className="rounded-full border border-[#e0e0e0] bg-white/80 px-3 py-2">
              Rol: {session.user.role || "owner"}
            </span>
          </div>
        </div>

        {denied && (
          <div className="rounded-2xl border border-[#fecdd3] bg-[#fff1f2] px-4 py-3 text-sm text-[#7f1d1d] shadow-[0_16px_40px_rgba(185,28,28,0.1)]">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#b91c1c]">Acceso restringido</p>
            <p className="mt-1">
              {denied === "admin"
                ? "El panel de administración es solo para usuarios con rol admin. Solicita acceso o cambia al panel de memoriales."
                : "Este flujo es para quienes gestionan un memorial. Revisa tus permisos o entra al panel admin si eres staff."}
            </p>
            {requestedFrom && (
              <p className="mt-1 text-xs text-[#9f1239]">Ruta solicitada: {requestedFrom}</p>
            )}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3" aria-label="Formas de entrar a tu espacio">
          <div className="flex flex-col gap-3 rounded-[18px] border border-[#e0e0e0] bg-white/95 p-5 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#e87422]">Funeraria / equipo</p>
            <h3 className="text-xl font-serif text-[#333333]">Panel de administración</h3>
            <p className="text-sm text-[#4a4a4a]">
              Visión general del servicio, altas de usuarios y seguimiento de memoriales activos. Solo habilitado para rol admin.
            </p>
            <Link
              href="/admin"
              className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.24em] transition ${
                isAdmin
                  ? "border-[#e87422] text-[#e87422] hover:bg-[#e87422] hover:text-white"
                  : "cursor-not-allowed border-[#e0e0e0] text-[#aaaaaa]"
              }`}
              aria-disabled={!isAdmin}
            >
              {isAdmin ? "Ir al panel admin" : "Requiere rol admin"}
            </Link>
          </div>

          <div className="flex flex-col gap-3 rounded-[18px] border border-[#e0e0e0] bg-white/95 p-5 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#e87422]">Familia</p>
            <h3 className="text-xl font-serif text-[#333333]">Panel de memoriales</h3>
            <p className="text-sm text-[#4a4a4a]">
              Actualiza el memorial, sube fotos, revisa condolencias y mantén vivo el espacio de quien ya partió.
            </p>
            <p className="text-xs text-[#6b7280]">
              {memorialCount
                ? `${memorialCount} memorial${memorialCount === 1 ? " activo" : "es activos"} vinculados a tu cuenta.`
                : "Aún no tienes memoriales creados, puedes abrir el primero en minutos."}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/panel"
                className="rounded-full border border-[#e87422] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#e87422] transition hover:bg-[#e87422] hover:text-white"
              >
                Ir a panel de dueño
              </Link>
              <Link
                href="/crear-memorial"
                className="rounded-full border border-[#e0e0e0] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#555555] transition hover:bg-[#f6f6f6]"
              >
                Crear memorial
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-[18px] border border-[#e0e0e0] bg-white/95 p-5 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#e87422]">Demo pública</p>
            <h3 className="text-xl font-serif text-[#333333]">Ver memorial de ejemplo</h3>
            <p className="text-sm text-[#4a4a4a]">
              Navega el memorial demo sin necesidad de login para mostrarlo a familias o colegas.
            </p>
            <Link
              href="/memorial/pablo-neruda"
              className="rounded-full border border-[#e87422] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#e87422] transition hover:bg-[#e87422] hover:text-white"
            >
              Abrir demo
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e0e0e0] bg-white/90 px-4 py-3 text-sm text-[#4a4a4a] shadow-[0_14px_40px_rgba(0,0,0,0.05)]">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#e87422]">Para mostrar a alguien más</p>
          <p>Puedes abrir tu propio memorial o usar el ejemplo público para enseñar cómo se ve un espacio ya armado.</p>
        </div>
      </div>
    </div>
  );
}
