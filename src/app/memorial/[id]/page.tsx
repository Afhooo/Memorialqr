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
};

const DEMO_MEMORIAL_ID = "pablo-neruda";

const DEMO_MEMORIAL: MemorialRecord = {
  id: DEMO_MEMORIAL_ID,
  name: "Pablo Neruda",
  description:
    "Poeta chileno, diplomático y premio Nobel de Literatura. Este memorial muestra cómo se ve un espacio ya publicado.",
  birth_date: "1904-07-12",
  death_date: "1973-09-23",
  owner_id: "demo",
  cover_media_url: null,
  cover_media_path: null,
  avatar_media_url: null,
  avatar_media_path: null,
  template_id: null,
};

const DEMO_MEMORIES: Memory[] = [
  {
    id: "demo-1",
    memorial_id: DEMO_MEMORIAL_ID,
    title: "Residencia en la Tierra",
    content: "Versos que marcaron una época y acompañan a quien aún busca consuelo en su voz.",
    media_url: null,
    media_path: null,
    created_at: "2022-01-01T12:00:00Z",
  },
  {
    id: "demo-2",
    memorial_id: DEMO_MEMORIAL_ID,
    title: "Canto General",
    content: "Un poema-río que recorre América Latina y mantiene viva la memoria colectiva.",
    media_url: null,
    media_path: null,
    created_at: "2022-05-15T12:00:00Z",
  },
  {
    id: "demo-3",
    memorial_id: DEMO_MEMORIAL_ID,
    title: "Casa de Isla Negra",
    content: "El refugio frente al mar donde cada objeto cuenta una historia.",
    media_url: null,
    media_path: null,
    created_at: "2023-03-21T12:00:00Z",
  },
];

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

function renderMemorial(memorial: MemorialRecord, memories: Memory[], canPost: boolean) {
  const memoryList: Memory[] = memories ?? [];
  const latestMemoryDate = memoryList[0]?.created_at ?? null;
  const earliestMemoryDate = memoryList[memoryList.length - 1]?.created_at ?? null;
  const lastUpdated = latestMemoryDate ?? memorial.death_date ?? memorial.birth_date ?? null;
  const memoryWindow =
    memoryList.length > 1 && earliestMemoryDate
      ? `${formatDate(earliestMemoryDate)} — ${formatDate(latestMemoryDate)}`
      : memoryList.length === 1
        ? formatDate(latestMemoryDate)
        : "Pendiente de añadir memorias";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(145deg,#f7f8fb_0%,#eef1f6_45%,#f7f8fb_100%)] text-[#0f172a]">
      <div className="pointer-events-none absolute inset-0 opacity-80 [background:radial-gradient(circle_at_18%_18%,rgba(255,140,66,0.08),transparent_34%),radial-gradient(circle_at_82%_10%,rgba(46,153,255,0.1),transparent_32%),radial-gradient(circle_at_26%_84%,rgba(16,185,129,0.08),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_at_32%_0%,rgba(255,255,255,0.75),transparent),radial-gradient(800px_at_78%_10%,rgba(255,255,255,0.6),transparent)]" />

      <div className="relative mx-auto grid w-full max-w-[1800px] gap-10 px-2 pb-14 pt-6 sm:px-4 lg:grid-cols-[minmax(0,1.25fr)_320px] xl:grid-cols-[minmax(0,1.35fr)_360px] lg:gap-14 xl:gap-16">
        <div className="space-y-10">
          <HeroSection
            memorialName={memorial.name}
            birthDate={memorial.birth_date}
            deathDate={memorial.death_date}
            description={memorial.description}
            avatarUrl={memorial.avatar_media_url ?? null}
            coverUrl={memorial.cover_media_url ?? null}
            memoryCount={memoryList.length}
            memoryWindow={memoryWindow}
            lastUpdated={lastUpdated}
          />

          <TributeHighlightsSection
            memorialName={memorial.name}
            description={memorial.description}
            birthDate={memorial.birth_date}
            deathDate={memorial.death_date}
            memoryWindow={memoryWindow}
          />

          <ReflectionSection
            memorialId={memorial.id}
            memorialName={memorial.name}
            birthDate={memorial.birth_date}
            deathDate={memorial.death_date}
            memories={memoryList}
            canPost={canPost}
            memoryWindow={memoryWindow}
            lastUpdated={lastUpdated}
          />

          <div className="lg:hidden rounded-3xl bg-white/75 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.12)] backdrop-blur">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#0f172a]/70">Publica sin salir de la cinta</p>
            <MemoryComposer
              memorialId={memorial.id}
              disabled={!canPost}
              helper={
                canPost
                  ? "El mensaje aparece de inmediato en la cinta; puedes editarlo luego."
                  : "Inicia sesión con la cuenta de la familia para escribir."
              }
            />
          </div>

          <MemorialFooter memorialName={memorial.name} />
        </div>

        <aside className="sticky top-4 hidden h-[calc(100vh-120px)] flex-col gap-4 lg:flex">
          <MemorialNavbar
            memorialName={memorial.name}
            memoryCount={memoryList.length}
            lastUpdatedLabel={formatDate(lastUpdated)}
          />
          <div className="grow overflow-hidden rounded-[30px] bg-white/75 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.12)] backdrop-blur">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-[#0f172a]/70">
              <span>Composer fijo</span>
              <span className="rounded-full bg-[#0f172a]/5 px-2 py-1 text-[10px] font-semibold text-[#0f172a]">En vivo</span>
            </div>
            <div className="mt-3">
              <MemoryComposer
                memorialId={memorial.id}
                disabled={!canPost}
                helper={
                  canPost
                    ? "Escribe mientras lees la cinta. El muro se actualiza al instante."
                    : "Necesitas iniciar sesión para publicar."
                }
              />
            </div>
          </div>
        </aside>
      </div>

      <ShareSection />
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

  // Demostración pública sin login
  if (memorialId === DEMO_MEMORIAL_ID) {
    return renderMemorial(DEMO_MEMORIAL, DEMO_MEMORIES, false);
  }

  const session = await getServerSession();
  if (!session) {
    redirect("/login");
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

  if (memorial.owner_id !== session.user.id) {
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

  return renderMemorial(withSignedMemorial, withSignedMemories, true);
}
