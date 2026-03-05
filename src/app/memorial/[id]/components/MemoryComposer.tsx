"use client";

/* eslint-disable @next/next/no-img-element */

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, X, UploadCloud, FileText, Send } from "lucide-react";

interface MemoryComposerProps {
  memorialId: string;
  disabled?: boolean;
  helper?: string;
}

type UploadResult = { path: string; signedUrl: string };

const isVideoUrl = (url: string) => {
  const clean = url.split("?")[0] ?? "";
  return /\.(mp4|mov|webm|ogg)$/i.test(clean);
};

const isVideoFile = (file: File) => file.type.startsWith("video/") || isVideoUrl(file.name);

export function MemoryComposer({ memorialId, disabled = false, helper }: MemoryComposerProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>("");
  const [uploaded, setUploaded] = useState<UploadResult | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!file) {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl("");
      setUploaded(null);
      return;
    }
    const nextUrl = URL.createObjectURL(file);
    setFilePreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextUrl;
    });
    setUploaded(null);
    return () => URL.revokeObjectURL(nextUrl);
  }, [file]);

  const uploadSelectedFile = async (): Promise<UploadResult | null> => {
    if (!file) return null;
    if (uploaded) return uploaded;

    setUploadingFile(true);
    setError(null);
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("kind", "memory");
      form.set("memorialId", memorialId);

      const response = await fetch("/api/uploads", { method: "POST", body: form });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "No pudimos subir el archivo");
      }
      const result = payload as UploadResult;
      setUploaded(result);
      return result;
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading || disabled) return;

    setLoading(true);
    setProgress(6);
    setError(null);

    const timer = setInterval(() => {
      setProgress((value) => Math.min(96, value + 6 + Math.random() * 8));
    }, 180);

    try {
      const trimmedTitle = title.trim();
      const trimmedContent = content.trim();
      const hasAttachment = Boolean(file);
      if (!trimmedContent && !hasAttachment) {
        throw new Error("Agrega una foto o escribe algún recuerdo.");
      }

      const upload = hasAttachment ? await uploadSelectedFile() : null;

      const response = await fetch(`/api/memorials/${memorialId}/memories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmedTitle || null,
          content: trimmedContent || null,
          mediaPath: upload?.path ?? null,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "Error al publicar tu recuerdo");
      }

      setTitle("");
      setContent("");
      setFile(null);
      setUploaded(null);
      setProgress(100);
      setIsExpanded(false); // Collapse on success
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error inesperado al publicar";
      setError(message);
    } finally {
      clearInterval(timer);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 400);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isExpanded) setIsExpanded(true);
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || loading) return;
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && (droppedFile.type.startsWith("image/") || droppedFile.type.startsWith("video/"))) {
      setFile(droppedFile);
      setIsExpanded(true);
    }
  };

  return (
    <motion.form
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex flex-col gap-4 overflow-hidden"
      onSubmit={handleSubmit}
    >
      <div
        className="relative group cursor-text"
        onClick={() => !disabled && setIsExpanded(true)}
      >
        {!isExpanded ? (
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/50 text-slate-400 group-hover:bg-slate-100/80 transition-colors">
            <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200/50 flex items-center justify-center">
              <FileText className="h-5 w-5 text-slate-400" />
            </div>
            <p className="font-medium text-sm">{helper || "Escribe un recuerdo o comparte una foto..."}</p>
            <div className="ml-auto flex items-center gap-3 px-2">
              <ImagePlus className="h-5 w-5 text-slate-400 group-hover:text-amber-500 transition-colors" />
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex flex-col gap-4"
          >
            <div className="relative">
              <FileText className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título del documento o anécdota (opcional)"
                className="w-full rounded-xl border border-slate-200/60 bg-white pl-11 pr-4 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 transition-colors focus:border-amber-400/50 focus:outline-none focus:ring-4 focus:ring-amber-400/10 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.03)]"
                disabled={disabled || loading}
              />
            </div>

            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Añade la historia o descripción correspondiente al registro..."
                rows={4}
                className="w-full rounded-xl border border-slate-200/60 bg-white p-4 text-sm font-light leading-relaxed text-slate-900 placeholder-slate-400 transition-colors focus:border-amber-400/50 focus:outline-none focus:ring-4 focus:ring-amber-400/10 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.03)] resize-none min-h-[120px]"
                disabled={disabled || loading}
              />
            </div>

            <AnimatePresence mode="popLayout">
              {!filePreviewUrl ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative cursor-pointer flex flex-col items-center justify-center rounded-2xl border border-dashed py-8 px-4 transition-all ${isDragging
                    ? "border-amber-400 bg-amber-50"
                    : "border-slate-300 bg-slate-50/50 hover:border-amber-400/50 hover:bg-slate-50"
                    }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    disabled={disabled || loading}
                  />
                  <UploadCloud className={`mb-3 h-8 w-8 transition-colors ${isDragging ? "text-amber-500" : "text-slate-300"}`} />
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Adjuntar Documento Visual</p>
                  <p className="mt-1 text-xs text-slate-400 font-light hidden sm:block">Arrastra un archivo o haz clic aquí</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-900 group shadow-inner"
                >
                  <div className="relative aspect-video w-full">
                    {file && isVideoFile(file) ? (
                      <video src={filePreviewUrl} className="h-full w-full object-contain" controls />
                    ) : (
                      <img src={filePreviewUrl} alt="Vista previa" className="h-full w-full object-contain" />
                    )}
                    <div className="absolute top-4 right-4 z-10">
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-900/40 text-white backdrop-blur-md hover:bg-red-500 transition duration-300"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-3 mt-2">
              {error && <p className="text-[10px] font-semibold tracking-widest uppercase text-red-600 bg-red-50 border border-red-200/60 px-4 py-3 rounded-lg">{error}</p>}

              {loading && progress > 0 && (
                <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    className="h-full bg-amber-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  disabled={loading}
                  className="px-6 py-3.5 rounded-xl border border-slate-200/60 bg-white text-[11px] font-semibold uppercase tracking-widest text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={disabled || loading || (!content.trim() && !file)}
                  className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-slate-900 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-white transition-all hover:bg-slate-800 hover:shadow-md hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  {loading ? (
                    <span className="animate-pulse">Procesando...</span>
                  ) : (
                    <>
                      <Send size={16} />
                      Publicar
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.form>
  );
}
