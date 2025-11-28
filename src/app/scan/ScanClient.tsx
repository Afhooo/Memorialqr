"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { NFCReader } from "@/components/NFCReader";
import { QRScanner } from "@/components/QRScanner";

type ScanState = {
  status: string | null;
  error: string | null;
};

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function resolveValue(text: string) {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("Valor vacío");
  }

  const match = trimmed.match(uuidRegex);
  if (match) {
    return match[0];
  }

  const queryPart = trimmed.split("?").pop() ?? trimmed;
  const tokenParam = trimmed.includes("token=")
    ? new URLSearchParams(queryPart).get("token") ?? trimmed
    : trimmed;

  const response = await fetch(`/api/resolve-token?token=${encodeURIComponent(tokenParam)}`, {
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error ?? "No fue posible resolver el token");
  }

  if (!payload?.memorialId) {
    throw new Error("Token inválido");
  }

  return payload.memorialId as string;
}

export function ScanClient() {
  const router = useRouter();
  const [state, setState] = useState<ScanState>({ status: null, error: null });
  const lastValue = useRef<string>();

  const handleResult = useCallback(
    async (value: string) => {
      if (lastValue.current === value) {
        return;
      }

      lastValue.current = value;
      setState({ status: "Validando resultado...", error: null });

      try {
        const memorialId = await resolveValue(value);
        setState({ status: "Redirigiendo...", error: null });
        router.replace(`/memorial/${memorialId}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : "No fue posible resolver el código";
        setState({ status: null, error: message });
      }
    },
    [router]
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">QR</p>
        <QRScanner onScan={handleResult} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">NFC</p>
        <NFCReader onRead={handleResult} />
      </div>
      {state.status && <p className="text-xs text-white/60">{state.status}</p>}
      {state.error && <p className="text-xs text-red-400">{state.error}</p>}
    </div>
  );
}
