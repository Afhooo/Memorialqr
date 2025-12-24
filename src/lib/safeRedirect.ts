const PUBLIC_PREFIXES = ["/", "/beneficios", "/login"];
const OWNER_PREFIXES = ["/elige-perfil", "/panel", "/crear-memorial", "/memorial", "/scan"];
const ADMIN_PREFIXES = ["/admin"];

const isPathMatch = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

function isSafeInternalPath(path: string) {
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path.includes("\\") || path.includes("\n") || path.includes("\r")) return false;
  return true;
}

export function getSafeRedirectPath(options: {
  requested?: string | null;
  role?: string | null;
  fallback: string;
}) {
  const requested = options.requested?.trim();
  if (!requested) return options.fallback;
  if (!isSafeInternalPath(requested)) return options.fallback;

  if (isPathMatch(requested, PUBLIC_PREFIXES)) return requested;

  if (options.role === "admin") {
    return isPathMatch(requested, ADMIN_PREFIXES) ? requested : options.fallback;
  }

  if (options.role === "owner") {
    return isPathMatch(requested, OWNER_PREFIXES) ? requested : options.fallback;
  }

  return options.fallback;
}
