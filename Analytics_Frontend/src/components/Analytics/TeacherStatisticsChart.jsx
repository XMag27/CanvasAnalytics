import React, { useState } from "react";
//Components.jsx
import { BsBarChartFill } from "react-icons/bs";
import ButtonEstadisticas from "./ButtonEstadisticas";
import ActivityTeacherStaditics from "./CalificacionesEstadisticas/ActivityTeacherStaditics";

export default function TeacherStatisticsChart() {
  //Logica del Componentent

  // useState(estadoIici)
  const [isOpen, setIsOpen] = useState(false);

  function handleClick() {
    setIsOpen(!isOpen);
  }

  //Renderizar el contenido del html
  return (
    <div className="h-full w-full flex flex-col p-3 gap-3">
      <section className="inline-flex items-center">
        <h3 className="text-3xl font-bold flex-1">Deber 1 Programacion 2</h3>
        <button
          onClick={handleClick}
          className="px-7 py-3 bg-blue-500 rounded-lg text-white font-medium inline-flex items-center"
        >
          <span>Estadisticas</span>
          <BsBarChartFill className="ml-2" />
        </button>

        <button className="ml-2 px-7 py-3 bg-blue-500 rounded-lg text-white font-medium inline-flex items-center">
          Editar
        </button>
      </section>

      <hr />

      <section>{isOpen && <ActivityTeacherStaditics />}</section>
    </div>
  );
}
