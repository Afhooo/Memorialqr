"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Component, type ReactNode } from "react";
import type { ChartData, ChartOptions } from "chart.js";

const RuntimeChart = dynamic(() => import("./SimulatedDatasetRuntimeChart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-xs text-[#6b7280]">Cargando gráfico...</div>
  ),
});

type TimeGranularity = "day" | "week" | "month";

type MonthlyHistoryPoint = {
  label: string;
  sold: number;
  activated: number;
  memories: number;
};

type AggregatedPoint = {
  label: string;
  sold: number;
  activated: number;
  usagePct: number;
};

const CAPACITY_MEMORIES = 1000;

export function SimulatedDatasetPanel() {
  const [granularity, setGranularity] = useState<TimeGranularity>("month");
  const [chartError, setChartError] = useState<string | null>(null);

  const { monthlyHistory, monthlyAggregates } = useMemo(() => buildMonthlyHistory(), []);
  const weeklyAggregates = useMemo(() => buildWeeklyAggregates(monthlyHistory), [monthlyHistory]);
  const dailyAggregates = useMemo(() => buildDailyAggregates(weeklyAggregates), [weeklyAggregates]);

  const currentPoints =
    granularity === "day"
      ? dailyAggregates
      : granularity === "week"
        ? weeklyAggregates
        : monthlyAggregates;

  const averageSold =
    currentPoints.reduce((sum, point) => sum + point.sold, 0) / currentPoints.length || 0;
  const averageActivated =
    currentPoints.reduce((sum, point) => sum + point.activated, 0) / currentPoints.length || 0;
  const lastPoint = currentPoints[currentPoints.length - 1];
  const lastActivationRate =
    lastPoint && lastPoint.sold ? Math.round((lastPoint.activated / lastPoint.sold) * 100) : 0;

  const chartData: ChartData<"bar" | "line"> = useMemo(
    () => ({
      labels: currentPoints.map((point) => point.label),
      datasets: [
        {
          type: "bar" as const,
          label: "Memoriales vendidos",
          data: currentPoints.map((point) => point.sold),
          backgroundColor: "rgba(56, 189, 248, 0.92)",
          hoverBackgroundColor: "rgba(56, 189, 248, 1)",
          borderColor: "#0ea5e9",
          borderWidth: 1,
          borderRadius: 12,
          barPercentage: 0.7,
          categoryPercentage: 0.6,
        },
        {
          type: "bar" as const,
          label: "Memoriales activados",
          data: currentPoints.map((point) => point.activated),
          backgroundColor: "rgba(34, 197, 94, 0.92)",
          hoverBackgroundColor: "rgba(34, 197, 94, 1)",
          borderColor: "#16a34a",
          borderWidth: 1,
          borderRadius: 12,
          barPercentage: 0.7,
          categoryPercentage: 0.6,
        },
        {
          type: "line" as const,
          label: "% uso plan",
          data: currentPoints.map((point) => point.usagePct),
          borderColor: "#facc15",
          backgroundColor: "rgba(250, 204, 21, 0.18)",
          fill: true,
          borderWidth: 2,
          yAxisID: "y1",
          tension: 0.35,
          pointRadius: 3.5,
          pointHoverRadius: 6,
          pointBorderWidth: 1,
          pointBackgroundColor: "#facc15",
          pointBorderColor: "#92400e",
        },
      ],
    }),
    [currentPoints],
  );

  const chartOptions: ChartOptions<"bar" | "line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { left: 8, right: 8, top: 4, bottom: 4 },
      },
      animation: {
        duration: 800,
        easing: "easeOutQuart",
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
      hover: {
        mode: "index",
        intersect: false,
        animationDuration: 250,
      },
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            font: { size: 12, family: "Inter, system-ui, -apple-system, sans-serif" },
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: "rgba(17,24,39,0.9)",
          titleFont: { size: 12, weight: 600 },
          bodyFont: { size: 12 },
          padding: 10,
          displayColors: true,
          callbacks: {
            label(context) {
              const value = context.parsed.y;
              if (context.dataset.type === "line") {
                const numeric = typeof value === "number" ? value : Number(value ?? 0);
                return `${context.dataset.label}: ${numeric.toFixed(1)}%`;
              }
              return `${context.dataset.label}: ${value}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            maxRotation: 0,
            minRotation: 0,
            font: { size: 11 },
            autoSkip: true,
            maxTicksLimit: 12,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
            font: { size: 11 },
          },
          grid: {
            color: "#e5e7eb",
          },
        },
        y1: {
          position: "right",
          beginAtZero: true,
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            callback(value) {
              return `${value}%`;
            },
            font: { size: 11 },
          },
        },
      },
    }),
    [],
  );

  return (
    <section
      id="historia-6-meses"
      className="overflow-hidden rounded-[24px] border border-[#e0e0e0] bg-white px-5 py-6 shadow-[0_22px_65px_rgba(0,0,0,0.06)]"
    >
      <div className="mx-auto w-full max-w-[1180px] space-y-5 lg:max-w-screen-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#0ea5e9]">Últimos 6 meses</p>
          <h2 className="text-xl font-serif text-[#0f172a]">Tendencia de ventas y activaciones</h2>
          <p className="text-sm text-[#4b5563]">
            Vista histórica de cómo se mueven las ventas de memoriales, sus activaciones y el uso del plan contratado a lo largo del tiempo.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1 rounded-full bg-[#0f172a] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#e5e7eb]">
          <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
          Capacidad: 1000 memorias
          <span className="ml-2 h-2 w-2 rounded-full bg-[#38bdf8]" />
          Consumo acumulado: 650 memorias (65%)
        </div>
        <div className="inline-flex rounded-full border border-[#e5e7eb] bg-[#f9fafb] p-1 text-[11px] text-[#0f172a]">
          {(["day", "week", "month"] as TimeGranularity[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setGranularity(value)}
              className={`px-3 py-1 rounded-full uppercase tracking-[0.18em] transition ${
                granularity === value
                  ? "bg-[#0f172a] text-white shadow-sm"
                  : "text-[#4b5563] hover:bg-white"
              }`}
            >
              {value === "day" ? "Día" : value === "week" ? "Semana" : "Mes"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[2fr,1fr] lg:items-start">
        <div className="min-w-0 space-y-4 rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#0ea5e9]">Serie temporal</p>
              <p className="text-sm font-semibold text-[#0f172a]">
                {granularity === "day"
                  ? "Últimos días simulados"
                  : granularity === "week"
                    ? "Semanas simuladas"
                    : "Meses simulados"}
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#4b5563]">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#38bdf8]" />
                <span>Memoriales vendidos</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                <span>Memoriales activados</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#facc15]" />
                <span>% uso plan</span>
              </div>
            </div>
          </div>

          <div className="relative mt-4 h-80 min-h-[320px] min-w-0 overflow-hidden rounded-xl border border-white/60 bg-white px-2 py-2">
            <div className="h-full w-full overflow-hidden">
              {chartError ? (
                <ChartErrorFallback message={chartError} onRetry={() => setChartError(null)} />
              ) : (
                <ChartErrorBoundary onError={(error) => setChartError(error?.message || "Error desconocido en gráfico")}>
                  <RuntimeChart type="bar" data={chartData} options={chartOptions} />
                </ChartErrorBoundary>
              )}
            </div>
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <div className="rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#0ea5e9]">Resumen numérico</p>
            <p className="mt-1 text-sm font-semibold text-[#0f172a]">
              Resultados agregados ({granularity === "day" ? "días" : granularity === "week" ? "semanas" : "meses"})
            </p>
            <div className="mt-3 grid gap-2 text-[13px] text-[#4b5563]">
              <p>
                Promedio de memoriales vendidos:{" "}
                <span className="font-semibold">
                  {averageSold.toFixed(1)} / {granularity === "day" ? "día" : granularity === "week" ? "semana" : "mes"}
                </span>
              </p>
              <p>
                Promedio de memoriales activados:{" "}
                <span className="font-semibold">
                  {averageActivated.toFixed(1)} /{" "}
                  {granularity === "day" ? "día" : granularity === "week" ? "semana" : "mes"}
                </span>
              </p>
              <p>
                Último punto del período:{" "}
                <span className="font-semibold">
                  {lastActivationRate}
                  <span className="ml-0.5 text-[11px] font-normal">%</span>
                </span>{" "}
                de tasa de activación sobre ventas.
              </p>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto rounded-xl border border-[#e5e7eb] bg-white px-3 py-3">
              {currentPoints.map((point) => (
                <div
                  key={point.label}
                  className="min-w-[140px] rounded-lg bg-[#f9fafb] px-3 py-2 text-[11px] text-[#0f172a] shadow-[0_6px_18px_rgba(15,23,42,0.06)]"
                >
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#6b7280]">{point.label}</p>
                  <p className="mt-1 text-[11px]">
                    <span className="font-semibold">{point.sold}</span> vendidos
                  </p>
                  <p className="text-[11px]">
                    <span className="font-semibold">{point.activated}</span> activados
                  </p>
                  <p className="mt-1 text-[10px] text-[#6b7280]">
                    Uso plan: <span className="font-semibold">{point.usagePct.toFixed(1)}%</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <TopBranchesPanel />
        </div>
      </div>
      </div>
    </section>
  );
}

function buildMonthlyHistory(): {
  monthlyHistory: MonthlyHistoryPoint[];
  monthlyAggregates: AggregatedPoint[];
} {
  const now = new Date();
  const monthFormatter = new Intl.DateTimeFormat("es-CL", { month: "short" });

  const monthlyMemories = [70, 85, 95, 110, 130, 160];

  const monthlyHistory: MonthlyHistoryPoint[] = monthlyMemories.map((memoriesCount, index) => {
    const monthOffsetFromNow = 5 - index;
    const date = new Date(now.getFullYear(), now.getMonth() - monthOffsetFromNow, 1);
    const label = monthFormatter.format(date).toUpperCase();
    const sold = Math.round(memoriesCount / 3);
    const activatedBase = Math.round(sold * (0.7 + index * 0.05));
    const activated = Math.min(sold, activatedBase);

    return {
      label,
      sold,
      activated,
      memories: memoriesCount,
    };
  });

  let cumulativeMemories = 0;
  const monthlyAggregates: AggregatedPoint[] = monthlyHistory.map((month) => {
    cumulativeMemories += month.memories;
    const usagePct = CAPACITY_MEMORIES ? Math.min(100, (cumulativeMemories / CAPACITY_MEMORIES) * 100) : 0;
    return {
      label: month.label,
      sold: month.sold,
      activated: month.activated,
      usagePct,
    };
  });

  return { monthlyHistory, monthlyAggregates };
}

function buildWeeklyAggregates(monthlyHistory: MonthlyHistoryPoint[]): AggregatedPoint[] {
  const weekly: AggregatedPoint[] = [];

  monthlyHistory.forEach((month, monthIndex) => {
    const baseWeeks = 4;
    for (let week = 0; week < baseWeeks; week += 1) {
      const weekLabel = `${month.label} · S${week + 1}`;
      const sold =
        Math.max(1, Math.round(month.sold / baseWeeks + (week - 1.5) * (1 + monthIndex * 0.2)));
      const activatedBase =
        Math.max(0, Math.round(sold * (0.65 + monthIndex * 0.04 + week * 0.03)));
      const activated = Math.min(sold, activatedBase);
      const partialMemories = Math.round(month.memories / baseWeeks) * (week + 1);
      const usagePct = CAPACITY_MEMORIES
        ? Math.min(100, (partialMemories / CAPACITY_MEMORIES) * 100)
        : 0;

      weekly.push({
        label: weekLabel,
        sold,
        activated,
        usagePct,
      });
    }
  });

  return weekly.slice(-14);
}

function buildDailyAggregates(weeklyAggregates: AggregatedPoint[]): AggregatedPoint[] {
  const lastWeeks = weeklyAggregates.slice(-4);
  const daily: AggregatedPoint[] = [];

  lastWeeks.forEach((week, weekIndex) => {
    const daysInWeek = 7;
    for (let day = 0; day < daysInWeek; day += 1) {
      const label = `S${weekIndex + 1} · D${day + 1}`;
      const baseFactor = 0.4 + (day / daysInWeek) * 0.8;
      const sold = Math.max(0, Math.round((week.sold / daysInWeek) * baseFactor));
      const activated = Math.max(0, Math.round((week.activated / daysInWeek) * baseFactor));
      const usagePct = Math.min(100, week.usagePct * (0.85 + (day / daysInWeek) * 0.3));

      daily.push({
        label,
        sold,
        activated,
        usagePct,
      });
    }
  });

  return daily.slice(-21);
}

function TopBranchesPanel() {
  const branches = useMemo(
    () =>
      [
        { name: "Parque Santiago", region: "RM", sold: 128, activated: 102 },
        { name: "Parque Concepción", region: "Biobío", sold: 96, activated: 81 },
        { name: "Parque Antofagasta", region: "Antofagasta", sold: 78, activated: 60 },
        { name: "Parque Valparaíso", region: "Valparaíso", sold: 72, activated: 58 },
        { name: "Parque Puerto Montt", region: "Los Lagos", sold: 65, activated: 49 },
      ].map((branch) => ({
        ...branch,
        activationRate: branch.sold ? Math.round((branch.activated / branch.sold) * 100) : 0,
      })),
    [],
  );

  const maxSold = branches.reduce((max, branch) => (branch.sold > max ? branch.sold : max), 1);

  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-[#0f172a] p-4 text-[#e5e7eb]">
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#38bdf8]">Top 5 parques</p>
      <p className="mt-1 text-sm font-semibold text-white">Ranking nacional por ventas de memoriales</p>
      <div className="mt-3 space-y-2">
        {branches.map((branch, index) => {
          const barWidth = Math.max(12, Math.round((branch.sold / maxSold) * 100));
          return (
            <div
              key={branch.name}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-[#e5e7eb]"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0ea5e9] text-[11px] font-semibold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-[12px] font-semibold text-white">{branch.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#9ca3af]">
                      Región {branch.region}
                    </p>
                  </div>
                </div>
                <div className="text-right text-[11px]">
                  <p className="font-semibold text-white">{branch.sold} ventas</p>
                  <p className="text-[#a5b4fc]">
                    {branch.activated} activadas · {branch.activationRate}%
                  </p>
                </div>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-[#1f2937]">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-[#38bdf8] via-[#22c55e] to-[#a3e635]"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type ChartErrorBoundaryProps = {
  children: ReactNode;
  onError: (error: Error) => void;
};

type ChartErrorBoundaryState = {
  hasError: boolean;
};

class ChartErrorBoundary extends Component<ChartErrorBoundaryProps, ChartErrorBoundaryState> {
  state: ChartErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error("Chart runtime error", error, info);
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

function ChartErrorFallback({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#fecdd3] bg-[#fff1f2] px-4 text-center text-sm text-[#9f1239]">
      <p className="font-semibold">No pudimos renderizar el gráfico</p>
      <p className="text-xs text-[#b91c1c]">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-full bg-[#0ea5e9] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white shadow-sm hover:bg-[#0284c7]"
      >
        Reintentar
      </button>
    </div>
  );
}
