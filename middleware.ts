import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { AUTH_TOKEN_COOKIE } from "./src/lib/constants";

const PUBLIC_PATHS = ["/", "/beneficios", "/login"];
const PUBLIC_API_PATHS = ["/api/auth/login", "/api/session", "/api/resolve-token"];
const OWNER_PATH_PREFIXES = ["/panel", "/crear-memorial", "/memorial", "/scan"];
const ADMIN_PATH_PREFIXES = ["/admin"];

const isPathMatch = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/static") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  // Permitir archivos estáticos (imágenes, videos, fuentes, etc.)
  if (/\.[^/]+$/.test(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    if (isPathMatch(pathname, PUBLIC_API_PATHS)) {
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("from", pathname);

  const isPublicRoute = isPathMatch(pathname, PUBLIC_PATHS);

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("sessions")
    .select("token, expires_at, admin_user:admin_users(id, email, role)")
    .eq("token", token)
    .gte("expires_at", new Date().toISOString())
    .maybeSingle();

  const user = Array.isArray(data?.admin_user) ? data?.admin_user?.[0] : data?.admin_user;
  const role = user?.role;

  if (!data || !user) {
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(AUTH_TOKEN_COOKIE);
    return response;
  }

  const isAdminRoute = isPathMatch(pathname, ADMIN_PATH_PREFIXES);
  if (isAdminRoute && role !== "admin") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/elige-perfil";
    redirectUrl.searchParams.set("denied", "admin");
    redirectUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  const isOwnerRoute = isPathMatch(pathname, OWNER_PATH_PREFIXES) && !isAdminRoute;
  if (isOwnerRoute && role !== "owner") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = role === "admin" ? "/admin" : "/elige-perfil";
    if (role !== "admin") {
      redirectUrl.searchParams.set("denied", "owner");
      redirectUrl.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
