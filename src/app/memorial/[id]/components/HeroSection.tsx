/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HeroBackgroundVideo } from "@/components/HeroBackgroundVideo";
import { formatDate } from "./dateUtils";

interface HeroSectionProps {
  memorialName: string;
  birthDate: string | null;
  deathDate: string | null;
  description: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  memoryCount: number;
  memoryWindow: string;
  lastUpdated: string | null;
}

export function HeroSection({
  memorialName,
  birthDate,
  deathDate,
  description,
  avatarUrl,
  coverUrl,
  memoryCount,
  memoryWindow,
  lastUpdated,
}: HeroSectionProps) {
  const profileSrc = avatarUrl || null;
  const initials = memorialName.slice(0, 2).toUpperCase();
  const heroRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [blur, setBlur] = useState(4);
  const [glow, setGlow] = useState(18);

  const heroSources = useMemo(() => ["/m1.mp4", "/m2.mp4"], []);

  const coverIsVideo = useMemo(() => {
    if (!coverUrl) return false;
    const clean = coverUrl.split("?")[0] ?? "";
    return /\.(mp4|mov|webm|ogg)$/i.test(clean);
  }, [coverUrl]);

  const orbStyle = (dx: number, dy: number) => ({
    transform: `translate3d(${parallax.x + dx}px, ${parallax.y + dy}px, 0) scale(1)`,
  });

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (event.clientX / innerWidth - 0.5) * 18;
      const y = (event.clientY / innerHeight - 0.5) * 14;
      setParallax({ x, y });
      setGlow(16 + Math.abs(x) * 0.6 + Math.abs(y) * 0.4);
    };

    const handleScroll = () => {
      const top = heroRef.current?.getBoundingClientRect().top ?? 0;
      const depth = Math.max(0, Math.min(1, 1 - top / 360));
      setBlur(4 + depth * 10);
      setGlow(18 + depth * 12);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-[#0c1224] via-[#10192e] to-[#0b172d] px-4 pb-10 pt-8 text-white shadow-[0_28px_110px_rgba(0,0,0,0.32)] sm:px-8"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_16%_22%,rgba(255,173,107,0.22),transparent_30%),radial-gradient(circle_at_80%_12%,rgba(99,179,255,0.28),transparent_32%),radial-gradient(circle_at_16%_86%,rgba(125,211,179,0.16),transparent_36%)]" />
      <div className="absolute inset-0 mix-blend-screen" style={{ filter: `blur(${blur}px)` }}>
        {coverUrl ? (
          coverIsVideo ? (
            <video src={coverUrl} className="h-full w-full object-cover object-center" muted loop playsInline autoPlay />
          ) : (
            <img src={coverUrl} alt="" className="h-full w-full object-cover object-center" />
          )
        ) : (
          <HeroBackgroundVideo sources={heroSources} roundedClass="" />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/45 to-[#0b1324]/65 backdrop-blur-[2px]" />
      <div className="absolute inset-0">
        <span
          className="pointer-events-none absolute top-[18%] left-[8%] h-[180px] w-[180px] rounded-full bg-[#f59e0b] opacity-40 blur-[70px] mix-blend-screen transition-transform duration-300 ease-out"
          style={orbStyle(0, 0)}
        />
        <span
          className="pointer-events-none absolute top-[72%] left-[18%] h-[180px] w-[180px] rounded-full bg-[#10b981] opacity-40 blur-[70px] mix-blend-screen transition-transform duration-300 ease-out"
          style={orbStyle(6, -4)}
        />
        <span
          className="pointer-events-none absolute top-[40%] right-[12%] h-[180px] w-[180px] rounded-full bg-[#60a5fa] opacity-40 blur-[70px] mix-blend-screen transition-transform duration-300 ease-out"
          style={orbStyle(-6, 6)}
        />
      </div>

      <div className="relative flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-[28px] bg-white/5 shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur">
              <div className="absolute inset-0 animate-[pulse_2.8s_ease-in-out_infinite] rounded-[24px] bg-[#e87422]/10" />
            {profileSrc ? (
              <img src={profileSrc} alt={`Foto de ${memorialName}`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-white">
                {initials}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#fcd34d]">Memorial privado · familia y amigos</p>
            <div className="flex flex-wrap items-center gap-3">
              <h1
                className="text-3xl font-semibold leading-tight sm:text-4xl"
                style={{
                  textShadow: `0 0 ${glow / 2}px rgba(232,116,34,0.35), 0 0 ${glow / 2.4}px rgba(255,255,255,0.35)`,
                  filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.25))",
                }}
              >
                {memorialName}
              </h1>
            </div>
              <p className="text-sm text-white/80">
                {formatDate(birthDate)} · {formatDate(deathDate)}
              </p>
              <p className="max-w-3xl text-base text-white/85">
                {description ||
                  "Un espacio para la familia y amigos: fotos del carrete, notas cortas y fechas que importan. Aquí se viene a recordar, sin ruido."}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-semibold uppercase tracking-[0.2em] text-white">
                Recuerdos {memoryCount}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-semibold uppercase tracking-[0.2em] text-white">
                Ventana {memoryWindow}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-semibold uppercase tracking-[0.2em] text-white">
                Última: {formatDate(lastUpdated)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
