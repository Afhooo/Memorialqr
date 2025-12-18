import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";
import {
  buildMemorialUploadPath,
  buildUserUploadPath,
  isAllowedUploadContentType,
  MEMORIAL_MEDIA_BUCKET,
} from "@/lib/storage";

export const dynamic = "force-dynamic";

const MAX_BYTES = 25 * 1024 * 1024; // 25MB

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "Formulario inválido" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
  }

  if (!isAllowedUploadContentType(file.type)) {
    return NextResponse.json({ error: `Tipo de archivo no permitido: ${file.type || "desconocido"}` }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: `Archivo muy grande (máx ${Math.round(MAX_BYTES / (1024 * 1024))}MB)` }, { status: 400 });
  }

  const kindRaw = form.get("kind");
  const kind = typeof kindRaw === "string" && kindRaw.trim() ? kindRaw.trim() : "media";

  const memorialIdRaw = form.get("memorialId");
  const memorialId = typeof memorialIdRaw === "string" && memorialIdRaw.trim() ? memorialIdRaw.trim() : null;

  const supabase = createSupabaseServiceClient();

  if (memorialId && session.user.role !== "admin") {
    const { data: memorial, error } = await supabase
      .from("memorials")
      .select("id, owner_id")
      .eq("id", memorialId)
      .maybeSingle();

    if (error || !memorial) {
      return NextResponse.json({ error: "Memorial no encontrado" }, { status: 404 });
    }

    if (memorial.owner_id !== session.user.id) {
      return NextResponse.json({ error: "No tienes permisos para subir archivos a este memorial" }, { status: 403 });
    }
  }

  const path = memorialId
    ? buildMemorialUploadPath({ memorialId, kind, filename: file.name, contentType: file.type })
    : buildUserUploadPath({ userId: session.user.id, kind, filename: file.name, contentType: file.type });

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage.from(MEMORIAL_MEDIA_BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
    cacheControl: "3600",
  });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: signed, error: signedError } = await supabase.storage
    .from(MEMORIAL_MEDIA_BUCKET)
    .createSignedUrl(path, 60 * 60);

  if (signedError || !signed?.signedUrl) {
    return NextResponse.json(
      { error: signedError?.message || "No pudimos generar URL firmada" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    bucketId: MEMORIAL_MEDIA_BUCKET,
    path,
    signedUrl: signed.signedUrl,
    contentType: file.type,
    size: file.size,
  });
}

