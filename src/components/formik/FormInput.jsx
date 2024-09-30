import { capitalize } from "@mui/material";
import { useFormikContext } from "formik";
import React from "react";
import { COLUMN_LABELS } from "../../constants";

const FormInput = ({
  boxClassName = '',
  label,
  labelClass = '',
  icon: Icon,
  name,
  type,
  noLabel,
  placeholder = '',
  disabled = false,
}) => {
  const {
    handleChange,
    errors,
    touched,
    setFieldTouched,
    values,
  } = useFormikContext();

  return (
    <div className={`${boxClassName}`}>
      {
        !noLabel &&
        <label className={`block text-[0.8rem] font-medium mb-1.5 text-gray-600`} htmlFor={name}>
          {label || COLUMN_LABELS[name]}
        </label>
      }
      <div
        className="flex w-full items-center shadow appearance-none rounded-lg border border-slate-300 px-4 py-2 text-gray-900 
                leading-tight"
      >
        {Icon && <Icon />}
        <input
          name={name}
          type={type}
          disabled={disabled}
          onBlur={() => {
            setFieldTouched(name);
          }}
          placeholder={placeholder}
          value={values[name] || ''}
          onChange={handleChange}
          className="w-full focus:outline-none focus:shadow-outline bg-transparent text-sm"
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
};

export default FormInput;
