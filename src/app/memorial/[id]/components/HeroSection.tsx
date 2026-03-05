/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo } from "react";
import { HeroBackgroundVideo } from "@/components/HeroBackgroundVideo";
import { formatDate } from "./dateUtils";
import { SocialLinksEditor } from "./SocialLinksEditor";

interface HeroSectionProps {
  memorialId: string;
  memorialName: string;
  birthDate: string | null;
  deathDate: string | null;
  description: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  canEditSocial?: boolean;
  memoryCount: number;
  memoryWindow: string; // no longer needed directly but kept for prop matching
  lastUpdated: string | null;
}

export function HeroSection({
  memorialId,
  memorialName,
  birthDate,
  deathDate,
  description,
  avatarUrl,
  coverUrl,
  facebookUrl,
  instagramUrl,
  canEditSocial = false,
  memoryCount,
  lastUpdated,
}: HeroSectionProps) {
  const profileSrc = avatarUrl || null;
  const initials = memorialName.slice(0, 2).toUpperCase();
  const heroSources = useMemo(() => ["/m1.mp4", "/m2.mp4"], []);

  const coverIsVideo = useMemo(() => {
    if (!coverUrl) return false;
    const clean = coverUrl.split("?")[0] ?? "";
    return /\.(mp4|mov|webm|ogg)$/i.test(clean);
  }, [coverUrl]);

  return (
    <section className="relative overflow-hidden rounded-[32px] bg-white/40 ring-1 ring-slate-900/5 shadow-[0_8px_40px_rgba(0,0,0,0.04)] backdrop-blur-2xl mb-8">
      {/* Immersive Cover Area */}
      <div className="relative w-full h-[24vh] min-h-[160px] md:min-h-[220px] md:h-[28vh] bg-gradient-to-r from-amber-900/80 via-slate-900 to-sky-900/80 overflow-hidden group">
        {coverUrl ? (
          coverIsVideo ? (
            <video
              src={coverUrl ?? undefined}
              className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:opacity-100 group-hover:scale-105"
              muted
              loop
              playsInline
              autoPlay
            />
          ) : (
            <img
              src={coverUrl ?? undefined}
              alt="Portada del memorial"
              className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:opacity-100 group-hover:scale-105"
            />
          )
        ) : (
          <HeroBackgroundVideo sources={heroSources} roundedClass="" />
        )}

        {/* Sophisticated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white/90 pointer-events-none" />

        {/* Private label */}
        <div className="absolute top-4 right-5 md:top-6 md:right-8 z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Archivo Documental
          </span>
        </div>
      </div>

      {/* Floating Content Area */}
      <div className="relative px-6 sm:px-12 pb-10">
        {/* Avatar Setup (overlapping the cover cleanly without huge borders) */}
        <div className="absolute -top-12 md:-top-16 flex left-6 sm:left-12">
          <div className="relative h-24 w-24 md:h-32 md:w-32 shrink-0 overflow-hidden rounded-full border-[3px] border-white/90 bg-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition-transform duration-500 hover:scale-105 hover:rotate-2">
            {profileSrc ? (
              <img
                src={profileSrc ?? undefined}
                alt={`Foto de ${memorialName}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-light text-slate-800 font-serif bg-gradient-to-br from-slate-100 to-slate-200">
                {initials}
              </div>
            )}
          </div>
        </div>

        {/* Top spacing to account for absolute avatar */}
        <div className="pt-16 md:pt-20 flex flex-col md:flex-row md:items-start justify-between gap-8">
          {/* Main Info */}
          <div className="flex-1 space-y-4 pt-2">
            <div className="space-y-1 relative">
              <h1 className="text-3xl lg:text-5xl font-serif text-slate-900 leading-tight tracking-tight">
                {memorialName}
              </h1>
              <p className="text-[10px] md:text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase mt-2">
                {formatDate(birthDate)} <span className="mx-2 text-amber-500">•</span> {formatDate(deathDate)}
              </p>
            </div>

            <p className="max-w-2xl text-sm md:text-base text-slate-600 leading-relaxed font-light mt-4">
              {description || "Un espacio preservado con el más alto estándar de respeto y privacidad. Aquí se rinde homenaje y se protege la memoria."}
            </p>

            <div className="pt-4">
              <SocialLinksEditor
                memorialId={memorialId}
                memorialName={memorialName}
                facebookUrl={facebookUrl ?? null}
                instagramUrl={instagramUrl ?? null}
                canEdit={canEditSocial}
              />
            </div>
          </div>

          {/* Stats / Quick Info Block */}
          <div className="shrink-0 flex gap-6 mt-4 md:mt-0 pt-4 md:pt-2 items-center md:items-start border-t md:border-t-0 border-slate-200/50">
            <div className="flex flex-col gap-1 items-start">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-[0.2em]">Registros</span>
              <span className="text-2xl font-serif text-slate-900">{memoryCount}</span>
            </div>
            <div className="w-px h-8 bg-slate-200/60 hidden md:block mt-2" />
            <div className="flex flex-col gap-1 items-start">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-[0.2em]">Actividad</span>
              <span className="text-sm text-slate-700 font-medium">{formatDate(lastUpdated)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
