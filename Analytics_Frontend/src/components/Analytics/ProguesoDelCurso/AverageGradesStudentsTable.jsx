import React, { useEffect, useState } from "react";

export default function AverageGradesStudentsTable() {
  const title = "Promedio de Calificaciones por Estudiantes";
  const [studentsData, setStudentsData] = useState([
    {
      name: "Juan Pérez",
      grades: { Tarea: 75, Lección: 85, Proyecto: 90 },
    },
  ]);
  const [filter, setFilter] = useState("all"); // 'all', 'below', 'above'

  useEffect(() => {
    const fetchData = () => {
      setStudentsData([
        {
          name: "Juan Pérez",
          grades: { Tarea: 75, Lección: 85, Proyecto: 90 },
        },
        {
          name: "María López",
          grades: { Tarea: 55, Lección: 40, Proyecto: 70 },
        },
        {
          name: "Ana García",
          grades: { Tarea: 60, Lección: 65, Proyecto: 50 },
        },
        {
          name: "Luis Fernández",
          grades: { Tarea: 90, Lección: 95, Proyecto: 88 },
        },
      ]);
      fetchData();
      console.log(studentsData);
    };
  }, []);

  const calculateAverage = (grades) => {
    const total = Object.values(grades).reduce((sum, grade) => sum + grade, 0);
    return (total / Object.values(grades).length).toFixed(2);
  };

  const getFilteredStudents = () => {
    if (filter === "below") {
      return studentsData.filter(
        (student) => calculateAverage(student.grades) < 60
      );
    }
    if (filter === "above") {
      return studentsData.filter(
        (student) => calculateAverage(student.grades) >= 60
      );
    }
    return studentsData;
  };

  const calculateBadgeCounts = (grades) => {
    const counts = { above: 0, below: 0 };
    Object.values(grades).forEach((grade) => {
      if (grade >= 60) counts.above++;
      else counts.below++;
    });
    return counts;
  };

  const filteredStudents = getFilteredStudents();

  return (
    <div className="container mx-auto p-4 bg-white border-2">
      <h6 className="text-center text-xl font-semibold my-5">{title}</h6>
      {/* Filtros */}
      <div className="mb-4 flex gap-4 border-2 p-5 justify-between">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filter === "all"}
            onChange={() => setFilter("all")}
          />
          <span>Todos los estudiantes</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filter === "below"}
            onChange={() => setFilter("below")}
          />
          <span>Nota menor al promedio (&lt; 60)</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={filter === "above"}
            onChange={() => setFilter("above")}
          />
          <span>Nota mayor o igual al promedio (&ge; 60)</span>
        </label>
      </div>
      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Nombre del Estudiante</th>
              <th className="border px-4 py-2">Promedio</th>
              {Object.keys(studentsData[0]?.grades)?.map((activity) => (
                <th key={activity} className="border px-4 py-2">
                  {activity}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => {
              const average = calculateAverage(student.grades);
              const { above, below } = calculateBadgeCounts(student.grades);

              return (
                <tr key={student.name} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span>{student.name}</span>
                      <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                        {above}
                      </span>
                      <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded">
                        {below}
                      </span>
                    </div>
                  </td>
                  <td className="border px-4 py-2 text-center">{average}</td>
                  {Object.values(student.grades).map((grade, index) => (
                    <td
                      key={index}
                      className={`border px-4 py-2 text-center ${
                        grade >= 60 ? "bg-green-300" : "bg-red-300"
                      }`}
                    >
                      {grade}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
