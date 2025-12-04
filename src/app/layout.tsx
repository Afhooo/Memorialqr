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
  title: "Memento",
  description: "Un espacio editorial para crear memoriales digitales",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="es">
      <body
        className={`${montserrat.variable} ${geistMono.variable} bg-[#f5f5f5] text-[#333333] antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <header className="relative border-b border-white/10 bg-[#333333] px-6 py-6 shadow-[0_16px_50px_rgba(0,0,0,0.35)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(76,175,80,0.18),transparent_36%),radial-gradient(circle_at_82%_0%,rgba(232,116,34,0.16),transparent_30%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e87422] to-transparent" />
            <div className="relative mx-auto flex max-w-5xl flex-nowrap items-center gap-4 justify-between text-white">
              <Link
                href="/"
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:text-[#e87422]"
              >
                <span className="h-2 w-2 rounded-full bg-gradient-to-br from-[#e87422] to-[#ff9800]" />
                Memento
              </Link>
              <nav className="flex flex-nowrap items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/80">
                <Link
                  href="/#principal"
                  className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white"
                >
                  Principal
                </Link>
                <Link
                  href="/#crear"
                  className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white"
                >
                  Crear memorial
                </Link>
                <Link
                  href="/#inventario"
                  className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white"
                >
                  Explorar memoriales
                </Link>
                <Link
                  href="/beneficios"
                  className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white"
                >
                  Beneficios
                </Link>
              </nav>
              <div className="ml-auto flex items-center gap-3">
                <AuthActions userEmail={session?.user?.email ?? null} />
              </div>
            </div>
          </header>
          <main className="flex-1 px-6 pt-0 pb-10 text-[#333333]">
            <div className="mx-auto w-full max-w-5xl">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
