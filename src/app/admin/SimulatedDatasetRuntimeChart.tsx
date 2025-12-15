"use client";

import type { ChartData, ChartOptions } from "chart.js";
import "chart.js/auto";
import { Chart as ChartComponent } from "react-chartjs-2";

type RuntimeChartProps = {
  type: "bar";
  data: ChartData<"bar" | "line">;
  options: ChartOptions<"bar" | "line">;
};

export default function SimulatedDatasetRuntimeChart({ type, data, options }: RuntimeChartProps) {
  return (
    <ChartComponent
      type={type}
      data={data}
      options={options}
      className="!h-full !w-full"
      style={{ maxWidth: "100%", maxHeight: "100%" }}
    />
  );
}
