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
  memoryCount: number;
  memoryWindow: string;
  lastUpdated: string | null;
}

export function HeroSection({
  memorialName,
  birthDate,
  deathDate,
  description,
  memoryCount,
  memoryWindow,
  lastUpdated,
}: HeroSectionProps) {
  const isNeruda = memorialName.trim().toLowerCase() === "pablo neruda";
  const profileSrc = isNeruda ? "/neruda-profile.png" : null;
  const initials = memorialName.slice(0, 2).toUpperCase();
  const heroRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [blur, setBlur] = useState(4);
  const [glow, setGlow] = useState(18);
  const [ambientOn, setAmbientOn] = useState(false);
  const [bars, setBars] = useState([8, 16, 10, 14, 12]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const heroSources = useMemo(() => {
    if (isNeruda) return ["/m2.mp4", "/a1.mp4"];
    return ["/m1.mp4", "/m2.mp4"];
  }, [isNeruda]);

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

  useEffect(() => {
    if (!ambientOn) {
      audioRef.current?.pause();
      return;
    }
    if (!audioRef.current) {
      const ambient = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_d4f5c0900c.mp3?filename=ocean-wave-ambient-20375.mp3");
      ambient.loop = true;
      ambient.volume = 0.25;
      audioRef.current = ambient;
    }
    audioRef.current.play().catch(() => {});
    const interval = setInterval(() => {
      setBars((prev) => prev.map(() => 6 + Math.round(Math.random() * 14)));
    }, 180);
    return () => clearInterval(interval);
  }, [ambientOn]);

  return (
    <section
      ref={heroRef}
      className="relative -mx-4 overflow-hidden rounded-[28px] border border-transparent bg-[#05070e] px-4 pb-10 pt-6 text-white shadow-[0_36px_120px_rgba(0,0,0,0.55)] sm:-mx-8 sm:px-8 md:-mx-12 md:px-12"
    >
      <div
        className="absolute inset-0 opacity-80"
        style={{
          transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0) scale(1.08)`,
          filter: `blur(${blur}px)`,
        }}
      >
        <HeroBackgroundVideo sources={heroSources} roundedClass="" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/92 via-[#0b1220]/80 to-[#0f172a]/92" />
      <div className="absolute inset-0 opacity-60 [background:radial-gradient(circle_at_18%_14%,rgba(232,116,34,0.28),transparent_32%),radial-gradient(circle_at_78%_0%,rgba(59,130,246,0.3),transparent_32%),radial-gradient(circle_at_12%_80%,rgba(16,185,129,0.2),transparent_30%)]" />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-start gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-[28px] border-4 border-white/40 bg-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur">
            <div className="absolute inset-0 animate-[pulse_2.8s_ease-in-out_infinite] rounded-[24px] bg-white/6" />
            {profileSrc ? (
              <img src={profileSrc} alt={`Foto de ${memorialName}`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-white">
                {initials}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-[11px] uppercase tracking-[0.32em] text-white/70">Memorial vivo · muro social</p>
            <div className="flex flex-wrap items-center gap-3">
              <h1
                className="text-3xl font-semibold leading-tight sm:text-4xl text-white"
                style={{
                  textShadow: `0 0 ${glow}px rgba(232,116,34,0.45), 0 0 ${glow / 1.6}px rgba(255,255,255,0.35)`,
                  filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.45))",
                }}
              >
                {memorialName}
              </h1>
              <button
                type="button"
                onClick={() => setAmbientOn((v) => !v)}
                className={`group relative flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-[11px] uppercase tracking-[0.26em] transition ${
                  ambientOn ? "bg-white/15 text-[#facc15]" : "bg-white/5 text-white"
                }`}
              >
                <span className="text-base">{ambientOn ? "🔊" : "🌊"}</span>
                <span>{ambientOn ? "Ambiente on" : "Ambiente"}</span>
                <div className="flex items-end gap-0.5">
                  {bars.map((bar, idx) => (
                    <span
                      key={idx}
                      className="w-[3px] rounded-full bg-gradient-to-t from-[#f97316] via-[#facc15] to-white transition"
                      style={{ height: `${bar}px` }}
                    />
                  ))}
                </div>
              </button>
            </div>
            <p className="text-sm text-white/75">
              {formatDate(birthDate)} · {formatDate(deathDate)}
            </p>
            <p className="max-w-3xl text-base text-white/85">
              {description || "Un muro cercano con fotos, videos y recuerdos contados como en una historia compartida con la familia."}
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-white/10 px-3 py-1 font-semibold uppercase tracking-[0.2em] text-white">
                Recuerdos {memoryCount}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 font-semibold uppercase tracking-[0.2em] text-white">
                Ventana {memoryWindow}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 font-semibold uppercase tracking-[0.2em] text-white">
                Última: {formatDate(lastUpdated)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="#muro"
            className="rounded-full bg-[#e87422] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-white shadow-[0_16px_40px_rgba(232,116,34,0.3)] transition hover:-translate-y-[1px]"
          >
            Escribir recuerdo
          </a>
          <a
            href="#galeria"
            className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-white transition hover:border-white hover:text-white"
          >
            Ver galería
          </a>
          <a
            href="#historia"
            className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-white transition hover:border-white hover:text-white"
          >
            Línea de vida
          </a>
        </div>
      </div>

      <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
          <p className="text-[11px] uppercase tracking-[0.32em] text-white/70">Quién era</p>
          <p className="mt-1 text-sm text-white/85">
            Resumen rápido para quienes llegan por primera vez. Añade anécdotas o la frase que lo identifica.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
          <p className="text-[11px] uppercase tracking-[0.32em] text-white/70">Momentos clave</p>
          <p className="mt-1 text-sm text-white/85">
            Usa la línea de vida para contar hitos breves: lugares, personas y detalles cotidianos.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
          <p className="text-[11px] uppercase tracking-[0.32em] text-white/70">Cómo lo recuerdan</p>
          <p className="mt-1 text-sm text-white/85">
            Las fotos y videos se muestran como carrusel, como si fuera una historia compartida.
          </p>
        </div>
      </div>
    </section>
  );
}
