import { cookies } from "next/headers";
import { createSupabaseServerClient } from "./supabaseClient";
import { AUTH_TOKEN_COOKIE } from "./constants";
import type { ServerSession } from "./types";

export async function getServerSession(): Promise<ServerSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("token, expires_at, admin_user:admin_users(id, email, role)")
    .eq("token", token)
    .gte("expires_at", new Date().toISOString())
    .maybeSingle();

  if (error || !data || !data.admin_user) {
    return null;
  }

  const user = Array.isArray(data.admin_user) ? data.admin_user[0] : data.admin_user;
  if (!user) {
    return null;
  }

  return {
    token: data.token,
    user,
  };
}
