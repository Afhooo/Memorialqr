"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ChartData, ChartOptions } from "chart.js";

const RuntimeChart = dynamic(() => import("./SimulatedDatasetRuntimeChart"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-xs text-[#6b7280]">Cargando gráfico…</div>,
});

export function MemoriesTrendChart(props: { labels: string[]; memories: number[]; activations: number[] }) {
  const { labels, memories, activations } = props;

  const data: ChartData<"bar" | "line"> = useMemo(
    () => ({
      labels,
      datasets: [
        {
          type: "bar" as const,
          label: "Recuerdos publicados",
          data: memories,
          backgroundColor: "rgba(15,23,42,0.12)",
          borderColor: "#0f172a",
          borderWidth: 1,
          borderRadius: 10,
          barPercentage: 0.75,
          categoryPercentage: 0.75,
        },
        {
          type: "line" as const,
          label: "Activaciones (primer recuerdo)",
          data: activations,
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,0.12)",
          fill: true,
          borderWidth: 2,
          tension: 0.35,
          pointRadius: 3.5,
          pointHoverRadius: 6,
          pointBackgroundColor: "#22c55e",
          pointBorderColor: "#ffffff",
          yAxisID: "y1",
        },
      ],
    }),
    [labels, memories, activations],
  );

  const options: ChartOptions<"bar" | "line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { position: "bottom", labels: { font: { size: 11 }, usePointStyle: true } },
        tooltip: { backgroundColor: "rgba(17,24,39,0.92)", padding: 10 },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, maxRotation: 0, minRotation: 0 } },
        y: { beginAtZero: true, ticks: { precision: 0, font: { size: 11 } }, grid: { color: "#e5e7eb" } },
        y1: { position: "right", beginAtZero: true, grid: { drawOnChartArea: false }, ticks: { precision: 0, font: { size: 11 } } },
      },
    }),
    [],
  );

  return (
    <div className="h-[340px] w-full rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
      <RuntimeChart type="bar" data={data} options={options} />
    </div>
  );
}

