import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";
import type { Memorial } from "@/lib/types";

const formatDate = (value: string | null) => {
  if (!value) {
    return "—";
  }
  return new Date(value).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default async function HomePage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  const supabase = createSupabaseServerClient(session.accessToken);
  const { data: memorials, error } = await supabase
    .from("memorials")
    .select("id, name, birth_date, death_date, description")
    .eq("owner_id", session.user.id)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const memorialList: Memorial[] = memorials ?? [];

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="text-sm uppercase tracking-[0.3em] text-white/60">Bienvenido</p>
        <h1 className="text-3xl font-semibold text-white">{session.user.email ?? "Tu cuenta"}</h1>
        <p className="text-sm text-white/70">
          Usa los memoriales para documentar historias, fotos y recuerdos. Puedes compartir los enlaces a
          través de QR o NFC desde la página de escaneo.
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Tus memoriales</h2>
          <Link
            href="/scan"
            className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:border-white/60"
          >
            Escanear QR
          </Link>
        </div>

        {memorialList.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/30 p-6 text-sm text-white/70">
            Aún no tienes memoriales registrados. Escanea un QR para enlazar uno o crea registros desde el panel
            de Supabase.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {memorialList.map((memorial) => (
              <Link
                href={`/memorial/${memorial.id}`}
                key={memorial.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/30"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">Memorial</p>
                  <span className="text-xs text-white/60">
                    {formatDate(memorial.birth_date)} - {formatDate(memorial.death_date)}
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-white">{memorial.name}</h3>
                <p className="mt-2 text-sm text-white/70">{memorial.description || "Sin descripción"}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
