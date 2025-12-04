import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Inicia sesión para dejar un mensaje" }, { status: 401 });
  }

  const memorialId = params.id;
  const body = await req.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";

  if (!content) {
    return NextResponse.json({ error: "El mensaje no puede estar vacío" }, { status: 400 });
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

  if (memorial.owner_id !== session.user.id) {
    return NextResponse.json({ error: "No tienes permisos para modificar este memorial" }, { status: 403 });
  }

  const payload = {
    id: randomUUID(),
    memorial_id: memorialId,
    title: title || "Mensaje",
    content,
    media_url: null,
    created_at: new Date().toISOString(),
  };

  const { data, error: insertError } = await supabase.from("memories").insert(payload).select().maybeSingle();
  if (insertError || !data) {
    return NextResponse.json({ error: insertError?.message || "No pudimos guardar el mensaje" }, { status: 500 });
  }

  return NextResponse.json({ memory: data });
}
