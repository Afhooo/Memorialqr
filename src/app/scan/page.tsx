import { redirect } from "next/navigation";
import { resolveToken } from "@/lib/resolveToken";
import { ScanClient } from "./ScanClient";

export default async function ScanPage({
  searchParams,
}: {
  searchParams?: { token?: string };
}) {
  const token = searchParams?.token;
  if (token) {
    const memorialId = await resolveToken(token);
    if (memorialId) {
      redirect(`/memorial/${memorialId}`);
    }
  }

  return (
    <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">Escaneo</p>
        <h1 className="text-3xl font-semibold text-white">Escanea un QR o NFC</h1>
        <p className="text-sm text-white/70">
          Puedes usar el lector QR o llevar tu dispositivo a un tag NFC para acceder a un memorial específico.
        </p>
      </header>
      <ScanClient />
    </div>
  );
}
