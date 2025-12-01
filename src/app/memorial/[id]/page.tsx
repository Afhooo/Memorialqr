import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseClient";
import { getServerSession } from "@/lib/serverSession";
import type { Memory } from "@/lib/types";
import { HeroSection } from "./components/HeroSection";
import { MemorialFooter } from "./components/MemorialFooter";
import { MemorialNavbar } from "./components/MemorialNavbar";
import { ShareSection } from "./components/ShareSection";
import { ReflectionSection } from "./components/ReflectionSection";
import { TimelineSection } from "./components/TimelineSection";
import { TributeHighlightsSection } from "./components/TributeHighlightsSection";
import { formatDate } from "./components/dateUtils";

export default async function MemorialPage({ params }: { params: { id: string } }) {
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
    .select("id, name, description, birth_date, death_date, owner_id")
    .eq("id", params.id)
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
    .select("id, memorial_id, title, content, media_url, created_at")
    .eq("memorial_id", params.id)
    .order("created_at", { ascending: false });

  if (memoryError) {
    throw new Error(memoryError.message);
  }

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
    <div className="space-y-14 text-[#2f261f]">
      <MemorialNavbar memorialName={memorial.name} memoryCount={memoryList.length} lastUpdatedLabel={formatDate(lastUpdated)} />

      <HeroSection
        memorialName={memorial.name}
        birthDate={memorial.birth_date}
        deathDate={memorial.death_date}
        description={memorial.description}
        memoryCount={memoryList.length}
        memoryWindow={memoryWindow}
        lastUpdated={lastUpdated}
      />

      <TributeHighlightsSection />

      <ReflectionSection
        memorialName={memorial.name}
        birthDate={memorial.birth_date}
        deathDate={memorial.death_date}
        memories={memoryList}
      />

      <TimelineSection
        memorialName={memorial.name}
        memories={memoryList}
        lastUpdated={lastUpdated}
        memoryWindow={memoryWindow}
      />

      <ShareSection />

      <MemorialFooter memorialName={memorial.name} />
    </div>
  );
}
