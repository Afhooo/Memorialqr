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
  title: "Memorial App",
  description: "Un espacio para revisar memorias dentro de un memorial",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-slate-950 text-white`}>
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-white/10 bg-slate-950/80 px-6 py-4 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
              <Link href="/" className="text-lg font-semibold tracking-wide text-white">
                Memoriales
              </Link>
              <div className="flex items-center gap-4 text-sm">
                <Link
                  href="/scan"
                  className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:border-white/60"
                >
                  Escanear
                </Link>
                <AuthActions userEmail={session?.user?.email ?? null} />
              </div>
            </div>
          </header>
          <main className="flex-1 px-6 py-8">
            <div className="mx-auto w-full max-w-5xl">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
