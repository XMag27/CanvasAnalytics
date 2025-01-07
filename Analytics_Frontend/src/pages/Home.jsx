import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  // JS
  const menuList = [
    { name: "Profesor - Actividad", path: "/courses/1/profesores-actividad" },
    {
      name: "Profesor - Progreso de Curso",
      path: "/courses/1/profesores-progueso-curso",
    },
    {
      name: "Profesor - Historial del Curso",
      path: "/courses/1/historial-estudiantes",
    },
  ];

  // HTML
  return (
    <div className="h-screen w-full flex flex-col justify-center gap-5 items-center">
      {/* Fragment */}
      <h3 className="text-3xl font-bold">Menu</h3>
      {menuList.map((elem) => {
        return (
          <Link
            to={elem.path}
            key={elem.name}
            className="border-2 bg-slate-200 w-full max-w-[1200px] mx-auto p-5 text-2xl transition-all rounded-xl hover:ring hover:ring-slate-500"
          >
            {elem.name}{" "}
          </Link>
        );
      })}
    </div>
  ); //            <Link to={elem.path}>{elem.name}</Link>
  //            <Link to={elem.path}>{elem.name}</Link>
}
