"use client";

import { useCallback, useRef } from "react";
import { QrReader } from "react-qr-reader";
import type { Result } from "@zxing/library";

interface QRScannerProps {
  onScan: (value: string) => void;
}

export function QRScanner({ onScan }: QRScannerProps) {
  const lastValueRef = useRef<string | null>(null);

  const handleResult = useCallback(
    (result?: Result | null) => {
      const text = result?.getText?.();
      if (!text || lastValueRef.current === text) {
        return;
      }

      lastValueRef.current = text;
      onScan(text);
    },
    [onScan]
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-white/20 bg-black">
      <QrReader
        constraints={{ facingMode: "environment" }}
        onResult={(result) => handleResult(result)}
        videoStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
        containerStyle={{ width: "100%", aspectRatio: "1/1" }}
      />
    </div>
  );
}
