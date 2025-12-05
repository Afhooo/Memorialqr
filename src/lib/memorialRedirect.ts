import { createSupabaseServerClient } from "./supabaseClient";

/**
 * Finds the best destination for a user after login.
 * Prefers a Neruda memorial when present, otherwise the first owned memorial, and finally the demo.
 */
export async function getDefaultMemorialRedirectPath(userId: string): Promise<string> {
  const supabase = createSupabaseServerClient();

  const { data: memorials } = await supabase
    .from("memorials")
    .select("id, name")
    .eq("owner_id", userId)
    .order("name", { ascending: true });

  const nerudaMemorial = memorials?.find(
    (memorial) => memorial.name?.trim().toLowerCase() === "pablo neruda",
  );

  if (nerudaMemorial?.id) {
    return `/memorial/${nerudaMemorial.id}`;
  }

  if (memorials?.[0]?.id) {
    return `/memorial/${memorials[0].id}`;
  }

  return "/memorial/pablo-neruda";
}
