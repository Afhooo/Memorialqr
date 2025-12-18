import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";

type CreateCustomerBody = {
  email?: string;
  role?: string;
  password?: string | null;
  createOrder?: boolean;
  channel?: string;
  amountCents?: number | null;
  currency?: string | null;
  externalRef?: string | null;
  attachDemoMemorial?: boolean;
};

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as CreateCustomerBody;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const role = typeof body.role === "string" && body.role.trim() ? body.role.trim() : "owner";
  const passwordOverride = typeof body.password === "string" && body.password.trim() ? body.password.trim() : null;
  const createOrder = Boolean(body.createOrder);
  const channel = typeof body.channel === "string" ? body.channel.trim().slice(0, 80) : "presencial";
  const currency = typeof body.currency === "string" && body.currency.trim() ? body.currency.trim().slice(0, 8) : "CLP";
  const externalRef = typeof body.externalRef === "string" && body.externalRef.trim() ? body.externalRef.trim().slice(0, 120) : null;
  const amountCents = typeof body.amountCents === "number" && Number.isFinite(body.amountCents) ? Math.round(body.amountCents) : null;
  const attachDemoMemorial = Boolean(body.attachDemoMemorial);

  if (!email) {
    return NextResponse.json({ error: "El correo es obligatorio" }, { status: 400 });
  }

  if (passwordOverride && passwordOverride.length < 8) {
    return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 });
  }

  const supabase = createSupabaseServiceClient();

  const { data: existing, error: existingError } = await supabase
    .from("admin_users")
    .select("id, email, role")
    .eq("email", email)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  let user = existing as { id: string; email: string; role: string } | null;
  let plainPassword: string | null = null;

  if (!user) {
    plainPassword = passwordOverride ?? randomUUID().replace(/-/g, "").slice(0, 12);
    const password_hash = await bcrypt.hash(plainPassword, 10);
    const { data: inserted, error: insertError } = await supabase
      .from("admin_users")
      .insert({ email, role, password_hash })
      .select("id, email, role")
      .maybeSingle();

    if (insertError || !inserted) {
      return NextResponse.json({ error: insertError?.message || "No se pudo crear el usuario" }, { status: 500 });
    }
    user = inserted;
  } else if (passwordOverride) {
    const password_hash = await bcrypt.hash(passwordOverride, 10);
    const { error: updateError } = await supabase
      .from("admin_users")
      .update({ password_hash })
      .eq("id", user.id);
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    plainPassword = passwordOverride;
  }

  let order: { id: string; channel: string; status: string } | null = null;
  if (createOrder) {
    const { data: insertedOrder, error: orderError } = await supabase
      .from("sales_orders")
      .insert({
        buyer_id: user.id,
        channel,
        status: "paid",
        amount_cents: amountCents,
        currency,
        external_ref: externalRef,
      })
      .select("id, channel, status")
      .maybeSingle();

    if (orderError || !insertedOrder) {
      return NextResponse.json({ error: orderError?.message || "No se pudo registrar la compra" }, { status: 500 });
    }
    order = insertedOrder;
  }

  let memorialId: string | null = null;

  if (attachDemoMemorial) {
    const { data: existingMemorial, error: memorialLookupError } = await supabase
      .from("memorials")
      .select("id")
      .eq("owner_id", user.id)
      .ilike("name", "pablo neruda")
      .maybeSingle();

    if (memorialLookupError) {
      return NextResponse.json({ error: memorialLookupError.message }, { status: 500 });
    }

    if (existingMemorial?.id) {
      memorialId = existingMemorial.id;
    } else {
      memorialId = randomUUID();
      const { error: insertMemorialError } = await supabase.from("memorials").insert({
        id: memorialId,
        owner_id: user.id,
        name: "Pablo Neruda",
        description: "Memorial de ejemplo asociado al cliente para demo comercial y QA.",
        birth_date: "1904-07-12",
        death_date: "1973-09-23",
      });

      if (insertMemorialError) {
        return NextResponse.json({ error: insertMemorialError.message }, { status: 500 });
      }

      await supabase.from("memories").insert([
        {
          id: randomUUID(),
          memorial_id: memorialId,
          title: "Bienvenida",
          content: "Este memorial fue creado por el equipo para que el cliente lo administre y agregue recuerdos.",
          media_url: null,
          created_at: new Date().toISOString(),
        },
      ]);
    }
  }

  return NextResponse.json({ user, password: plainPassword, order, memorialId });
}
