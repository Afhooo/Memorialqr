import { createSupabaseServerClient } from "./supabaseClient";

/**
 * Finds the best destination for a user after login.
 * Prefers the first owned memorial, and finally the panel.
 */
export async function getDefaultMemorialRedirectPath(userId: string): Promise<string> {
  const supabase = createSupabaseServerClient();

  const { data: memorials } = await supabase
    .from("memorials")
    .select("id, name")
    .eq("owner_id", userId)
    .order("name", { ascending: true });

  if (memorials?.[0]?.id) {
    return `/memorial/${memorials[0].id}`;
  }

  return "/panel";
}
