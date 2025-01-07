import { Alert, Tabs } from "@instructure/ui";
import React, { useState } from "react";
import FilterRangeGradesForm from "@components/ui/FilterRangeGradesForm";
import BarChart from "@components/Charts/BarChart";
import AverageGradesStudentsTable from "./AverageGradesStudentsTable";
import ActivityTable from "./ActivityTable";

export default function RangoDeCalificaciones() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleTabChange = (event, { index }) => {
    setSelectedIndex(index);
  };

  const barChart2Data = {
    labels: ["Deber 1", "Clase Control 2", "Leccion 1", "Deber 2"],
    datasets: [
      {
        label: "Calificacion Alta",
        data: [100, 99, 32, 34],

        borderWidth: 1,
        stack: "Stack 0",
      },
      {
        label: "Calificacion Baja",
        data: [23, 33, 56, 67],
        backgroundColor: "rgba(54, 162, 235, 1)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        stack: "Stack 0",
      },
    ],
  };

  const barChart3Data = {
    labels: ["Deber 1", "Clase Control 2", "Leccion 1", "Deber 2"],
    datasets: [
      {
        label: "Calificacion Alta",
        data: [23, 99, 32, 34],

        borderWidth: 1,
        stack: "Stack 0",
      },
      {
        label: "Calificacion Media",
        data: [3, 6, 7, 8],
        backgroundColor: "rgba(54, 162, 235, 1)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        stack: "Stack 0",
      },
      {
        label: "Calificacion Baja",
        data: [34, 13, 23, 67],
        backgroundColor: "rgba(54, 170, 235, 1)",
        borderColor: "rgba(54, 170, 235, 1)",
        borderWidth: 1,
        stack: "Stack 0",
      },
    ],
  };

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
    <div className="w-full flex flex-col">
      <Alert variant="info" renderCloseButtonLabel="Close" margin="small">
        Todos las calificaciones estan ponderadas sobre 100.
      </Alert>
      <h6 className="font-medium text-lg"># de Rangos de Calificaciones</h6>
      <div className="">
        <Tabs
          margin="large auto"
          padding="medium"
          onRequestTabChange={handleTabChange}
          fixHeight="100%"
        >
          <Tabs.Panel
            className="w-full"
            id="tabA"
            renderTitle="2"
            padding="large"
            isSelected={selectedIndex === 0}
          >
            <div className="flex flex-col gap-10">
              <section>
                <FilterRangeGradesForm position="horizontal" size={2} />
              </section>
              <section>
                <BarChart
                  title="Cantidad de estudiantes con el rango de calificaciones asignados"
                  options={{
                    plugins: {
                      legend: {
                        display: true,
                        position: "top",
                        labels: {
                          color: "#333",
                          font: {
                            size: 14,
                            family: "Arial",
                          },
                        },
                      },
                    },
                    responsive: true,
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: "Actividad",
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: "Calificaciones",
                        },
                        beginAtZero: true,
                      },
                    },
                  }}
                  data={barChart2Data}
                />
              </section>
            </div>
          </Tabs.Panel>
          <Tabs.Panel
            className="w-full"
            id="tabB"
            renderTitle="3"
            isSelected={selectedIndex === 1}
          >
            <div className="flex flex-col gap-10">
              <section>
                <FilterRangeGradesForm position="horizontal" size={3} />
              </section>
              <section>
                <BarChart
                  title="Cantidad de estudiantes con el rango de calificaciones asignados"
                  options={{
                    plugins: {
                      legend: {
                        display: true,
                        position: "top",
                        labels: {
                          color: "#333",
                          font: {
                            size: 14,
                            family: "Arial",
                          },
                        },
                      },
                    },
                    responsive: true,
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: "Actividad",
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: "Calificaciones",
                        },
                        beginAtZero: true,
                      },
                    },
                  }}
                  data={barChart3Data}
                />
              </section>
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>

      <ActivityTable
        title="Cantidad de Estudiantes por actividades realizada"
        tableData={tableActivityData}
        disableTable={true}
      />

      <AverageGradesStudentsTable />
    </div>
  );
}
