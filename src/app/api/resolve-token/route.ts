import { NextResponse } from "next/server";
import { resolveToken } from "@/lib/resolveToken";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Se requiere un token" }, { status: 400 });
  }

  const memorialId = await resolveToken(token);

  if (!memorialId) {
    return NextResponse.json({ error: "Token inválido" }, { status: 404 });
  }

  return NextResponse.json({ memorialId });
}
