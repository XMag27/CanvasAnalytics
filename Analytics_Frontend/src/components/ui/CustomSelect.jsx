const CustomSelect = ({ label, options, onChange, defaultValue = "" }) => {
  return (
    <div className="">
      <label className="font-semibold text-sm text-slate-800 mb-3">
        {label}
      </label>
      <select
        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-4 leading-8 transition-colors duration-200 ease-in-out"
        onChange={(e) => onChange(e.target.value)}
        defaultValue={defaultValue}
      >
        <option value="" disabled>
          Seleccione una opción
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomSelect;
