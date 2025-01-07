import React, { lazy, useState, Suspense } from "react";
import { menuEstadisticasProfesoresActividades } from "../constants/profesores-actividades";
import DropDown from "../components/ui/DropDown";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const NoEntregadosEstadisticas = lazy(() =>
  import(
    "../components/Analytics/Actividad/CalificacionesEstadisticas/NoEntregadosEstadisticas"
  )
);
const EntregadosEstadisticas = lazy(() =>
  import(
    "../components/Analytics/Actividad/CalificacionesEstadisticas/EntregadosEstadisticas"
  )
);
const GeneralEstadisticas = lazy(() =>
  import(
    "../components/Analytics/Actividad/CalificacionesEstadisticas/GeneralEstadisticas"
  )
);

//Pantalla Referente a: Profesor: Actividad
export default function ActividadEstadistica() {
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <section className="h-full w-full py-5 duration-300">
      <div className="mb-3  flex flex-col gap-3">
        <h6>Seguridad de la Informacion - Paralelo 1</h6>
        <h3 className="text-4xl font-medium">Progreso del Curso</h3>
        <hr className="border-black" />

        <section className="mt-5 flex justify-between align-center">
          <DropDown
            options={menuEstadisticasProfesoresActividades}
            label="Menu Estadisticas"
            placeholder="Seleccione"
            value={selectedOption}
            onChange={setSelectedOption}
          />
        </section>
      </div>

      <div className="mt-10">
        <Suspense fallback={<LoadingSpinner />}>
          {selectedOption === "Entregados" && <EntregadosEstadisticas />}
          {selectedOption === "No Entregados" && <NoEntregadosEstadisticas />}
          {selectedOption === "General" && <GeneralEstadisticas />}
        </Suspense>
      </div>
    </section>
  );
}
