import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

type MemberSelectRow = {
  id: string;
  user_id: string;
  created_at: string | null;
  user?: { email?: string | null } | Array<{ email?: string | null }> | null;
};

function getUserEmail(value: MemberSelectRow["user"]) {
  if (!value) return null;
  const record = Array.isArray(value) ? value[0] : value;
  return record?.email ?? null;
}

async function assertOwner(memorialId: string, userId: string) {
  const supabase = createSupabaseServerClient();
  const { data: memorial, error } = await supabase
    .from("memorials")
    .select("id, owner_id")
    .eq("id", memorialId)
    .maybeSingle();

  if (error || !memorial) {
    return { ok: false as const, status: 404, message: "Memorial no encontrado" };
  }
  if (memorial.owner_id !== userId) {
    return { ok: false as const, status: 403, message: "No tienes permisos para administrar este memorial" };
  }

  return { ok: true as const };
}

export async function GET(_req: NextRequest, context: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (session.user.role === "admin") {
    return NextResponse.json({ error: "Acceso restringido" }, { status: 403 });
  }

  const resolvedParams = await Promise.resolve(context.params);
  const memorialId = resolvedParams?.id;
  if (!memorialId) {
    return NextResponse.json({ error: "Memorial no encontrado" }, { status: 404 });
  }

  const ownerCheck = await assertOwner(memorialId, session.user.id);
  if (!ownerCheck.ok) {
    return NextResponse.json({ error: ownerCheck.message }, { status: ownerCheck.status });
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("memorial_members")
    .select("id, user_id, created_at, user:admin_users(id, email)")
    .eq("memorial_id", memorialId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as MemberSelectRow[];
  const members = rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    email: getUserEmail(row.user) ?? "—",
    createdAt: row.created_at ?? null,
  }));

  return NextResponse.json({ members });
}

type AddMemberBody = { email?: string };

export async function POST(req: NextRequest, context: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (session.user.role === "admin") {
    return NextResponse.json({ error: "Acceso restringido" }, { status: 403 });
  }

  const resolvedParams = await Promise.resolve(context.params);
  const memorialId = resolvedParams?.id;
  if (!memorialId) {
    return NextResponse.json({ error: "Memorial no encontrado" }, { status: 404 });
  }

  const ownerCheck = await assertOwner(memorialId, session.user.id);
  if (!ownerCheck.ok) {
    return NextResponse.json({ error: ownerCheck.message }, { status: ownerCheck.status });
  }

  const body = (await req.json().catch(() => ({}))) as AddMemberBody;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || !emailRegex.test(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  const service = (() => {
    try {
      return createSupabaseServiceClient();
    } catch {
      return createSupabaseServerClient();
    }
  })();
  const { data: existing, error: lookupError } = await service
    .from("admin_users")
    .select("id, email, role")
    .eq("email", email)
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json({ error: lookupError.message }, { status: 500 });
  }

  let userId = existing?.id as string | undefined;
  let tempPassword: string | null = null;

  if (!userId) {
    tempPassword = randomUUID().replace(/-/g, "").slice(0, 12);
    const password_hash = await bcrypt.hash(tempPassword, 10);
    const { data: created, error: createError } = await service
      .from("admin_users")
      .insert({ email, role: "owner", password_hash })
      .select("id")
      .maybeSingle();
    if (createError || !created?.id) {
      return NextResponse.json({ error: createError?.message || "No se pudo crear el usuario" }, { status: 500 });
    }
    userId = created.id as string;
  }

  const { error: memberError } = await service.from("memorial_members").insert({
    memorial_id: memorialId,
    user_id: userId,
    added_by: session.user.id,
  });

  if (memberError) {
    if (memberError.message.toLowerCase().includes("duplicate") || memberError.message.toLowerCase().includes("unique")) {
      return NextResponse.json({ error: "Ese usuario ya está agregado" }, { status: 409 });
    }
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  return NextResponse.json({
    member: { userId, email },
    tempPassword,
  });
}

type RemoveMemberBody = { userId?: string };

export async function DELETE(req: NextRequest, context: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (session.user.role === "admin") {
    return NextResponse.json({ error: "Acceso restringido" }, { status: 403 });
  }

  const resolvedParams = await Promise.resolve(context.params);
  const memorialId = resolvedParams?.id;
  if (!memorialId) {
    return NextResponse.json({ error: "Memorial no encontrado" }, { status: 404 });
  }

  const ownerCheck = await assertOwner(memorialId, session.user.id);
  if (!ownerCheck.ok) {
    return NextResponse.json({ error: ownerCheck.message }, { status: ownerCheck.status });
  }

  const body = (await req.json().catch(() => ({}))) as RemoveMemberBody;
  const userId = typeof body.userId === "string" ? body.userId.trim() : "";
  if (!userId) {
    return NextResponse.json({ error: "userId es requerido" }, { status: 400 });
  }

  const service = (() => {
    try {
      return createSupabaseServiceClient();
    } catch {
      return createSupabaseServerClient();
    }
  })();
  const { error } = await service
    .from("memorial_members")
    .delete()
    .eq("memorial_id", memorialId)
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
