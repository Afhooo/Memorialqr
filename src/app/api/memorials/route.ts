import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
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
  firstMemory?: {
    title?: string;
    content?: string;
    mediaUrl?: string | null;
  };
  gallery?: Array<{
    title?: string;
    content?: string;
    mediaUrl?: string;
  }>;
};

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as CreateMemorialBody;

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const description =
    typeof body.description === "string" ? body.description.trim().slice(0, 1200) : null;
  const birthDate = typeof body.birthDate === "string" ? body.birthDate.slice(0, 32) : null;
  const deathDate = typeof body.deathDate === "string" ? body.deathDate.slice(0, 32) : null;

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
    const mediaUrl = firstMemory?.mediaUrl?.trim() || null;

    await supabase.from("memories").insert({
      id: randomUUID(),
      memorial_id: memorialId,
      title,
      content,
      media_url: mediaUrl,
      created_at: new Date().toISOString(),
    });
  }

  const gallery = Array.isArray(body.gallery) ? body.gallery : [];
  const galleryPayload = gallery
    .map((item) => ({
      title: item.title?.trim() || "Recuerdo",
      content: item.content?.trim() || "",
      mediaUrl: item.mediaUrl?.trim() || "",
    }))
    .filter((item) => item.mediaUrl || item.content);

  if (galleryPayload.length) {
    const galleryRows = galleryPayload.map((item) => ({
      id: randomUUID(),
      memorial_id: memorialId,
      title: item.title,
      content: item.content,
      media_url: item.mediaUrl || null,
      created_at: new Date().toISOString(),
    }));
    await supabase.from("memories").insert(galleryRows);
  }

  return NextResponse.json({ memorialId });
}
