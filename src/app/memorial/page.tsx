import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";

export default async function MemorialIndexPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login?from=/memorial");
  }

  const supabase = createSupabaseServerClient();
  const { data: memorials } = await supabase
    .from("memorials")
    .select("id, name")
    .eq("owner_id", session.user.id)
    .order("name", { ascending: true });

  const nerudaMemorial = memorials?.find(
    (memorial) => memorial.name?.trim().toLowerCase() === "pablo neruda",
  );
  const firstMemorialId = nerudaMemorial?.id ?? memorials?.[0]?.id;

  if (firstMemorialId) {
    redirect(`/memorial/${firstMemorialId}`);
  }

  redirect("/memorial/pablo-neruda");
}
