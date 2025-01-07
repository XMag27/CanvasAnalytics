import React, { useState } from "react";
import { BsBarChartFill } from "react-icons/bs";
import { BsXLg } from "react-icons/bs";

export default function AnalyticStudentGrade() {
  const [isOpen, setIsOpen] = useState(false);

  function handleCLick() {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <button className="py-3 px-7">
        <BsBarChartFill onClick={handleCLick} />
      </button>
      {isOpen && (
        <div className="h-scren z-20 w-[25rem] max-w-full mx-auto border border-slate-300 duration-300 absolute top-0 right-0 flex pt-[2.25rem] pb-[50rem] px-[2.25rem]">
          <section className="inline-flex justify-between">
            <span>Calificaciones</span>
            <button className="py-3 px-7">
              <BsXLg onClick={handleCLick} />
            </button>
          </section>
        </div>
      )}
    </>
  );
}
