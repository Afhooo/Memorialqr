import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";
import type { Memory } from "@/lib/types";
import { MEMORIAL_MEDIA_BUCKET } from "@/lib/storage";
import { HeroSection } from "./components/HeroSection";
import { MemorialFooter } from "./components/MemorialFooter";
import { MemorialNavbar } from "./components/MemorialNavbar";
import { ShareSection } from "./components/ShareSection";
import { ReflectionSection } from "./components/ReflectionSection";
import { TributeHighlightsSection } from "./components/TributeHighlightsSection";
import { MemoryComposer } from "./components/MemoryComposer";
import { formatDate } from "./components/dateUtils";
import { MemoriesGallery } from "./components/MemoriesGallery";

export const dynamic = "force-dynamic";

type MemorialRecord = {
  id: string;
  name: string;
  description: string | null;
  birth_date: string | null;
  death_date: string | null;
  owner_id: string;
  cover_media_url?: string | null;
  cover_media_path?: string | null;
  avatar_media_url?: string | null;
  avatar_media_path?: string | null;
  template_id?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
};

async function signStoragePaths(paths: Array<string | null | undefined>, expiresInSeconds = 60 * 60) {
  const unique = [...new Set(paths.filter((path): path is string => Boolean(path)))];
  if (!unique.length) return new Map<string, string>();

  const service = createSupabaseServiceClient();
  const signedPairs = await Promise.all(
    unique.map(async (path) => {
      const { data, error } = await service.storage.from(MEMORIAL_MEDIA_BUCKET).createSignedUrl(path, expiresInSeconds);
      if (error || !data?.signedUrl) return [path, null] as const;
      return [path, data.signedUrl] as const;
    }),
  );

  return new Map<string, string>(signedPairs.filter((pair): pair is [string, string] => Boolean(pair[1])));
}

function normalizeExternalUrl(value: string | null | undefined) {
  if (!value) return null;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function renderMemorial(memorial: MemorialRecord, memories: Memory[], canPost: boolean, canEditSocial: boolean) {
  const memoryList: Memory[] = memories ?? [];
  const latestMemoryDate = memoryList[0]?.created_at ?? null;
  const earliestMemoryDate = memoryList[memoryList.length - 1]?.created_at ?? null;
  const lastUpdated = latestMemoryDate ?? memorial.death_date ?? memorial.birth_date ?? null;
  const memoryWindow =
    memoryList.length > 1 && earliestMemoryDate
      ? `${formatDate(earliestMemoryDate)} — ${formatDate(latestMemoryDate)}`
      : memoryList.length === 1
        ? formatDate(latestMemoryDate)
        : "Aún no hay recuerdos";

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Immersive Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.05),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.03),transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] mix-blend-overlay" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-8 pt-6 pb-24">

        {/* Cinematic Header (Hero) */}
        <HeroSection
          memorialId={memorial.id}
          memorialName={memorial.name}
          birthDate={memorial.birth_date}
          deathDate={memorial.death_date}
          description={memorial.description}
          avatarUrl={memorial.avatar_media_url ?? null}
          coverUrl={memorial.cover_media_url ?? null}
          facebookUrl={normalizeExternalUrl(memorial.facebook_url)}
          instagramUrl={normalizeExternalUrl(memorial.instagram_url)}
          canEditSocial={canEditSocial}
          memoryCount={memoryList.length}
          memoryWindow={memoryWindow}
          lastUpdated={lastUpdated}
        />

        {/* Premium Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mt-8">

          {/* Main Feed Column */}
          <div className="space-y-8">

            {/* Elegant Composer */}
            <div className="relative rounded-3xl bg-white/60 backdrop-blur-2xl border border-white p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-900/5 transition-all duration-500 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] hover:bg-white/80">
              <MemoryComposer
                memorialId={memorial.id}
                disabled={!canPost}
                helper={
                  canPost
                    ? "Inmortaliza un nuevo recuerdo fotográfico o escrito."
                    : "Inicia sesión con la cuenta familiar para publicar."
                }
              />
            </div>

            {/* Visual Memories Gallery */}
            <div className="rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] ring-1 ring-slate-900/5 p-6 sm:p-10">
              <MemoriesGallery memorialName={memorial.name} memories={memoryList} />
            </div>

            {/* Bento Highlights */}
            <div className="flex flex-col gap-6">
              <div className="rounded-3xl bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <TributeHighlightsSection
                  memorialName={memorial.name}
                  description={memorial.description}
                  birthDate={memorial.birth_date}
                  deathDate={memorial.death_date}
                  memoryWindow={memoryWindow}
                />
              </div>
              <div className="rounded-3xl bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-sky-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <ReflectionSection
                  memorialName={memorial.name}
                  birthDate={memorial.birth_date}
                  deathDate={memorial.death_date}
                  memories={memoryList}
                  memoryWindow={memoryWindow}
                  lastUpdated={lastUpdated}
                />
              </div>
            </div>

            <MemorialFooter memorialName={memorial.name} />
          </div>

          {/* Right Sticky Column */}
          <aside className="hidden lg:flex flex-col gap-6 sticky top-24 h-max">
            <MemorialNavbar
              memorialName={memorial.name}
              memoryCount={memoryList.length}
              lastUpdatedLabel={formatDate(lastUpdated)}
            />

            <ShareSection />
          </aside>

        </div>
      </div>

      {/* Mobile Share Section */}
      <div className="lg:hidden mt-12 px-4 relative z-10 pb-8">
        <ShareSection />
      </div>
    </div>
  );
}

export default async function MemorialPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const resolvedParams = await Promise.resolve(params);
  const memorialId = resolvedParams.id;

  const session = await getServerSession();
  if (!session) {
    redirect(`/login?from=/memorial/${memorialId}`);
  }

  const supabase = createSupabaseServerClient();

  const {
    data: memorial,
    error: memorialError,
  } = await supabase
    .from("memorials")
    .select("*")
    .eq("id", memorialId)
    .maybeSingle();

  if (memorialError || !memorial) {
    notFound();
  }

  const isOwner = memorial.owner_id === session.user.id;
  let isMember = false;
  if (!isOwner) {
    const { data: membership } = await supabase
      .from("memorial_members")
      .select("id")
      .eq("memorial_id", memorialId)
      .eq("user_id", session.user.id)
      .maybeSingle();
    isMember = Boolean(membership?.id);
  }

  if (!isOwner && !isMember) {
    notFound();
  }

  const {
    data: memories,
    error: memoryError,
  } = await supabase
    .from("memories")
    .select("*")
    .eq("memorial_id", memorialId)
    .order("created_at", { ascending: false });

  if (memoryError) {
    throw new Error(memoryError.message);
  }

  const memorialRecord = memorial as MemorialRecord;
  const memoryRecords = (memories ?? []) as Memory[];

  const signedMap = await signStoragePaths([
    memorialRecord.cover_media_path,
    memorialRecord.avatar_media_path,
    ...memoryRecords.map((memory) => memory.media_path),
  ]);

  const withSignedMemorial: MemorialRecord = {
    ...memorialRecord,
    cover_media_url:
      memorialRecord.cover_media_url || (memorialRecord.cover_media_path ? signedMap.get(memorialRecord.cover_media_path) : null) || null,
    avatar_media_url:
      memorialRecord.avatar_media_url || (memorialRecord.avatar_media_path ? signedMap.get(memorialRecord.avatar_media_path) : null) || null,
  };

  const withSignedMemories: Memory[] = memoryRecords.map((memory) => {
    const signed = memory.media_path ? signedMap.get(memory.media_path) : null;
    return { ...memory, media_url: memory.media_url || signed || null };
  });

  return renderMemorial(withSignedMemorial, withSignedMemories, true, isOwner);
}
