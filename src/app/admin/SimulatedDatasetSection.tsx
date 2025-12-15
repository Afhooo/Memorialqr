"use client";

import dynamic from "next/dynamic";

const SimulatedDatasetPanel = dynamic(
  () => import("./SimulatedDatasetPanel").then((mod) => mod.SimulatedDatasetPanel),
  {
    ssr: false,
    loading: () => (
      <section className="rounded-[24px] border border-[#e0e0e0] bg-white px-5 py-6 text-sm text-[#4b5563] shadow-[0_18px_55px_rgba(0,0,0,0.06)]">
        <p className="text-[10px] uppercase tracking-[0.32em] text-[#0ea5e9]">Cargando gráfico</p>
        <p className="mt-1 text-[#0f172a]">Preparando el panel interactivo de ventas y activaciones...</p>
      </section>
    ),
  },
);

export function SimulatedDatasetSection() {
  return <SimulatedDatasetPanel />;
}
