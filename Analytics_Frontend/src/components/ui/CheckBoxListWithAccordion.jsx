import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import SubCheckboxList from "./SubCheckBoxList";

const CheckboxListWithAccordion = ({ items, label = "Todo" }) => {
  const [selectedItems, setSelectedItems] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  const handleParentCheckboxChange = () => {
    const newState = !selectAll;
    setSelectAll(newState);

    const newSelectedState = {};
    items.forEach((item) => {
      newSelectedState[item.id] = newState;
    });
    setSelectedItems(newSelectedState);
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleAccordionToggle = (id) => {
    setExpandedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleSubCheckboxChange = (parentId, childIds, isSelected) => {
    setSelectedItems((prevState) => {
      const updatedState = { ...prevState };
      childIds.forEach((childId) => {
        updatedState[childId] = isSelected;
      });
      return updatedState;
    });
  };

  return (
    <div className="w-full mx-auto">
      <div className="flex flex-col gap-1">
        <div>
          <span className="text-lg">Todo</span>
          <label className="flex aling-center text-lg items-center px-4">
            <input
              className="size-4 mr-4"
              type="checkbox"
              checked={selectAll}
              onChange={handleParentCheckboxChange}
              style={{ marginRight: "8px" }}
            />
            <span className="text-md font-bold">{label}</span>
          </label>
          <hr className="my-3 mx-0 border-gray-600" />
        </div>

        {/* Checkbox Hijos */}
        {items.map((item) => (
          <div key={item.id}>
            <label className="flex aling-center items-center text-lg px-4">
              <input
                className="size-4 mr-4"
                type="checkbox"
                checked={selectedItems[item.id] || false}
                onChange={() => handleCheckboxChange(item.id)}
                style={{ marginRight: "8px" }}
              />
              <span className="flex-1">{item.name}</span>
              <button
                type="button"
                onClick={() => handleAccordionToggle(item.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#007BFF",
                  cursor: "pointer",
                  padding: "4px 0",
                  textAlign: "left",
                  display: "block",
                }}
              >
                {expandedItems[item.id] ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </label>

            {expandedItems[item.id] && (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <SubCheckboxList
                  parentId={item.id}
                  parentName={item.name}
                  onSubCheckboxChange={handleSubCheckboxChange}
                />
              </div>
            )}

            <hr className="my-3 mx-0 border-gray-600" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxListWithAccordion;
