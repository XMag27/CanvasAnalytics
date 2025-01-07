import React from "react";
import { BsTrash } from "react-icons/bs";

export default function ButtonEstadisticas() {
  return (
    <section>
      <button
        className="py-3 px-7 bg-red-500 text-white font-medium ring-2 inline-flex items-center
      "
      >
        <span>Eliminar</span>
        <BsTrash className="ml-2" style={"background: red"} />
      </button>
    </section>
  );
}
