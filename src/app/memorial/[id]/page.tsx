import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";
import type { Memory } from "@/lib/types";

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

export default async function MemorialPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  const supabase = createSupabaseServerClient(session.accessToken);

  const {
    data: memorial,
    error: memorialError,
  } = await supabase
    .from("memorials")
    .select("id, name, description, birth_date, death_date, owner_id")
    .eq("id", params.id)
    .maybeSingle();

  if (memorialError || !memorial) {
    notFound();
  }

  if (memorial.owner_id !== session.user.id) {
    notFound();
  }

  const {
    data: memories,
    error: memoryError,
  } = await supabase
    .from("memories")
    .select("id, title, content, media_url, created_at")
    .eq("memorial_id", params.id)
    .order("created_at", { ascending: false });

  if (memoryError) {
    throw new Error(memoryError.message);
  }

  const memoryList: Memory[] = memories ?? [];

  return (
    <div className="space-y-8">
      <section>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-white/60">Memorial</p>
          <h1 className="text-4xl font-semibold text-white">{memorial.name}</h1>
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">
            {formatDate(memorial.birth_date)} — {formatDate(memorial.death_date)}
          </p>
        </div>
        <p className="mt-4 text-white/80">{memorial.description || "Sin descripción"}</p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Recuerdos</h2>
          <span className="text-xs uppercase tracking-[0.4em] text-white/50">{memoryList.length} memorias</span>
        </div>
        {memoryList.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/20 p-6 text-sm text-white/70">
            Aún no hay memorias para este memorial. Puedes agregar más registros desde Supabase.
          </p>
        ) : (
          <div className="space-y-4">
            {memoryList.map((memory) => (
              <article key={memory.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/50">
                  <span>Memoria</span>
                  <span>{formatDate(memory.created_at)}</span>
                </div>
                <h3 className="mt-3 text-xl font-semibold text-white">{memory.title}</h3>
                <p className="mt-2 text-sm text-white/70">{memory.content}</p>
                {memory.media_url && (
                  <Image
                    src={memory.media_url}
                    width={900}
                    height={500}
                    alt={`Media para ${memory.title}`}
                    className="mt-4 max-h-60 w-full rounded-2xl object-cover"
                    unoptimized
                  />
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
