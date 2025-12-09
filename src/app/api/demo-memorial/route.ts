import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Necesitas iniciar sesión para crear un memorial" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const name =
    typeof body.name === "string" && body.name.trim()
      ? body.name.trim().slice(0, 120)
      : "Memorial sin título";

  const supabase = createSupabaseServerClient();
  const memorialId = randomUUID();
  const now = new Date();

  const memorialPayload = {
    id: memorialId,
    owner_id: session.user.id,
    name,
    birth_date: "1950-06-12",
    death_date: "2024-02-02",
    description:
      "Espacio de ejemplo para mostrar cómo se ve un memorial en marcha: datos básicos, obituario, condolencias y símbolos digitales. Luego podrás ajustarlo a la historia real.",
  };

  const { error: memorialError } = await supabase.from("memorials").insert(memorialPayload);
  if (memorialError) {
    return NextResponse.json({ error: memorialError.message }, { status: 500 });
  }

  const sampleMemories = [
    {
      id: randomUUID(),
      memorial_id: memorialId,
      title: "Obituario editorial",
      content: "Texto inicial del perfil, editable. Incluye contexto, hitos y deseos de la familia.",
      media_url: null,
      created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    },
    {
      id: randomUUID(),
      memorial_id: memorialId,
      title: "Condolencia moderada",
      content: "Mensaje de prueba que simula lo que ve la familia tras aprobar cada aporte.",
      media_url: null,
      created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
    {
      id: randomUUID(),
      memorial_id: memorialId,
      title: "Foto o recuerdo visual",
      content: "Espacio para una imagen o video. Puedes editarlo luego desde el mismo memorial.",
      media_url: null,
      created_at: now.toISOString(),
    },
  ];

  await supabase.from("memories").insert(sampleMemories);

  return NextResponse.json({ memorialId });
}
