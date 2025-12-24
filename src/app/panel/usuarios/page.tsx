import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";

export const dynamic = "force-dynamic";

type MemorialRow = {
  id: string;
  name: string;
  description: string | null;
};

export default async function PanelUsuariosPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?from=/panel/usuarios");
  }
  if (session.user.role === "admin") {
    redirect("/admin");
  }

  const supabase = createSupabaseServerClient();
  const { data: memorials = [] } = await supabase
    .from("memorials")
    .select("id, name, description")
    .eq("owner_id", session.user.id)
    .order("name", { ascending: true });

  const rows = (memorials ?? []) as MemorialRow[];
  const canManage = rows.length > 0;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 text-[#111827] sm:px-6">
      <header className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Familia</p>
        <h1 className="text-3xl font-semibold">Usuarios agregados</h1>
        <p className="text-sm text-[#4b5563]">
          Elige un memorial para agregar o quitar cuentas de familiares con acceso.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {rows.map((memorial) => (
          <div
            key={memorial.id}
            className="rounded-3xl border border-[#e5e7eb] bg-white/95 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)]"
          >
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#e87422]">Memorial</p>
            <h2 className="mt-2 text-xl font-semibold text-[#0f172a]">{memorial.name}</h2>
            <p className="mt-2 line-clamp-3 text-sm text-[#475569]">{memorial.description || "Sin descripción."}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/panel/usuarios/${memorial.id}`}
                className="rounded-full border border-[#e87422] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e87422] transition hover:bg-[#e87422] hover:text-white"
              >
                Administrar usuarios
              </Link>
              <Link
                href={`/memorial/${memorial.id}`}
                className="rounded-full border border-[#e5e7eb] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#334155] transition hover:bg-[#f8fafc]"
              >
                Abrir memorial
              </Link>
            </div>
          </div>
        ))}

        {!canManage && (
          <div className="rounded-3xl border border-dashed border-[#d1d5db] bg-white/70 p-6 text-center text-sm text-[#6b7280] md:col-span-2">
            Solo el dueño del memorial puede administrar usuarios. Si necesitas acceso, pide al dueño que te agregue.
            <div className="mt-4">
              <Link
                href="/panel"
                className="inline-flex rounded-full bg-[#e87422] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white"
              >
                Volver al panel
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
