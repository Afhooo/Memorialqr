import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { AUTH_TOKEN_COOKIE, SESSION_MAX_AGE } from "@/lib/constants";
import { getDefaultMemorialRedirectPath } from "@/lib/memorialRedirect";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const { data: user, error } = await supabase
    .from("admin_users")
    .select("id, email, role, password_hash")
    .eq("email", email)
    .maybeSingle();

  if (error || !user || !user.password_hash) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const token = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000).toISOString();

  await supabase.from("sessions").insert({
    user_id: user.id,
    token,
    expires_at: expiresAt,
  });

  const redirectTo = await getDefaultMemorialRedirectPath(user.id);

  const response = NextResponse.json({ ok: true, redirectTo });
  response.cookies.set(AUTH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return response;
}
