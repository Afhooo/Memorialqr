"use client";

import { useState, useTransition } from "react";

type ReactionButtonsProps = {
  presetLove?: number;
  presetCandle?: number;
  presetShare?: number;
};

type Burst = { id: number; x: number; y: number; emoji: string };

export function ReactionButtons({ presetLove = 0, presetCandle = 0, presetShare = 0 }: ReactionButtonsProps) {
  const [love, setLove] = useState(presetLove);
  const [candle, setCandle] = useState(presetCandle);
  const [share, setShare] = useState(presetShare);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [isPending, startTransition] = useTransition();
  const [ctx] = useState<AudioContext | null>(() => {
    if (typeof window === "undefined") return null;
    const typedWindow = window as Window & { webkitAudioContext?: typeof AudioContext };
    const AudioContextCtor = window.AudioContext ?? typedWindow.webkitAudioContext;
    if (!AudioContextCtor) return null;
    return new AudioContextCtor();
  });

  const spawnBurst = (emoji: string) => {
    const palette = ["❤️", "🕯️", "✨", "🕊️"];
    const chosen = emoji === "mix" ? palette[Math.floor(Math.random() * palette.length)] : emoji;
    const items: Burst[] = Array.from({ length: 10 }).map((_, idx) => ({
      id: Date.now() + idx,
      x: (Math.random() - 0.5) * 80,
      y: -20 - Math.random() * 40,
      emoji: chosen,
    }));
    setBursts((prev) => [...prev, ...items]);
    setTimeout(() => {
      setBursts((prev) => prev.slice(items.length));
    }, 900);
  };

  const playBell = () => {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 660;
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.55);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  };

  const handle = (type: "love" | "candle" | "share") => {
    startTransition(() => {
      if (type === "love") {
        setLove((n) => n + 1);
        spawnBurst("❤️");
        playBell();
      }
      if (type === "candle") {
        setCandle((n) => n + 1);
        spawnBurst("🕯️");
        playBell();
      }
      if (type === "share") {
        setShare((n) => n + 1);
        spawnBurst("mix");
      }
    });
  };

  const emojis = [
    { key: "love", label: "❤️", value: love, action: () => handle("love") },
    { key: "candle", label: "🕯️", value: candle, action: () => handle("candle") },
    { key: "share", label: "🔁", value: share, action: () => handle("share") },
  ];

  return (
    <div className="relative flex flex-wrap items-center gap-2 text-xs text-[#334155]">
      {emojis.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={item.action}
          disabled={isPending}
          className="group relative overflow-hidden rounded-full bg-[#f3f4f6] px-3 py-1 font-semibold text-[#0f172a] shadow-[0_6px_16px_rgba(0,0,0,0.04)] transition hover:-translate-y-[1px] hover:bg-[#e2e8f0] active:scale-[0.98] disabled:opacity-70"
        >
          <span className="mr-1">{item.label}</span>
          <span className="transition group-hover:text-[#e87422]">{item.value}</span>
        </button>
      ))}
      <div className="pointer-events-none absolute inset-0">
        {bursts.map((burst) => (
          <span
            key={burst.id}
            className="absolute text-base animate-[pop_0.9s_ease-out_forwards] [text-shadow:0_6px_14px_rgba(0,0,0,0.25)]"
            style={{
              left: `50%`,
              top: `50%`,
              transform: `translate(${burst.x}%, ${burst.y}%) scale(0.8)`,
            }}
          >
            {burst.emoji}
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes pop {
          0% {
            opacity: 0.85;
            transform: translate(-50%, -50%) scale(0.6) rotate(-10deg);
            filter: blur(0px);
          }
          60% {
            opacity: 1;
            transform: translate(-50%, -80%) scale(1.15) rotate(6deg);
            filter: blur(0px);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -120%) scale(1.22) rotate(12deg);
            filter: blur(2px);
          }
        }
      `}</style>
    </div>
  );
}
