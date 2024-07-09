import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormikContext } from "formik";
import React from "react";

export default function FormInput({
  boxClassName,
  label,
  labelClass,
  icon,
  name,
  type,
  placeholder,
  disabled,
}) {
  const { handleChange, errors, touched, setFieldTouched, values } =
    useFormikContext();

  return (
    <div className={`mt-3 ${boxClassName}`}>
      <label className={`block text-xs mb-2 font-semibold text-gray-800`} for={name}>
        {label || name}
      </label>
      <div
        className="flex w-full items-center shadow appearance-none rounded border border-slate-300 w-full py-2 px-3 h-[2.5rem] text-gray-900 
                leading-tight "
      >
        {icon && <FontAwesomeIcon
          className="mr-4 ml-1 text-gray-600/80"
          size="md"
          icon={icon}
        />}
        <input
          name={name}
          type={type}
          disabled={disabled}
          onBlur={() => {
            setFieldTouched(name);
          }}
          placeholder={placeholder}
          value={values[name]}
          onChange={handleChange}
          className="w-full focus:outline-none focus:shadow-outline bg-transparent text-gray-900"
          id={name}
        />
      </div>
      <div className="text-left">
        {touched[name] && errors[name] && (
          <div className="text-amber-500 text-xs">
            {errors[name]}
          </div>
        )}
      </div>
    </div>
  );
}
