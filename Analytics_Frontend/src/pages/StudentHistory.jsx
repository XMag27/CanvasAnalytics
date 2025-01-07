import React, { useState } from "react";
import AutoCompleteSelect from "@components/ui/AutoCompleteSelect";
import BarChart from "@components/Charts/BarChart";
import ActivitiesCourse from "@components/Analytics/ProguesoDelCurso/ActivitiesCourse";

export default function StudentHistory() {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [studentsList, setStudentList] = useState([
    { id: "opt0", label: "Aaron Aaronson" },
    { id: "opt1", label: "Amber Murphy" },
    { id: "opt2", label: "Andrew Miller" },
    { id: "opt3", label: "Barbara Ward" },
    { id: "opt4", label: "Byron Cranston" },
    { id: "opt5", label: "Dennis Reynolds" },
    { id: "opt6", label: "Dee Reynolds" },
    { id: "opt7", label: "Ezra Betterthan" },
    { id: "opt8", label: "Jeff Spicoli" },
    { id: "opt9", label: "Joseph Smith" },
    { id: "opt10", label: "Jasmine Diaz" },
    { id: "opt11", label: "Martin Harris" },
    { id: "opt12", label: "Michael Morgan" },
    { id: "opt13", label: "Michelle Rodriguez" },
    { id: "opt14", label: "Ziggy Stardust" },
  ]);

  const dataChart = {
    labels: ["Deber 1", "Clase Control 2", "Leccion 1", "Deber 2"],
    datasets: [
      {
        label: "Calificaciones",
        data: [100, 99, 32, 34],
        backgroundColor: ["#60a5fa"],
      },
    ],
  };

  const dataActivityTable = [
    { id: 233, name: "Deber 1", grades: [23, 33, 33] },
    { id: 233, name: "Deber 2", grades: [23, 33, 33] },
    { id: 233, name: "Deber 233", grades: [23, 33, 54] },
  ];

  return (
    <div className="w-full flex flex-col gap-3 border-2 p-2">
      <h6>Seguridad de la Informacion</h6>
      <h3 className="text-4xl font-medium">Historial de los estudiantes</h3>
      <hr className="border-black" />
      <section className="flex justify-between items-center">
        <div>
          <p className="text-xl font-bold">
            Estudiante:{" "}
            <span className="text-lg font-normal">MARIA ELISA VELEZ ORTIZ</span>
          </p>
        </div>
        <div>
          <AutoCompleteSelect
            label="Estudiantes"
            placeholder="Buscar por estudiantes"
            options={studentsList}
            value={selectedStudent}
            onChange={setSelectedStudent}
          />
        </div>
      </section>

      <BarChart
        title="Calificacion por cada Actividad"
        options={{
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: "Actividades",
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
        data={dataChart}
      />

      <ActivitiesCourse data={dataActivityTable} />
    </div>
  );
}
