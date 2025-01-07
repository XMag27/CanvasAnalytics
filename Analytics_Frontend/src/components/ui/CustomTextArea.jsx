import React from "react";

const CustomTextArea = ({
  label,
  placeholder = "",
  rows = 4,
  onChange,
  defaultValue = "",
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex flex-col gap-1 text-sm font-semibold text-gray-600">{label}</label>
      <textarea
        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 my-1 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        placeholder={placeholder}
        rows={rows}
        defaultValue={defaultValue}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default CustomTextArea;
