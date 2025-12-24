import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { getServerSession } from "@/lib/serverSession";
import { AuthActions } from "@/components/AuthActions";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-primary",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Recuerdame",
  description: "Un espacio editorial para crear memoriales digitales",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();
  const role = session?.user?.role ?? null;
  const isAdmin = role === "admin";
  const hasSession = Boolean(session);
  const navItems = [
    { href: "/crear-memorial", label: "Crear memorial", show: hasSession && !isAdmin },
    { href: "/panel", label: "Panel", show: hasSession && !isAdmin },
    { href: "/memorial", label: "Memorial", show: hasSession && !isAdmin },
    { href: "/admin", label: "Dashboard", show: hasSession && isAdmin },
    { href: "/admin/usuarios", label: "Usuarios", show: hasSession && isAdmin },
    { href: "/beneficios", label: "Cómo funciona", show: true },
  ].filter((item) => item.show);

  return (
    <html lang="es">
      <body
        className={`${montserrat.variable} ${geistMono.variable} bg-[#f5f5f5] text-[#333333] antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <header className="relative border-b border-white/10 bg-[#333333] px-4 py-5 shadow-[0_16px_50px_rgba(0,0,0,0.35)] sm:px-6 sm:py-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(76,175,80,0.18),transparent_36%),radial-gradient(circle_at_82%_0%,rgba(232,116,34,0.16),transparent_30%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
            <div className="relative mx-auto flex w-full max-w-5xl min-w-0 flex-col gap-3 text-white sm:flex-row sm:items-center sm:gap-4">
              <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-start">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:text-[#e87422]"
                >
                  <span className="h-2 w-2 rounded-full bg-gradient-to-br from-[#e87422] to-[#ff9800]" />
                  Recuerdame
                </Link>
                <div className="sm:hidden">
                  <AuthActions userEmail={session?.user?.email ?? null} userRole={session?.user?.role ?? null} />
                </div>
              </div>

              <nav className="flex w-full min-w-0 flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-white/80 sm:w-auto sm:flex-1 sm:justify-center sm:text-[11px] sm:tracking-[0.22em]">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="hidden items-center gap-3 sm:flex">
                <AuthActions userEmail={session?.user?.email ?? null} userRole={session?.user?.role ?? null} />
              </div>
            </div>
          </header>
          <main className="flex-1 px-4 pt-0 pb-10 text-[#333333] sm:px-6">
            <div className="mx-auto w-full max-w-[1680px] min-w-0 lg:px-2 xl:px-4">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
