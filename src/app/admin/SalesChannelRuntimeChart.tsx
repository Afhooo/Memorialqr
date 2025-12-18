"use client";

import "chart.js/auto";
import type { ChartData, ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";

type Props = {
  data: ChartData<"doughnut">;
  options: ChartOptions<"doughnut">;
};

export default function SalesChannelRuntimeChart({ data, options }: Props) {
  return <Doughnut data={data} options={options} className="!h-full !w-full" style={{ maxWidth: "100%", maxHeight: "100%" }} />;
}

