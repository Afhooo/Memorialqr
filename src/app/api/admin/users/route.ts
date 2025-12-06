import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";

export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const role = typeof body.role === "string" ? body.role.trim() : "admin";

  if (!email) {
    return NextResponse.json({ error: "El correo es obligatorio" }, { status: 400 });
  }

  const plainPassword = randomUUID().replace(/-/g, "").slice(0, 12);
  const password_hash = await bcrypt.hash(plainPassword, 10);

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("admin_users").insert({
    email,
    password_hash,
    role,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ email, password: plainPassword, role });
}
