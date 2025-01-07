import React from "react";
import { FaBoxOpen } from "react-icons/fa";

const NoDataContainer = ({ message = "No Data Provided" }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 border border-gray-300 rounded-lg">
      <FaBoxOpen className="text-gray-400 text-6xl mb-4" />
      <p className="text-gray-500 text-lg font-semibold">{message}</p>
    </div>
  );
};

export default NoDataContainer;
