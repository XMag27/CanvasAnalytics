import React, { forwardRef, useImperativeHandle, useRef } from "react";

const GradeRangeInput = forwardRef(({ label, onValuesChange }, ref) => {
  const ref1 = useRef(null);
  const ref2 = useRef(null);

  useImperativeHandle(
    ref,
    () => ({
      ref1,
      ref2,
    }),
    []
  );

  const handleInputChange = () => {
    if (ref1.current || ref2.current) {
      onValuesChange({
        value1: ref1.current.value,
        value2: ref2.current.value,
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-1 justify-center items-center">
      <div className="text-lg font-bold">{label}</div>
      <div className="flex justify-around items-center">
        <span className="font-medium">De</span>
        <input
          ref={ref1}
          className="border border-slate-800 p-2 w-1/6"
          type="text"
          min={0}
          max={100}
          name="value1"
          id="value1"
          onChange={handleInputChange}
        />
        <span className="font-medium">a</span>
        <input
          ref={ref2}
          className="border border-slate-800 p-2 w-1/6"
          type="text"
          name="value2"
          id="value2"
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
});

export default GradeRangeInput;
