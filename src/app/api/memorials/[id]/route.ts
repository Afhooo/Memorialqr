import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";

type PatchBody = {
  facebookUrl?: string | null;
  instagramUrl?: string | null;
};

function normalizeExternalUrl(value: string | null | undefined) {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export async function PATCH(req: NextRequest, context: { params: { id: string } } | { params: Promise<{ id: string }> }) {
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

  const body = (await req.json().catch(() => ({}))) as PatchBody;
  const facebookUrl = normalizeExternalUrl(body.facebookUrl ?? null);
  const instagramUrl = normalizeExternalUrl(body.instagramUrl ?? null);

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
    return NextResponse.json({ error: "No tienes permisos para editar este memorial" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("memorials")
    .update({
      facebook_url: facebookUrl,
      instagram_url: instagramUrl,
    })
    .eq("id", memorialId)
    .select("id, facebook_url, instagram_url")
    .maybeSingle();

  if (error) {
    const message = error.message || "No pudimos guardar los cambios";
    if (message.toLowerCase().includes("facebook_url") || message.toLowerCase().includes("instagram_url")) {
      return NextResponse.json(
        {
          error:
            "Falta actualizar la base de datos (facebook_url / instagram_url). Ejecuta `supabase-setup-real.sql` en Supabase y vuelve a intentar.",
        },
        { status: 500 },
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ memorial: data });
}

