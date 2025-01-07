import React, { useRef } from "react";
import GradeRangeInput from "./GradeInputFilter";

export default function FilterRangeGradesForm({
  position = "vertical",
  size = 3,
  onSubmit,
}) {
  const calificacionBajaRef = useRef(null);
  const calificacionMediaRef = useRef(null);
  const calificacionAltaRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    const calificacionBajaMinData =
      calificacionBajaRef.current?.ref1?.current?.value;
    const calificacionBajaMaxData =
      calificacionBajaRef.current?.ref2?.current?.value;
    const calificacionAltaMinData =
      calificacionAltaRef.current?.ref1?.current?.value;
    const calificacionAltaMaxData =
      calificacionAltaRef.current?.ref2?.current?.value;
    const calificacionMediaMinData =
      calificacionMediaRef?.current?.ref1?.current?.value;
    const calificacionMediaMaxData =
      calificacionMediaRef?.current?.ref2?.current?.value;

    const data = {
      calificacionBajaMinData,
      calificacionBajaMaxData,
      calificacionAltaMinData,
      calificacionAltaMaxData,
      calificacionMediaMinData,
      calificacionMediaMaxData,
    };
    onSubmit(data);
  }

  return (
    <div
      className={`border border-slate-900 bg-white shadow-md rounded-lg ${
        position === "vertical" ? "w-full px-6" : "w-3/4 mx-auto px-5"
      } rounded-lg`}
    >
      <form
        // className="flex flex-row gap-3 w-full h-full justify-center items-center text-center"
        className={`w-full h-full p-6  flex ${
          position === "vertical" ? "flex-col items-center" : "flex-row mx-auto"
        } gap-6`}
        onSubmit={handleSubmit}
      >
        {/* Calificacion Baja */}
        <GradeRangeInput
          label="Calificacion Baja"
          ref={calificacionBajaRef}
          onValuesChange={() => {}}
        />

        {/* Calificacion Media */}
        {size === 3 && (
          <GradeRangeInput
            label="Calificacion Media"
            ref={calificacionMediaRef}
            onValuesChange={() => {}}
          />
        )}

        {/* Alta */}
        <GradeRangeInput
          label="Calificacion Alta"
          ref={calificacionAltaRef}
          onValuesChange={() => {}}
        />

        <div>
          <button
            type="submit"
            className="px-7 py-3 bg-[#5a92de] text-white text-mediun font-bold"
          >
            Aplicar
          </button>
        </div>
      </form>
    </div>
  );
}
