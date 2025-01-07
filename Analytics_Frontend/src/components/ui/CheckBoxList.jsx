import React, { useState } from "react";

const CheckboxList = ({ items, label = "Todos" }) => {
  const [selectedItems, setSelectedItems] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  const handleCheckboxChange = (id) => {
    setSelectedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleParentCheckboxChange = () => {
    const newState = !selectAll;
    setSelectAll(newState);

    const newSelectedState = {};
    items.forEach((item) => {
      newSelectedState[item.id] = newState;
    });
    setSelectedItems(newSelectedState);
  };

  return (
    <div className="max-w-[400px] w-full mx-auto">
      <div className="flex flex-col gap-1">
        <div>
          <span className="text-sm">Todo</span>
          <label className="flex aling-center text-sm items-center px-2">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleParentCheckboxChange}
              className="size-4 mr-4"
            />
            <span className="text-sm font-bold">{label}</span>
          </label>
          <hr className="my-3 mx-0 border-gray-600" />
        </div>
        {items.map((item) => (
          <div key={item.id}>
            <label className="flex aling-center items-center text-sm px-2">
              <input
                type="checkbox"
                checked={selectedItems[item.id] || false}
                onChange={() => handleCheckboxChange(item.id)}
                className="size-4 mr-4"
              />
              {item.name}
            </label>
            <hr className="my-3 mx-0 border-gray-600" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxList;
