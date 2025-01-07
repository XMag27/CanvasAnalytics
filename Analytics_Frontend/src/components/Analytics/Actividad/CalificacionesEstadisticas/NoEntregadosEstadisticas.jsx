import React, { useRef, useState } from "react";
import CustomInput from "@components/ui/CustomInput";
import CustomSelect from "@components/ui/CustomSelect";
import CheckboxList from "@components/ui/CheckBoxList";
import CustomTextArea from "@components/ui/CustomTextArea";
import CheckboxListWithAccordion from "@components/ui/CheckBoxListWithAccordion";

export default function NoEntregadosEstadisticas() {
  const fechaInicioRef = useRef("");
  const fechaFinRef = useRef("");
  const [recordatorio, setRecordatorio] = useState("");
  const [dia, setDia] = useState("");
  const horaRef = useRef("");
  const [recordatorioMensaje, setRecordatorioMensaje] = useState("");

  const diaOptions = [
    { label: "Lunes", value: 1 },
    { label: "Martes", value: 2 },
    { label: "Miércoles", value: 3 },
    { label: "Jueves", value: 4 },
    { label: "Viernes", value: 5 },
    { label: "Sábado", value: 6 },
    { label: "Domingo", value: 7 },
  ];

  const items = [
    { id: 1, name: "Pepe" },
    { id: 2, name: "Juan" },
    { id: 3, name: "María" },
    { id: 4, name: "Ana" },
  ];

  const recordatorioOptions = [
    { label: "Semanal", value: "Semanal" },
    { label: "Diario", value: "Diario" },
  ];

  function handleSubmit() {
    const data = {
      fechaInicio: fechaFinRef.current.value,
      fechaFin: fechaFinRef.current.value,
      recordatorio: recordatorio,
      dia: dia,
      hora: fechaFinRef.current.value,
      recordatorioMensaje: recordatorioMensaje,
    };

    console.log(data);

    //TODO: CALL API
  }

  return (
    <div className="h-full w-full flex flex-col gap-4">
      <p className="font-semibold text-sm">
        Seleccione una periodo de tiempo de envio de mensajes
      </p>
      <section className="border-2 rounded-xl flex justify-around items-center gap-5 p-3">
        <CustomInput
          label="Fecha de Inicio"
          placeholder="Selecciona un fecha"
          type="date"
          ref={fechaInicioRef}
        />
        <CustomInput
          label="Fecha de Finalizacion"
          placeholder="Selecciona un fecha"
          type="date"
          ref={fechaFinRef}
        />
        <div className="flex-1 flex flex-col gap-5">
          <CustomSelect
            label="Selecciona una opción"
            options={recordatorioOptions}
            onChange={setRecordatorio}
            defaultValue=""
          />
          <div className="flex items-center justify-between gap-4">
            {recordatorio !== "Diario" && (
              <CustomSelect
                label="Selecciona una opción"
                options={diaOptions}
                onChange={setDia}
                defaultValue=""
              />
            )}

            <CustomInput
              className="flex-1"
              label="Hora"
              placeholder="Selecciona una hora"
              type="time"
              ref={horaRef}
            />
          </div>
        </div>
      </section>
      <section className="flex gap-3">
        <div className="w-full lg:w-1/2">
          <CheckboxList items={items} label="Estudiantes" />
        </div>

        <div className="w-full lg:w-1/2">
          <CustomTextArea
            label="Mensaje"
            placeholder="Escribe el mensaje"
            rows={12}
            onChange={setRecordatorioMensaje}
          />
        </div>
      </section>
      <section className="flex justify-center align-center">
        <button
          className="py-3 px-7 bg-blue-500 text-white font-bold"
          onClick={handleSubmit}
        >
          Enviar
        </button>
      </section>
    </div>
  );
}
