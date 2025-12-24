"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ChartData, ChartOptions } from "chart.js";

const RuntimeChart = dynamic(() => import("./SalesChannelRuntimeChart"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-xs text-[#6b7280]">Cargando gráfico…</div>,
});

type ChannelPoint = { label: string; value: number };

const COLORS = ["#0ea5e9", "#22c55e", "#e87422", "#a855f7", "#facc15", "#64748b"];

export function SalesChannelPieChart({ points }: { points: ChannelPoint[] }) {
  const labels = points.map((p) => p.label);
  const values = points.map((p) => p.value);

  const data: ChartData<"doughnut"> = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Ventas",
          data: values,
          backgroundColor: values.map((_, idx) => COLORS[idx % COLORS.length]),
          borderColor: "rgba(255,255,255,0.95)",
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    }),
    [labels, values],
  );

  const total = values.reduce((acc, v) => acc + v, 0);
  const totalLabel = total.toLocaleString("es-CL");

  const options: ChartOptions<"doughnut"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "62%",
      plugins: {
        legend: {
          position: "bottom",
          labels: { font: { size: 11 }, usePointStyle: true },
        },
        tooltip: {
          callbacks: {
            label(context) {
              const label = context.label || "";
              const value = Number(context.parsed ?? 0);
              const pct = total ? Math.round((value / total) * 100) : 0;
              return `${label}: ${value} (${pct}%)`;
            },
          },
        },
      },
    }),
    [total],
  );

  if (!points.length) {
    return (
      <div className="flex h-[340px] items-center justify-center rounded-2xl border border-dashed border-[#e5e7eb] bg-[#f8fafc] text-sm text-[#6b7280]">
        Sin ventas registradas aún.
      </div>
    );
  }

  return (
    <div className="relative h-[340px] w-full rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
      <RuntimeChart data={data} options={options} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="rounded-2xl bg-white/90 px-4 py-2 text-center shadow-[0_10px_24px_rgba(0,0,0,0.08)] backdrop-blur">
          <p className="text-[10px] uppercase tracking-[0.26em] text-[#6b7280]">Total</p>
          <p className="text-2xl font-semibold text-[#0f172a]">{totalLabel}</p>
        </div>
      </div>
    </div>
  );
}
