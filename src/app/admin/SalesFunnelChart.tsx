"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ChartData, ChartOptions } from "chart.js";

const RuntimeChart = dynamic(() => import("./SimulatedDatasetRuntimeChart"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-xs text-[#6b7280]">Cargando gráfico…</div>,
});

export function SalesFunnelChart(props: { sold: number; activated: number; engaged: number }) {
  const { sold, activated, engaged } = props;

  const data: ChartData<"bar"> = useMemo(
    () => ({
      labels: ["Vendidos", "Activados", "Enganchados"],
      datasets: [
        {
          label: "Cantidad",
          data: [sold, activated, engaged],
          backgroundColor: ["rgba(14,165,233,0.92)", "rgba(34,197,94,0.92)", "rgba(232,116,34,0.92)"],
          borderColor: ["#0ea5e9", "#16a34a", "#e87422"],
          borderWidth: 1,
          borderRadius: 12,
          barPercentage: 0.7,
          categoryPercentage: 0.75,
        },
      ],
    }),
    [sold, activated, engaged],
  );

  const options: ChartOptions<"bar"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: "rgba(17,24,39,0.92)", padding: 10 },
      },
      scales: {
        x: { beginAtZero: true, ticks: { precision: 0, font: { size: 11 } }, grid: { color: "#e5e7eb" } },
        y: { ticks: { font: { size: 11 } }, grid: { display: false } },
      },
    }),
    [],
  );

  return (
    <div className="h-[220px] w-full rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
      <RuntimeChart type="bar" data={data} options={options} />
    </div>
  );
}

