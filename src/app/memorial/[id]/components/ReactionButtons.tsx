"use client";

import { useState, useTransition } from "react";
import { IconCandle, IconHeart, IconRepeat } from "./Icons";

type ReactionButtonsProps = {
  presetLove?: number;
  presetCandle?: number;
  presetShare?: number;
};

export function ReactionButtons({ presetLove = 0, presetCandle = 0, presetShare = 0 }: ReactionButtonsProps) {
  const [love, setLove] = useState(presetLove);
  const [candle, setCandle] = useState(presetCandle);
  const [share, setShare] = useState(presetShare);
  const [isPending, startTransition] = useTransition();

  const handle = (type: "love" | "candle" | "share") => {
    startTransition(() => {
      if (type === "love") {
        setLove((n) => n + 1);
      }
      if (type === "candle") {
        setCandle((n) => n + 1);
      }
      if (type === "share") {
        setShare((n) => n + 1);
      }
    });
  };

  const items = [
    { key: "love", label: "Me gusta", value: love, action: () => handle("love"), icon: IconHeart, color: "text-rose-600" },
    { key: "candle", label: "Vela", value: candle, action: () => handle("candle"), icon: IconCandle, color: "text-amber-600" },
    { key: "share", label: "Compartir", value: share, action: () => handle("share"), icon: IconRepeat, color: "text-sky-700" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-[#334155]">
      {items.map((item) => {
        const Icon = item.icon;
        return (
        <button
          key={item.key}
          type="button"
          onClick={item.action}
          disabled={isPending}
          className="group inline-flex items-center gap-2 rounded-full border border-[#e6e8ef] bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0f172a] shadow-[0_10px_26px_rgba(15,23,42,0.06)] transition hover:-translate-y-[1px] hover:border-[#0f172a]/15 hover:bg-[#f8fafc] active:scale-[0.98] disabled:opacity-70"
          title={item.label}
        >
          <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0f172a]/5 ${item.color}`}>
            <Icon className="h-4 w-4" />
          </span>
          <span className="text-[#0f172a]/80">{item.value}</span>
        </button>
      );
      })}
    </div>
  );
}
