import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart({
  title = "Grafico de Barras",
  options,
  data,
  height = 75,
}) {
  return (
    <section className="flex flex-col text-center gap-3">
      <h6 className="text-xl font-semibold">{title}</h6>
      <Bar options={options} data={data} height={height} />
    </section>
  );
}

<BarChart />
