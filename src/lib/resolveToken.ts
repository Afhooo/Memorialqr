import { createSupabaseServerClient } from "./supabaseClient";

export async function resolveToken(token: string): Promise<string | null> {
  if (!token) {
    return null;
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("qr_links")
    .select("memorial_id, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return null;
  }

  return data.memorial_id;
}
