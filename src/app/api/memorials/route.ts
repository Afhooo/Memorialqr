import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (session.user.role === "admin") {
    return NextResponse.json({ error: "Acceso restringido" }, { status: 403 });
  }

  const supabase = createSupabaseServerClient();
  const { data: memorials, error } = await supabase
    .from("memorials")
    .select("id, name, description, birth_date, death_date, owner_id")
    .eq("owner_id", session.user.id)
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ memorials: memorials ?? [] });
}

type CreateMemorialBody = {
  name?: string;
  description?: string;
  birthDate?: string;
  deathDate?: string;
  coverMediaUrl?: string | null;
  coverMediaPath?: string | null;
  avatarMediaUrl?: string | null;
  avatarMediaPath?: string | null;
  templateId?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  firstMemory?: {
    title?: string;
    content?: string;
    mediaUrl?: string | null;
    mediaPath?: string | null;
  };
  gallery?: Array<{
    title?: string;
    content?: string;
    mediaUrl?: string | null;
    mediaPath?: string | null;
  }>;
};

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (session.user.role === "admin") {
    return NextResponse.json({ error: "Acceso restringido" }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as CreateMemorialBody;

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const description =
    typeof body.description === "string" ? body.description.trim().slice(0, 1200) : null;
  const birthDate = typeof body.birthDate === "string" ? body.birthDate.slice(0, 32) : null;
  const deathDate = typeof body.deathDate === "string" ? body.deathDate.slice(0, 32) : null;
  const coverMediaUrl = typeof body.coverMediaUrl === "string" ? body.coverMediaUrl.trim().slice(0, 2000) : null;
  const coverMediaPath = typeof body.coverMediaPath === "string" ? body.coverMediaPath.trim().slice(0, 600) : null;
  const avatarMediaUrl = typeof body.avatarMediaUrl === "string" ? body.avatarMediaUrl.trim().slice(0, 2000) : null;
  const avatarMediaPath = typeof body.avatarMediaPath === "string" ? body.avatarMediaPath.trim().slice(0, 600) : null;
  const templateId = typeof body.templateId === "string" ? body.templateId.trim().slice(0, 64) : null;
  const facebookUrl = typeof body.facebookUrl === "string" ? body.facebookUrl.trim().slice(0, 2000) : null;
  const instagramUrl = typeof body.instagramUrl === "string" ? body.instagramUrl.trim().slice(0, 2000) : null;

  const normalizeExternalUrl = (value: string | null) => {
    if (!value) return null;
    try {
      const parsed = new URL(value);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
      return parsed.toString();
    } catch {
      return null;
    }
  };
  const safeFacebookUrl = normalizeExternalUrl(facebookUrl);
  const safeInstagramUrl = normalizeExternalUrl(instagramUrl);

  if (!name) {
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  }

  const memorialId = randomUUID();
  const supabase = createSupabaseServerClient();

  const { error: insertError } = await supabase.from("memorials").insert({
    id: memorialId,
    owner_id: session.user.id,
    name,
    description,
    birth_date: birthDate,
    death_date: deathDate,
    cover_media_url: coverMediaPath ? null : coverMediaUrl,
    cover_media_path: coverMediaPath,
    avatar_media_url: avatarMediaPath ? null : avatarMediaUrl,
    avatar_media_path: avatarMediaPath,
    template_id: templateId,
    facebook_url: safeFacebookUrl,
    instagram_url: safeInstagramUrl,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const firstMemory = body.firstMemory;
  const hasMemoryContent =
    firstMemory && (firstMemory.content?.trim() || firstMemory.mediaUrl?.trim() || firstMemory.title?.trim());

  if (hasMemoryContent) {
    const title = firstMemory?.title?.trim() || "Recuerdo";
    const content = firstMemory?.content?.trim() || "";
    const mediaPath = firstMemory?.mediaPath?.trim() || null;
    const mediaUrl = mediaPath ? null : firstMemory?.mediaUrl?.trim() || null;

    await supabase.from("memories").insert({
      id: randomUUID(),
      memorial_id: memorialId,
      title,
      content,
      media_url: mediaUrl,
      media_path: mediaPath,
      created_at: new Date().toISOString(),
    });
  }

  const gallery = Array.isArray(body.gallery) ? body.gallery : [];
  const galleryPayload = gallery
    .map((item) => ({
      title: item.title?.trim() || "Recuerdo",
      content: item.content?.trim() || "",
      mediaUrl: item.mediaUrl?.trim() || "",
      mediaPath: item.mediaPath?.trim() || "",
    }))
    .filter((item) => item.mediaUrl || item.mediaPath || item.content);

  if (galleryPayload.length) {
    const galleryRows = galleryPayload.map((item) => ({
      id: randomUUID(),
      memorial_id: memorialId,
      title: item.title,
      content: item.content,
      media_url: item.mediaPath ? null : item.mediaUrl || null,
      media_path: item.mediaPath || null,
      created_at: new Date().toISOString(),
    }));
    await supabase.from("memories").insert(galleryRows);
  }

  return NextResponse.json({ memorialId });
}
