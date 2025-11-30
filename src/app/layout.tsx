import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getServerSession } from "@/lib/serverSession";
import { AuthActions } from "@/components/AuthActions";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
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
        className={`${geistSans.variable} ${geistMono.variable} bg-[#fef9f2] text-[#2f261f] antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <header className="relative border-b border-[#cfd8e3] bg-gradient-to-r from-[#e8f0f7] via-[#f3f6fb] to-[#eef4fa] px-6 py-6 shadow-[0_18px_60px_rgba(0,0,0,0.05)] backdrop-blur">
            <div className="pointer-events-none absolute left-[-18%] top-[-60%] h-48 w-48 rounded-full bg-[#7aa2b7]/22 blur-[140px]" />
            <div className="pointer-events-none absolute right-[-18%] bottom-[-50%] h-48 w-48 rounded-full bg-[#d7c4a8]/18 blur-[140px]" />
            <div className="relative mx-auto flex max-w-3xl flex-nowrap items-center gap-3 justify-between">
              <Link
                href="/"
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1720] transition hover:text-[#0ea5e9]"
              >
                <span className="h-2 w-2 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6]" />
                Memento
              </Link>
              <nav className="flex flex-nowrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#1f2a36]">
                <Link
                  href="/#principal"
                  className="rounded-full px-4 py-2 transition hover:bg-[#dfe9f4] hover:text-[#0f1720]"
                >
                  Principal
                </Link>
                <Link
                  href="/#crear"
                  className="rounded-full px-4 py-2 transition hover:bg-[#dfe9f4] hover:text-[#0f1720]"
                >
                  Crear memorial
                </Link>
                <Link
                  href="/#inventario"
                  className="rounded-full px-4 py-2 transition hover:bg-[#dfe9f4] hover:text-[#0f1720]"
                >
                  Explorar memoriales
                </Link>
                <Link
                  href="/beneficios"
                  className="rounded-full px-4 py-2 transition hover:bg-[#dfe9f4] hover:text-[#0f1720]"
                >
                  Beneficios
                </Link>
              </nav>
              <div className="ml-auto flex items-center gap-3">
                <AuthActions userEmail={session?.user?.email ?? null} />
              </div>
            </div>
          </header>
          <main className="flex-1 px-6 pt-0 pb-10 text-[#2f261f]">
            <div className="mx-auto w-full max-w-5xl">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
