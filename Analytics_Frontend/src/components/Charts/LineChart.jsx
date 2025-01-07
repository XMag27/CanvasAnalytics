import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function LineChart({
  title = "Grafica",
  data,
  options,
  height = 75,
}) {
  return (
    <section className="flex flex-col text-center gap-3">
      <h6 className="text-xl font-semibold">{title}</h6>
      <Line options={options} data={data} height={height} />
    </section>
  );
}
