import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";

export default async function MemorialIndexPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login?from=/memorial");
  }

  const supabase = createSupabaseServerClient();
  const memberRes = await supabase
    .from("memorial_members")
    .select("memorial_id")
    .eq("user_id", session.user.id);

  const memberRows = (memberRes.data ?? []) as Array<{ memorial_id: string }>;
  const memberIds = [...new Set(memberRows.map((row) => row.memorial_id).filter(Boolean))] as string[];

  const memorialsQuery = supabase.from("memorials").select("id, name").order("name", { ascending: true });
  const { data: memorials } =
    memberIds.length > 0
      ? await memorialsQuery.or(`owner_id.eq.${session.user.id},id.in.(${memberIds.join(",")})`)
      : await memorialsQuery.eq("owner_id", session.user.id);

  const firstMemorialId = memorials?.[0]?.id;

  if (firstMemorialId) {
    redirect(`/memorial/${firstMemorialId}`);
  }

  redirect("/panel");
}
