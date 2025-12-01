import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { AUTH_TOKEN_COOKIE } from "./src/lib/constants";

const PUBLIC_PATHS = ["/login", "/scan", "/api/auth/login", "/api/session", "/api/resolve-token"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/static") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("from", pathname);

  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("sessions")
    .select("token")
    .eq("token", token)
    .gte("expires_at", new Date().toISOString())
    .maybeSingle();

  if (!data) {
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(AUTH_TOKEN_COOKIE);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
