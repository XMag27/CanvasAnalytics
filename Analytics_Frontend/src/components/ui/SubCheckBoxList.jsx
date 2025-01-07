import React, { useState } from "react";
import { BiDownload } from "react-icons/bi";

const SubCheckboxList = ({ parentId, parentName, onSubCheckboxChange }) => {
  const subItems = [
    { id: `${parentId}-1`, name: `Natasha` },
    { id: `${parentId}-2`, name: `Aisha` },
    { id: `${parentId}-3`, name: `Sabrina` },
  ];

  const [subSelectedItems, setSubSelectedItems] = useState({});

  const handleParentSubCheckboxChange = () => {
    const newState = !Object.values(subSelectedItems).every(Boolean);
    const updatedSubSelected = {};
    subItems.forEach((subItem) => {
      updatedSubSelected[subItem.id] = newState;
    });
    setSubSelectedItems(updatedSubSelected);

    onSubCheckboxChange(
      parentId,
      subItems.map((item) => item.id),
      newState
    );
  };

  const handleSubCheckboxChange = (subId) => {
    setSubSelectedItems((prevState) => ({
      ...prevState,
      [subId]: !prevState[subId],
    }));
  };

  const handleDownloadUpTask = () => {};

  return (
    <div>
      {/* <label className="flex items-center font-semibold">
        <input
          type="checkbox"
          checked={Object.values(subSelectedItems).every(Boolean)}
          onChange={handleParentSubCheckboxChange}
          className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        Seleccionar Todos los Hijos
      </label> */}

      {subItems.map((subItem) => (
        <label key={subItem.id} className="flex items-center justify-between">
          <div>
            <input
              type="checkbox"
              checked={!!subSelectedItems[subItem.id]}
              onChange={() => handleSubCheckboxChange(subItem.id)}
              className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="text-lg">{subItem.name}</span>
          </div>
          <p>
            Calificacion: <span>50</span>
          </p>
          <button onClick={() => handleDownloadUpTask()}>
            <BiDownload className="text-xl text-blue-500" />
          </button>
        </label>
      ))}
    </div>
  );
};

export default SubCheckboxList;
