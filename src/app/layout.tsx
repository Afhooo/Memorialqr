import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Geist_Mono, Montserrat } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { getServerSession } from "@/lib/serverSession";
import { AuthActions } from "@/components/AuthActions";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans-primary",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif-primary",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Recuerdame | Homenajes Digitales",
  description: "Un espacio premium y seguro para crear memoriales digitales para tus seres queridos.",
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
    { href: "/crear-memorial", label: "Nuevo Volumen", show: hasSession && !isAdmin },
    { href: "/panel", label: "Archivo", show: hasSession && !isAdmin },
  ].filter((item) => item.show);

  return (
    <html lang="es">
      <body
        className={`${montserrat.variable} ${playfair.variable} ${geistMono.variable} bg-[#fdfdfd] text-slate-900 antialiased selection:bg-amber-100 selection:text-amber-900`}
      >
        <div className="flex min-h-screen flex-col">
          {/* Light Frosted Topbar */}
          <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
            <div className="mx-auto flex w-full h-16 max-w-7xl items-center justify-between px-6 sm:px-12">
              <Link
                href="/"
                className="group flex items-center gap-3 text-[11px] font-semibold tracking-widest text-slate-900 transition hover:text-amber-700"
              >
                <div className="h-2 w-2 rounded-sm bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_8px_rgba(251,191,36,0.5)] transition-transform group-hover:scale-110" />
                <span className="uppercase tracking-[0.25em]">Recuerdame</span>
              </Link>

              <nav className="flex items-center gap-6 text-[10px] font-semibold tracking-widest uppercase text-slate-500 hidden sm:flex">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="transition hover:text-slate-900"
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="ml-2 pl-6 border-l border-slate-200/70">
                  <AuthActions userEmail={session?.user?.email ?? null} userRole={session?.user?.role ?? null} />
                </div>
              </nav>

              <div className="sm:hidden flex items-center">
                <AuthActions userEmail={session?.user?.email ?? null} userRole={session?.user?.role ?? null} />
              </div>
            </div>
          </header>

          <main className="flex-1 w-full flex flex-col relative z-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
