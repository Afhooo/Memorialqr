import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";
import { MembersManager } from "./MembersManager";

export const dynamic = "force-dynamic";

type MemberRow = {
  id: string;
  userId: string;
  email: string;
  createdAt: string | null;
};

type MemberSelectRow = {
  id: string;
  user_id: string;
  created_at: string | null;
  user?: { email?: string | null } | Array<{ email?: string | null }> | null;
};

function getUserEmail(value: MemberSelectRow["user"]) {
  if (!value) return null;
  const record = Array.isArray(value) ? value[0] : value;
  return record?.email ?? null;
}

export default async function MemorialUsersPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?from=/panel/usuarios");
  }
  if (session.user.role === "admin") {
    redirect("/admin");
  }

  const resolvedParams = await Promise.resolve(params);
  const memorialId = resolvedParams.id;

  const supabase = createSupabaseServerClient();
  const { data: memorial } = await supabase
    .from("memorials")
    .select("id, owner_id, name")
    .eq("id", memorialId)
    .maybeSingle();

  if (!memorial || memorial.owner_id !== session.user.id) {
    redirect("/panel/usuarios");
  }

  const membersRes = await supabase
    .from("memorial_members")
    .select("id, user_id, created_at, user:admin_users(id, email)")
    .eq("memorial_id", memorialId)
    .order("created_at", { ascending: false });

  const initialMembers: MemberRow[] = ((membersRes.data ?? []) as MemberSelectRow[]).map((row) => ({
    id: row.id,
    userId: row.user_id,
    email: getUserEmail(row.user) ?? "—",
    createdAt: row.created_at ?? null,
  }));

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 text-[#111827] sm:px-6">
      <header className="space-y-2">
        <p className="text-[10px] uppercase tracking-[0.32em] text-[#e87422]">Usuarios</p>
        <h1 className="text-3xl font-semibold">{memorial.name}</h1>
        <p className="text-sm text-[#4b5563]">
          Agrega familiares por correo. Si el correo no existe, se crea una cuenta y te damos una contraseña temporal.
        </p>
      </header>

      <MembersManager memorialId={memorialId} initialMembers={initialMembers} />
    </div>
  );
}
