import React, { useEffect } from "react";
import { useState } from 'react';
import BarChart from "@components/Charts/BarChart";
import LineChart from "@components/Charts/LineChart";

export default function GeneralEstadisticas() {
  const [data, setData] = useState([]);

  useEffect(() => {
    
  }, [])

  return (
    <div className="h-full w-full flex flex-col gap-10">
      <BarChart
        title="Cantidad de Estudiantes entregaron actividades"
        options={{
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: "Calificaciones",
              },
            },
            y: {
              title: {
                display: true,
                text: "Actividad",
              },
              beginAtZero: true,
            },
          },
        }}
        data={{
          labels: ["No Entregados", "Entregados"],
          datasets: [
            {
              label: "# de Estudiantes",
              data: [2, 3],
              backgroundColor: ["#60a5fa"],
            },
          ],
        }}
      />

      <LineChart
        title="Histograma de Entrega de Estudiantes"
        options={{
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: "Fecha",
              },
            },
            y: {
              title: {
                display: true,
                text: "# de Estudiantes",
              },
              beginAtZero: true,
            },
          },
        }}
        data={{
          labels: [
            "2024-12-13",
            "2024-12-14",
            "2024-12-15",
            "2024-12-16",
            "2024-12-17",
            "2024-12-18",
          ],
          datasets: [{ label: "# de Estudiantes", data: [2, 3, 22, 5, 6, 7] }],
        }}
      />
    </div>
  );
}
