"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ChartData, ChartOptions } from "chart.js";

const RuntimeChart = dynamic(() => import("./SimulatedDatasetRuntimeChart"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-xs text-[#6b7280]">Cargando gráfico…</div>,
});

type ChannelSeries = {
  key: string;
  label: string;
  color: string;
  values: number[];
};

export function SalesOrdersTrendChart(props: {
  labels: string[];
  channels: ChannelSeries[];
  activated: number[];
}) {
  const { labels, channels, activated } = props;

  const data: ChartData<"bar" | "line"> = useMemo(
    () => ({
      labels,
      datasets: [
        ...channels.map((channel) => ({
          type: "bar" as const,
          label: channel.label,
          data: channel.values,
          backgroundColor: channel.color,
          borderColor: channel.color,
          borderWidth: 1,
          borderRadius: 10,
          barPercentage: 0.82,
          categoryPercentage: 0.7,
          stack: "sales",
        })),
        {
          type: "line" as const,
          label: "Activaciones (primer recuerdo)",
          data: activated,
          borderColor: "#0f172a",
          backgroundColor: "rgba(15,23,42,0.12)",
          fill: true,
          borderWidth: 2,
          yAxisID: "y1",
          tension: 0.35,
          pointRadius: 3.5,
          pointHoverRadius: 6,
          pointBorderWidth: 1,
          pointBackgroundColor: "#0f172a",
          pointBorderColor: "#ffffff",
        },
      ],
    }),
    [labels, channels, activated],
  );

  const options: ChartOptions<"bar" | "line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { position: "bottom", labels: { font: { size: 11 }, usePointStyle: true } },
        tooltip: {
          backgroundColor: "rgba(17,24,39,0.92)",
          padding: 10,
        },
      },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { stacked: true, beginAtZero: true, ticks: { precision: 0, font: { size: 11 } }, grid: { color: "#e5e7eb" } },
        y1: {
          position: "right",
          beginAtZero: true,
          grid: { drawOnChartArea: false },
          ticks: { precision: 0, font: { size: 11 } },
        },
      },
    }),
    [],
  );

  return (
    <div className="h-[380px] w-full rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
      <RuntimeChart type="bar" data={data} options={options} />
    </div>
  );
}

