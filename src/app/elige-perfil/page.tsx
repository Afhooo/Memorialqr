import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";

type MemberRow = { memorial_id: string };
type MemorialRow = {
  id: string;
  name: string;
  description: string | null;
  birth_date: string | null;
  death_date: string | null;
  owner_id: string;
};

export default async function ChooseProfilePage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }
  if (session.user.role === "admin") {
    redirect("/admin");
  }

  const supabase = createSupabaseServerClient();
  const memberRes = await supabase
    .from("memorial_members")
    .select("memorial_id")
    .eq("user_id", session.user.id);

  const memberRows = (memberRes.data ?? []) as MemberRow[];
  const memberIds = [...new Set(memberRows.map((row) => row.memorial_id).filter(Boolean))] as string[];

  const memorialsQuery = supabase
    .from("memorials")
    .select("id, name, description, birth_date, death_date, owner_id")
    .order("name", { ascending: true });

  const { data: memorials = [] } =
    memberIds.length > 0
      ? await memorialsQuery.or(`owner_id.eq.${session.user.id},id.in.(${memberIds.join(",")})`)
      : await memorialsQuery.eq("owner_id", session.user.id);

  const memorialRows = (memorials ?? []) as MemorialRow[];
  const memorialCount = memorialRows.length;
  const hasOwnedMemorial = memorialRows.some((m) => m.owner_id === session.user.id);

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

        <div className="grid gap-4 md:grid-cols-3" aria-label="Formas de entrar a tu espacio">
          <div className="flex flex-col gap-3 rounded-[18px] border border-[#e0e0e0] bg-white/95 p-5 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#e87422]">Familia</p>
            <h3 className="text-xl font-serif text-[#333333]">Panel de memoriales</h3>
            <p className="text-sm text-[#4a4a4a]">
              Crea el perfil, suma recuerdos y mantén el memorial disponible para volver cuando lo necesiten.
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
                Ir a mi panel
              </Link>
              <Link
                href="/crear-memorial"
                className="rounded-full border border-[#e0e0e0] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#555555] transition hover:bg-[#f6f6f6]"
              >
                Crear memorial
              </Link>
            </div>
          </div>

          {hasOwnedMemorial && (
            <div className="flex flex-col gap-3 rounded-[18px] border border-[#e0e0e0] bg-white/95 p-5 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#e87422]">Familia</p>
              <h3 className="text-xl font-serif text-[#333333]">Usuarios agregados</h3>
              <p className="text-sm text-[#4a4a4a]">
                Agrega cuentas de familiares para que también puedan entrar al memorial y publicar recuerdos.
              </p>
              <Link
                href="/panel/usuarios"
                className="rounded-full border border-[#e87422] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#e87422] transition hover:bg-[#e87422] hover:text-white"
              >
                Administrar usuarios
              </Link>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[#e0e0e0] bg-white/90 px-4 py-3 text-sm text-[#4a4a4a] shadow-[0_14px_40px_rgba(0,0,0,0.05)]">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#e87422]">Para mostrar a alguien más</p>
          <p>Puedes abrir tu propio memorial cuando quieras para compartirlo con tu familia.</p>
        </div>
      </div>
    </div>
  );
}
