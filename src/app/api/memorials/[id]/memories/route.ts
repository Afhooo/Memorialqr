import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";

export async function POST(req: NextRequest, context: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Inicia sesión para dejar un mensaje" }, { status: 401 });
  }
  if (session.user.role === "admin") {
    return NextResponse.json({ error: "Acceso restringido" }, { status: 403 });
  }

  const resolvedParams = await Promise.resolve(context.params);
  const memorialId = resolvedParams?.id;
  if (!memorialId) {
    return NextResponse.json({ error: "Memorial no encontrado" }, { status: 404 });
  }
  const body = await req.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const mediaPath = typeof body.mediaPath === "string" ? body.mediaPath.trim().slice(0, 600) : null;
  const mediaUrl = typeof body.mediaUrl === "string" ? body.mediaUrl.trim().slice(0, 2000) : null;

  if (!content && !mediaPath && !mediaUrl) {
    return NextResponse.json({ error: "Escribe un mensaje o adjunta una foto/video" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();

  const { data: memorial, error: memorialError } = await supabase
    .from("memorials")
    .select("id, owner_id")
    .eq("id", memorialId)
    .maybeSingle();

  if (memorialError || !memorial) {
    return NextResponse.json({ error: "Memorial no encontrado" }, { status: 404 });
  }

  const isOwner = memorial.owner_id === session.user.id;
  if (!isOwner) {
    const { data: membership } = await supabase
      .from("memorial_members")
      .select("id")
      .eq("memorial_id", memorialId)
      .eq("user_id", session.user.id)
      .maybeSingle();
    if (!membership?.id) {
      return NextResponse.json({ error: "No tienes permisos para modificar este memorial" }, { status: 403 });
    }
  }

  if (mediaPath && !mediaPath.startsWith(`memorials/${memorialId}/`)) {
    return NextResponse.json({ error: "Archivo adjunto inválido" }, { status: 400 });
  }

  const payload = {
    id: randomUUID(),
    memorial_id: memorialId,
    title: title || "Mensaje",
    content,
    media_url: mediaPath ? null : mediaUrl,
    media_path: mediaPath,
    created_at: new Date().toISOString(),
  };

  const { data, error: insertError } = await supabase.from("memories").insert(payload).select().maybeSingle();
  if (insertError || !data) {
    return NextResponse.json({ error: insertError?.message || "No pudimos guardar el mensaje" }, { status: 500 });
  }

  return NextResponse.json({ memory: data });
}
