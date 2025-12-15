"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Chart as ChartComponent } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Filler);

type RuntimeChartProps = {
  type: "bar";
  data: ChartData<"bar" | "line">;
  options: ChartOptions<"bar" | "line">;
};

export default function SimulatedDatasetRuntimeChart({ type, data, options }: RuntimeChartProps) {
  return <ChartComponent type={type} data={data} options={options} />;
}
