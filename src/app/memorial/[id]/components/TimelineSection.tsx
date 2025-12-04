import Image from "next/image";
import type { Memory } from "@/lib/types";
import { formatDate } from "./dateUtils";

interface TimelineSectionProps {
  memorialName: string;
  memories: Memory[];
  lastUpdated: string | null;
  memoryWindow: string;
}

export function TimelineSection({ memorialName, memories, lastUpdated, memoryWindow }: TimelineSectionProps) {
  return (
    <section className="animate-fade-rise delay-2 rounded-[32px] border border-[#e0e0e0] bg-white/90 p-8 shadow-[0_28px_80px_rgba(0,0,0,0.1)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.45em] text-[#e87422]">Cronología viva</p>
          <h2 className="text-3xl font-serif text-[#333333]">Memorias de {memorialName}</h2>
          <p className="max-w-3xl text-[#4a4a4a]">
            Obituario, cartas y fotos en una sola línea de tiempo. La familia suma capítulos a su ritmo.
          </p>
        </div>
        <div className="text-right text-sm text-[#555555]">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#e87422]">Última nota</p>
          <p className="text-base font-semibold text-[#333333]">{formatDate(lastUpdated)}</p>
          <p className="text-xs">{memories.length > 1 ? `Desde ${memoryWindow}` : "A la espera de más memorias"}</p>
        </div>
      </div>

      {memories.length === 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-dashed border-[#d5d5d5] bg-gradient-to-br from-white via-[#f7f7f7] to-[#eef2ef] px-4 py-5 text-sm text-[#4a4a4a]">
            Escribe el obituario y datos del servicio para quienes no pudieron asistir.
          </div>
          <div className="rounded-3xl border border-dashed border-[#d5d5d5] bg-gradient-to-br from-white via-[#f7f7f7] to-[#eef2ef] px-4 py-5 text-sm text-[#4a4a4a]">
            Sube fotos, videos o audios; la primera imagen llena el altar superior.
          </div>
          <div className="rounded-3xl border border-dashed border-[#d5d5d5] bg-gradient-to-br from-white via-[#f7f7f7] to-[#eef2ef] px-4 py-5 text-sm text-[#4a4a4a]">
            Publica y comparte el enlace para recibir condolencias cuidadas.
          </div>
        </div>
      ) : (
        <div className="relative mt-6">
          <div className="absolute left-4 top-0 bottom-0 hidden w-px bg-gradient-to-b from-[#e87422] via-[#ff9800] to-transparent md:block" />
          <div className="space-y-5">
            {memories.map((memory, index) => (
              <article
                key={memory.id}
                className="relative overflow-hidden rounded-3xl border border-[#e0e0e0] bg-gradient-to-br from-white via-[#f7f7f7] to-[#eef2ef] p-5 shadow-[0_16px_50px_rgba(0,0,0,0.08)]"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <div className="absolute left-2 top-6 hidden h-3 w-3 rounded-full border border-white bg-[#e87422] shadow-[0_0_0_6px_rgba(232,116,34,0.2)] md:block" />
                <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-[#e87422]">
                  <span>Memoria {index + 1}</span>
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#e0e0e0] to-transparent" />
                  <span>{formatDate(memory.created_at)}</span>
                </div>
                <div className="mt-3 space-y-3 md:pl-6">
                  <h3 className="text-xl font-serif text-[#333333]">{memory.title}</h3>
                  <p className="text-[#4a4a4a]">{memory.content}</p>
                  {memory.media_url && (
                    <Image
                      src={memory.media_url}
                      width={1200}
                      height={720}
                      alt={`Media para ${memory.title}`}
                      className="mt-3 w-full rounded-2xl border border-[#e0e0e0] object-cover"
                      unoptimized
                    />
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
