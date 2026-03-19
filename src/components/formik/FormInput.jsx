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
        <label className={`block text-sm font-medium mb-2 text-foreground ${labelClass}`} htmlFor={name}>
          {label || COLUMN_LABELS[name]}
        </label>
      }
      <div
        className="flex w-full items-center rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-xs transition-colors focus-within:ring-1 focus-within:ring-ring"
      >
        {Icon && <Icon className="mr-2 text-muted-foreground" />}
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
          className="w-full focus:outline-none bg-transparent text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          id={name}
        />
      </div>
      <div className="text-left">
        {touched[name] && errors[name] && (
          <div className="text-destructive text-xs mt-1">
            {errors[name]}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormInput;
