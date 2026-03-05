import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";
import { CopyPlus, Clock, Heart, Plus, ArrowRight, CalendarDays } from "lucide-react";

type MemorialRecord = {
  id: string;
  name: string;
  description: string | null;
  birth_date: string | null;
  death_date: string | null;
  created_at?: string | null;
};

export default async function OwnerPanelPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?from=/panel");
  }
  if (session.user.role === "admin") {
    redirect("/admin");
  }

  const supabase = createSupabaseServerClient();

  const memberRes = await supabase
    .from("memorial_members")
    .select("memorial_id")
    .eq("user_id", session.user.id);

  const memberRows = (memberRes.data ?? []) as Array<{ memorial_id: string }>;
  const memberIds = [...new Set(memberRows.map((row) => row.memorial_id).filter(Boolean))] as string[];

  const memorialsQuery = supabase
    .from("memorials")
    .select("id, name, description, birth_date, death_date, owner_id")
    .order("name", { ascending: true });

  const { data: memorials } =
    memberIds.length > 0
      ? await memorialsQuery.or(`owner_id.eq.${session.user.id},id.in.(${memberIds.join(",")})`)
      : await memorialsQuery.eq("owner_id", session.user.id);

  const safeMemorials = memorials ?? [];

  const memorialIds = safeMemorials.map((memorial) => memorial.id);
  let totalMemories = 0;

  if (memorialIds.length) {
    const { count } = await supabase
      .from("memories")
      .select("id", { count: "exact", head: true })
      .in("memorial_id", memorialIds);
    totalMemories = count ?? 0;
  }

  return (
    <div className="flex flex-col flex-1 w-full bg-[#fdfdfd]">
      {/* Hero Header */}
      <div className="border-b border-slate-200/60 bg-gradient-to-b from-white to-slate-50/50 px-6 py-16 sm:px-12 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-amber-50 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-slate-100 rounded-full blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-7xl relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-serif text-slate-900 mb-4 tracking-tight">Panel de Control</h1>
            <p className="text-sm text-slate-500 font-light leading-relaxed">
              Supervisa y gestiona los espacios conmemorativos. Un entorno diseñado para la preservación, con el más alto estándar de privacidad y respeto.
            </p>
          </div>
          <Link
            href="/crear-memorial"
            className="shrink-0 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-white transition-all hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5"
          >
            <Plus size={16} /> Crear Memorial
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl w-full px-6 py-12 sm:px-12 relative z-10">

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="group rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm relative overflow-hidden transition-all hover:border-slate-300 hover:shadow-md">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <CopyPlus size={80} className="text-slate-900" />
            </div>
            <div className="flex items-center gap-3 text-slate-500 mb-4">
              <CopyPlus size={16} className="text-amber-600" />
              <h3 className="text-[10px] font-semibold uppercase tracking-widest">Memoriales Activos</h3>
            </div>
            <p className="text-5xl font-light text-slate-900 font-serif tracking-tight">
              {safeMemorials.length < 10 && safeMemorials.length > 0 ? `0${safeMemorials.length}` : safeMemorials.length}
            </p>
          </div>

          <div className="group rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm relative overflow-hidden transition-all hover:border-slate-300 hover:shadow-md">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <Heart size={80} className="text-slate-900" />
            </div>
            <div className="flex items-center gap-3 text-slate-500 mb-4">
              <Heart size={16} className="text-rose-600" />
              <h3 className="text-[10px] font-semibold uppercase tracking-widest">Total Recuerdos</h3>
            </div>
            <p className="text-5xl font-light text-slate-900 font-serif tracking-tight">
              {totalMemories < 10 && totalMemories > 0 ? `0${totalMemories}` : totalMemories}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm flex flex-col transition-all hover:border-slate-300 hover:shadow-md">
            <div className="flex items-center gap-3 text-slate-500 mb-4">
              <Clock size={16} className="text-blue-600" />
              <h3 className="text-[10px] font-semibold uppercase tracking-widest">Estado del Sistema</h3>
            </div>
            <div className="flex flex-col gap-1 mt-auto pb-2">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <p className="text-sm font-medium text-slate-700 tracking-wide">En Línea & Seguro</p>
              </div>
              <p className="text-xs text-slate-400 font-light pl-5">Red de distribución global activa.</p>
            </div>
          </div>
        </div>

        {/* Memorials Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
            <h2 className="text-xl font-serif text-slate-900">Tus Espacios Creados</h2>
          </div>

          {safeMemorials.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-16 text-center flex flex-col items-center">
              <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-200/60">
                <Plus size={24} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-serif text-slate-900 mb-2">Aún no tienes memoriales</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mb-8 font-light leading-relaxed">
                Crea un espacio intemporal para honrar la memoria y compartir recuerdos invaluables.
              </p>
              <Link
                href="/crear-memorial"
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-[11px] font-semibold uppercase tracking-widest text-white transition hover:bg-slate-800 shadow-sm hover:shadow"
              >
                Comenzar ahora
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {safeMemorials.map((memorial: MemorialRecord) => (
                <Link
                  href={`/memorial/${memorial.id}`}
                  key={memorial.id}
                  className="group rounded-2xl border border-slate-200/60 bg-white p-6 lg:p-8 transition-all hover:border-slate-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-serif text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1">{memorial.name}</h3>
                    <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 group-hover:bg-amber-50 group-hover:border-amber-200 transition-all">
                      <ArrowRight size={14} className="text-slate-400 group-hover:text-amber-600 transition-all" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 font-light leading-relaxed line-clamp-2 mb-8 flex-1">
                    {memorial.description || "Espacio dedicado a preservar su legado fotográfico y memoria con el más alto respeto."}
                  </p>
                  <div className="flex flex-wrap items-center justify-between text-[10px] font-semibold tracking-widest uppercase text-slate-400 border-t border-slate-100 pt-5 mt-auto gap-4">
                    <span className="flex items-center gap-2 text-slate-500">
                      <CalendarDays size={14} className="text-slate-400" />
                      {(memorial.birth_date || memorial.death_date) ? `${memorial.birth_date?.split('-')[0] || '?'} — ${memorial.death_date?.split('-')[0] || '?'}` : 'Fechas no definidas'}
                    </span>
                    <span className="text-slate-400 group-hover:text-slate-900 transition-colors">Abrir Archivo</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
