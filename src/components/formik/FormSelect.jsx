import React from 'react';
import { useFormikContext } from 'formik';

const FormSelect = ({
  boxClassName = '',
  label,
  labelClass = '',
  icon: Icon,
  name,
  options,
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
      <label className={`block text-sm font-medium mb-2 text-foreground ${labelClass}`} htmlFor={name}>
        {label}
      </label>
      <div
        className="flex w-full items-center rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-xs transition-colors focus-within:ring-1 focus-within:ring-ring"
      >
        {Icon && <Icon className="mr-2 text-muted-foreground" />}
        <select
          name={name}
          disabled={disabled}
          onBlur={() => setFieldTouched(name)}
          value={values[name] || ''}
          onChange={handleChange}
          className="w-full focus:outline-none bg-transparent text-sm disabled:cursor-not-allowed disabled:opacity-50"
          id={name}
        >
          <option key={1} value={""}>Select an option...</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
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

export default FormSelect;
