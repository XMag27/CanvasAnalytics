import React, { forwardRef } from "react";

const CustomInput = forwardRef(
  ({ label, placeholder, type = "text", className }, ref) => {
    return (
      <div className={className}>
        <label className="font-semibold text-sm text-slate-800">{label}</label>
        <input
          className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
          type={type}
          placeholder={placeholder}
          ref={ref}
        />
      </div>
    );
  }
);

export default CustomInput;
