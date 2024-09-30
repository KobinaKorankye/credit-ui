import { useFormikContext } from "formik";
import React from "react";

const AppInput = ({
  boxClassName = '',
  label,
  labelClass = '',
  icon: Icon,
  name,
  type,
  value,
  onChange,
  placeholder = '',
  disabled = false,
}) => {

  return (
    <div className={`${boxClassName}`}>
      <label className={`block text-[0.8rem] font-medium mb-1.5 text-gray-600`} htmlFor={name}>
        {label}
      </label>
      <div
        className="flex w-full items-center shadow appearance-none rounded-lg border border-slate-300 px-4 py-2 text-gray-900 
                leading-tight"
      >
        {Icon && <Icon />}
        <input
          name={name}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full focus:outline-none focus:shadow-outline bg-transparent text-sm"
          id={name}
        />
      </div>
    </div>
  );
};

export default AppInput;
