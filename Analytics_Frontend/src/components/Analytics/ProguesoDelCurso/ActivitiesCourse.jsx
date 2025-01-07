import { Table, View } from "@instructure/ui";
import React, { useState } from "react";
import { ToggleGroup } from "@instructure/ui-toggle-details";
import NoDataContainer from "@components/ui/messages/NoDataContent";

export default function ActivitiesCourse({ data }) {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const handleToggle = (activity) => {
    setSelectedActivity(activity);
  };

  return (
    <section className="flex flex-col text-center gap-3 ">
      <h6 className="text-3xl font-semibold my-5">Actividades</h6>
      <div className="flex gap-5">
        <div className="basis-1/3">
          <ToggleGroup
            key={"Actividad-2"}
            summary="Actividades"
            toggleLabel="Actividades"
            description="Selecciona una actividad y da clic"
          >
            <div className="flex flex-col">
              {data.map((it) => (
                <ToggleGroup
                  key={`${it.name}-${it.id}`}
                  summary={
                    <div className="flex justify-between align-center">
                      <span>{it.name}</span>
                      <span className="bg-gray-300 text-xs font-medium me-2 px-2.5 py-0.5 rounded ">
                        1/3
                      </span>
                    </div>
                  }
                  description={`${it.name}`}
                  toggleLabel={`${it.name}`}
                  onClick={() => handleToggle(it)}
                >
                  <span className="p-3">Promedio: 3</span>
                </ToggleGroup>
              ))}
            </div>
          </ToggleGroup>
        </div>
        <div className="basis-2/3">
          <View
            as="div"
            padding="medium"
            borderWidth="small"
            borderRadius="medium"
            background="secondary"
          >
            {selectedActivity ? (
              <>
                <Table layout="auto" caption="Activity Table">
                  <Table.Head className="bg-gray-400">
                    <Table.Row>
                      <Table.ColHeader
                        className="bg-gray-700"
                        id="activity_name"
                      >
                        Nombre de la Actividad
                      </Table.ColHeader>
                      <Table.ColHeader
                        className="bg-gray-300"
                        id="activity_average"
                      >
                        Promedio de la Actividad
                      </Table.ColHeader>
                      <Table.ColHeader id="activity_highest_grade">
                        Nota mas alta
                      </Table.ColHeader>
                      <Table.ColHeader id="activity_lowest_grade">
                        Nota mas Baja
                      </Table.ColHeader>
                    </Table.Row>
                  </Table.Head>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell textAlign="start">
                        {selectedActivity.name}
                      </Table.Cell>
                      <Table.Cell textAlign="center">2/3</Table.Cell>
                      <Table.Cell textAlign="center">3/3</Table.Cell>
                      <Table.Cell textAlign="center">1/3</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </>
            ) : (
              <NoDataContainer message="Selecciona una Actividad" />
            )}
          </View>
        </div>
      </div>
    </section>
  );
}
