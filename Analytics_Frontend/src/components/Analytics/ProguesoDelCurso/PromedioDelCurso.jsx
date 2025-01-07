import React from "react";
import BarChart from "@components/Charts/BarChart";
import ActivityTable from "./ActivityTable";

export default function PromedioDelCurso() {
  // const lineChart1Data = {
  //   labels: ["Deber 1", "Clase Control 2", "Leccion 1", "Deber 2"],
  //   datasets: [
  //     {
  //       label: "Promedio",
  //       data: [23, 33, 56, 67],
  //     },
  //   ],
  // };

  const barChart2Data = {
    labels: ["Deber 1", "Clase Control 2", "Leccion 1", "Deber 2"],
    datasets: [
      {
        label: "Promedio",
        data: [23, 33, 56, 67],
        backgroundColor: "rgba(54, 162, 235, 1)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const dataActivityTable = [
    { id: 233, name: "Deber 1", grades: [23, 33, 33] },
    { id: 233, name: "Deber 2", grades: [23, 33, 33] },
    { id: 233, name: "Deber 233", grades: [23, 33, 54] },
  ];

  const tableActivityData = {
    tareas: [
      { id: 1, title: "Tarea 1", completed: "Sí", dueDate: "2025-01-15" },
      { id: 2, title: "Tarea 2", completed: "No", dueDate: "2025-01-20" },
    ],
    examenes: [
      { id: 1, title: "Examen 1", completed: "Sí", dueDate: "2025-02-01" },
    ],
    proyectos: [
      {
        id: 1,
        title: "Proyecto Final",
        completed: "No",
        dueDate: "2025-03-01",
      },
    ],
    lecciones: [
      { id: 1, title: "Lección 1", completed: "Sí", dueDate: "2025-01-10" },
    ],
    control_lectura: [
      {
        id: 1,
        title: "Control de Lectura 1",
        completed: "Si",
        dueDate: "2025-01-10",
      },
    ],
  };

  return (
    <>
      <BarChart
        title="Promedio del curso por cada actividad"
        options={{
          // plugins: {
          //   title: {
          //     display: true,
          //     text: "Promedio",
          //   },
          // },
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: "Actividad",
                ticks: {
                  font: {
                    size: 16,
                  },
                },
              },
              stacked: true,
            },
            y: {
              title: {
                display: true,
                text: "Calificaciones",
                ticks: {
                  font: {
                    size: 16,
                  },
                },
              },
              stacked: true,
              beginAtZero: true,
            },
          },
        }}
        data={barChart2Data}
      />

      <ActivityTable
        tableData={tableActivityData}
        renderTable={(data) => {
          return (
            <table className="table-auto w-full border-collapse border-2 border-gray-200">
              <thead>
                <tr className="bg-gray-300">
                  <th className="px-4 py-2 text-left font-medium w-1/3">
                    Nombre
                  </th>
                  <th className="px-4 py-2 text-center font-medium ">
                    Promedio de Actividad
                  </th>
                  <th className="px-4 py-2 text-center font-medium">
                    Nota mas alta
                  </th>
                  <th className="px-4 py-2 text-center font-medium">
                    Nota mas baja
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{row.title}</td>
                    <td className="px-4 py-2 text-center">1/3</td>
                    <td className="px-4 py-2 text-center">2/3</td>
                    <td className="px-4 py-2 text-center">2/3</td>
                  </tr>
                ))}
              </tbody>
            </table>
          );
        }}
      />
    </>
  );
}
