import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { AUTH_TOKEN_COOKIE } from "@/lib/constants";

export async function DELETE() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
  const supabase = createSupabaseServerClient();

  if (token) {
    await supabase.from("sessions").delete().eq("token", token);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.delete(AUTH_TOKEN_COOKIE);
  return response;
}
