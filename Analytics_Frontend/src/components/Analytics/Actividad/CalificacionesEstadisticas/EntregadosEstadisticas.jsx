import * as React from "react";

import CheckboxListWithAccordion from "@components/ui/CheckBoxListWithAccordion";
import BarChart from "@components/Charts/BarChart";
import FilterRangeGradesForm from "@components/ui/FilterRangeGradesForm";
import CustomTabs from "@components/ui/Tabs/CustomTabs";
import { useEffect } from "react";
import { useState } from "react";

export default function EntregadosEstadisticas() {
  // const [data, setData] = useState([]);
  const [filter, setFilter] = useState({
    calificacionBajaMinData: 0,
    calificacionBajaMaxData: 0,
    calificacionAltaMinData: 0,
    calificacionAltaMaxData: 0,
    calificacionMediaMinData: 0,
    calificacionMediaMaxData: 0,
  });

  // useEffect(() => {}, []);

  // useEffect(() => {}, [filter]);

  const tabsConfig = [
    {
      id: "Entregados-2",
      title: "2",
      content: () => (
        <div className="flex items-center gap-5 h-full w-full">
          {/* Form */}
          <div className="basis-1/3 h-auto border-2">
            <FilterRangeGradesForm
              position="vertical"
              size={2}
              onSubmit={onSubmit}
            />
          </div>
          {/* Grafico */}
          <div className="basis-2/3">
            <BarChart
              title="Cantidad de Estudiantes entregaron actividades"
              className="w-50 h-50"
              data={{
                labels: ["Calificacion Baja", "Calificacion Alta"],
                datasets: [
                  {
                    label: ["# de Estudiantes"],
                    data: [10, 29],
                    backgroundColor: ["#60a5fa"],
                  },
                ],
              }}
              options={{}}
            />
          </div>
        </div>
      ),
    },
    {
      id: "Entregados-3",
      title: "3",
      content: () => (
        <div className="flex items-center gap-5 h-full w-full">
          <div className="basis-1/3">
            <FilterRangeGradesForm
              position="vertical"
              size={3}
              onSubmit={onSubmit}
            />
          </div>
          <div className="basis-2/3">
            <BarChart
              title="Cantidad de Estudiantes entregaron actividades"
              className="w-50 h-50"
              data={{
                labels: [
                  "Calificacion Baja",
                  "Calificacion Media",
                  "Calificacion Alta",
                ],
                datasets: [
                  {
                    label: ["# de Estudiantes"],
                    data: [10, 15, 20],
                    backgroundColor: ["#60a5fa"],
                  },
                ],
              }}
              options={{}}
            />
          </div>
        </div>
      ),
    },
  ];

  function onSubmit(data) {
    setFilter(data);
  }

  const items = [
    { id: 1, name: "Calificaciones Baja" },
    { id: 2, name: "Calificaciones Alta" },
  ];

  return (
    <div className="h-full w-full py-5 duration-300">
      <section className="mb-3 flex flex-col gap-5">
        <div className="flex flex-col">
          <div>
            <h6 className="text-xl font-semibold"># RANGOS DE CALIFICACION:</h6>
          </div>
          <div className="">
            <CustomTabs tabsConfig={tabsConfig} />
          </div>
        </div>
      </section>

      <section className="mb-3">
        <span className="text-mediun font-semibold">Nota:</span>
        <p className="border border-slate-500 p-1">
          Todos las calificaciones estan poderadas sobre 100.
        </p>
      </section>

      <section className="mb-3">
        <CheckboxListWithAccordion items={items} label="Estudiantes" />
      </section>
    </div>
  );
}
