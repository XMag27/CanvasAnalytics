import React, { lazy, Suspense, useEffect, useState } from "react";
import DropDown from "@components/ui/DropDown";
import LoadingSpinner from "@components/ui/LoadingSpinner";

const PromedioDelCurso = lazy(() =>
  import("../components/Analytics/ProguesoDelCurso/PromedioDelCurso")
);
const RangoDeCalificaciones = lazy(() =>
  import("../components/Analytics/ProguesoDelCurso/RangoDeCalificaciones")
);

// Pantalla Referente a Progreso del Curso
export default function ProgresoCurso() {
  const courseProgressOptions = [
    { id: "---", label: "---" },
    { id: "Progreso del Curso", label: "Progreso del Curso" },
    {
      id: "Rango de Calificaciones del Curso",
      label: "Rango de Calificaciones del Curso",
    },
  ];
  const partialCourseOptions = [
    { id: "---", label: "---" },
    { id: "Parcial 1", label: "Parcial 1" },
    { id: "Parcial 2", label: "Parcial 2" },
    { id: "Parcial 3", label: "Parcial 3" },
  ];

  const [data, setData] = useState([]);
  const [selectMenuOption, setSelectMenuOption] = useState("");
  const [selectPartial, setSelectPartial] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/v1/course/2332/grades");
        const resData = response.data;
        setData(resData);
      } catch (err) {
        setData([]);
      }
    };
    fetchData();
  }, []);

  return (
    <div className=" flex flex-col gap-2 border-2 p-6">
      <h6 className="text-lg font-light">Seguridad de la Informacion - Paralelo 1</h6>
      <h3 className="text-4xl font-bold">Progreso del Curso</h3>
      <hr className="border-black" />

      <section className="mt-5 flex justify-between align-center">
        <DropDown
          options={courseProgressOptions}
          label="Progreso del Curso"
          placeholder="Seleccione"
          value={selectMenuOption}
          onChange={setSelectMenuOption}
        />

        <DropDown
          options={partialCourseOptions}
          label="Parcial"
          placeholder="Seleccione"
          value={selectPartial}
          onChange={setSelectPartial}
        />
      </section>

      <div className="mt-5">
        <Suspense fallback={<LoadingSpinner />}>
          {selectMenuOption === "Progreso del Curso" && <PromedioDelCurso />}
          {selectMenuOption === "Rango de Calificaciones del Curso" && (
            <RangoDeCalificaciones />
          )}
        </Suspense>
      </div>
    </div>
  );
}
