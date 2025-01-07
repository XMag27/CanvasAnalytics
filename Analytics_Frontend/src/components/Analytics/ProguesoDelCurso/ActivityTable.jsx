import React, { useState } from "react";
import NoDataContent from "@components/ui/messages/NoDataContent";
import { IoIosArrowDown } from "react-icons/io";

export default function ActivityTable({
  tableData,
  renderTable,
  title = "Actividades",
  disableTable = false,
  labelItems = "Nombre de Grupos",
  labelValue = "Estudiantes",
}) {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(null);

  const activities = Object.keys(tableData).map((key, index) => ({
    id: index + 1,
    name: key,
  }));

  const handleAccordionToggle = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
    setSelectedActivity(activities.find((activity) => activity.id === id));
  };

  return (
    <>
      <h6 className="text-center text-xl font-semibold my-5">{title}</h6>

      <div className=" flex flex-col md:flex-row gap-4 p-4">
        {/* Primera Sección: Accordion */}
        <div className="w-full md:w-1/3 border border-gray-300 rounded-lg p-2 flex flex-col gap-2">
          <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 ">
            <div className="flex items-center justify-between gap-2">
              <input
                type="checkbox"
                className="w-5 h-5 cursor-pointer"
                checked={true}
                readOnly
              />
              <span className="font-medium capitalize">{labelItems}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium capitalize">{labelValue}</span>
            </div>
          </div>
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="border-2 border-gray-300 bg-gray-200"
            >
              <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100"
                onClick={() => handleAccordionToggle(activity.id)}
              >
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="checkbox"
                    className="w-5 h-5 cursor-pointer"
                    checked={openAccordion === activity.id}
                    readOnly
                  />
                  <span className="font-medium capitalize">
                    {activity.name}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className=" inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-gray-500 text-white">
                    1/3
                  </span>
                  <span
                    className={`transition-transform ${
                      openAccordion === activity.id ? "-rotate-90" : "rotate-0"
                    }`}
                  >
                    <IoIosArrowDown />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Segunda Sección: Tabla */}
        {!disableTable && (
          <div className="w-full md:w-2/3 border border-gray-300 rounded-lg p-2">
            {selectedActivity ? (
              renderTable(tableData[selectedActivity.name])
            ) : (
              <NoDataContent message="Selecciona una actividad" />
            )}
          </div>
        )}
      </div>
    </>
  );
}
