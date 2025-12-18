import { randomUUID } from "crypto";

export const MEMORIAL_MEDIA_BUCKET = "memorial-media";

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/wav": "wav",
  "audio/webm": "webm",
  "application/pdf": "pdf",
};

export function inferExtension(filename: string | null, contentType: string | null): string {
  const mime = (contentType || "").toLowerCase();
  if (mime && EXT_BY_MIME[mime]) return EXT_BY_MIME[mime];

  const fallback = (filename || "").split(".").pop()?.toLowerCase();
  if (!fallback || fallback === filename) return "bin";
  return fallback.replace(/[^a-z0-9]/g, "").slice(0, 8) || "bin";
}

export function buildUserUploadPath(params: {
  userId: string;
  kind: string;
  filename?: string | null;
  contentType?: string | null;
}): string {
  const extension = inferExtension(params.filename ?? null, params.contentType ?? null);
  const safeKind = params.kind.replace(/[^a-z0-9_-]/gi, "-").toLowerCase().slice(0, 32) || "file";
  return `users/${params.userId}/${safeKind}/${randomUUID()}.${extension}`;
}

export function buildMemorialUploadPath(params: {
  memorialId: string;
  kind: string;
  filename?: string | null;
  contentType?: string | null;
}): string {
  const extension = inferExtension(params.filename ?? null, params.contentType ?? null);
  const safeKind = params.kind.replace(/[^a-z0-9_-]/gi, "-").toLowerCase().slice(0, 32) || "file";
  return `memorials/${params.memorialId}/${safeKind}/${randomUUID()}.${extension}`;
}

export function isAllowedUploadContentType(contentType: string | null): boolean {
  const mime = (contentType || "").toLowerCase();
  if (!mime) return false;
  return (
    mime.startsWith("image/") ||
    mime.startsWith("video/") ||
    mime.startsWith("audio/") ||
    mime === "application/pdf"
  );
}

