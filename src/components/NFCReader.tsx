"use client";

import { useCallback, useState } from "react";

type NFCStatus = "idle" | "unsupported" | "reading" | "success" | "error";

interface NFCReaderProps {
  onRead: (value: string) => void;
}

const statusLabel: Record<NFCStatus, string> = {
  idle: "Listo para leer",
  unsupported: "NFC no soportado",
  reading: "Escanando etiqueta",
  success: "Lectura exitosa",
  error: "Error al leer",
};

export function NFCReader({ onRead }: NFCReaderProps) {
  const [status, setStatus] = useState<NFCStatus>("idle");
  const [message, setMessage] = useState<string>("");

  const handleNFC = useCallback(async () => {
    if (typeof window === "undefined") {
      return;
    }

    const readerCtor = (window as typeof window & {
      NDEFReader?: typeof window["NDEFReader"];
    }).NDEFReader;

    if (!readerCtor) {
      setStatus("unsupported");
      setMessage("El navegador no soporta NFC.");
      return;
    }

    try {
      setStatus("reading");
      setMessage("Acerca un tag NFC al dispositivo.");

      const reader = new readerCtor();
      await reader.scan();

      reader.onreading = (event: NDEFReadingEvent) => {
        const record = event.message.records[0];
        if (!record) {
          setStatus("error");
          setMessage("El tag no contiene datos legibles.");
          return;
        }

        let payload = "";
        if (record.recordType === "text") {
          const decoder = new TextDecoder(record.encoding || "utf-8");
          payload = decoder.decode(record.data);
        } else if (record.data) {
          payload = new TextDecoder().decode(record.data);
        }

        const trimmed = payload.trim();
        if (!trimmed) {
          setStatus("error");
          setMessage("El tag no tiene texto válido.");
          return;
        }

        setStatus("success");
        setMessage("Redirigiendo...");
        onRead(trimmed);
      };

      reader.onreadingerror = () => {
        setStatus("error");
        setMessage("No se pudo leer el tag NFC.");
      };
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Error desconocido");
    }
  }, [onRead]);

  return (
    <div className="rounded-2xl border border-white/20 bg-white/5 p-4 text-sm leading-relaxed">
      <p className="text-sm font-semibold text-white">NFC</p>
      <p className="text-xs text-white/70">{statusLabel[status]}</p>
      {message && <p className="mt-2 text-xs text-white/70">{message}</p>}
      <button
        onClick={handleNFC}
        type="button"
        className="mt-4 w-full rounded-full bg-white/20 py-2 text-center text-sm font-semibold text-white transition hover:bg-white/30"
      >
        {status === "reading" ? "Escaneando" : "Leer NFC"}
      </button>
    </div>
  );
}
