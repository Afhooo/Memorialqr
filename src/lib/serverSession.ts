import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "./supabaseClient";
import { ACCESS_TOKEN_COOKIE } from "./constants";

export interface ServerSession {
  accessToken: string;
  user: User;
}

export async function getServerSession(): Promise<ServerSession | null> {
  const token = cookies().get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const supabase = createSupabaseServerClient(token);
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return null;
  }

  return {
    accessToken: token,
    user: data.user,
  };
}
