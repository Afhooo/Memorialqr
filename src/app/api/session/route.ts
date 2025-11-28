import { NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  USER_ID_COOKIE,
  COOKIE_MAX_AGE,
} from "@/lib/constants";

const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge,
});

export async function POST(req: Request) {
  const { accessToken, refreshToken, expiresIn, userId } = await req.json();

  if (!accessToken) {
    return NextResponse.json({ error: "Missing access token" }, { status: 400 });
  }

  const maxAge = typeof expiresIn === "number" && expiresIn > 0 ? expiresIn : COOKIE_MAX_AGE;
  const response = NextResponse.json({ ok: true });

  response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, cookieOptions(maxAge));

  if (refreshToken) {
    response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, cookieOptions(maxAge));
  }

  if (userId) {
    response.cookies.set(USER_ID_COOKIE, userId, cookieOptions(maxAge));
  }

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(ACCESS_TOKEN_COOKIE, { path: "/" });
  response.cookies.delete(REFRESH_TOKEN_COOKIE, { path: "/" });
  response.cookies.delete(USER_ID_COOKIE, { path: "/" });

  return response;
}
