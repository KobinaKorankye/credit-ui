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
      <label className={`block text-[0.8rem] font-medium mb-1.5 text-gray-600`} htmlFor={name}>
        {label}
      </label>
      <div
        className="flex w-full items-center shadow appearance-none rounded border border-slate-300 px-4 py-2 text-gray-900 
                leading-tight"
      >
        {Icon && <Icon />}
        <select
          name={name}
          disabled={disabled}
          onBlur={() => setFieldTouched(name)}
          value={values[name] || ''}
          onChange={handleChange}
          className="w-full focus:outline-none focus:shadow-outline bg-transparent text-sm"
          id={name}
        >
          <option key={1} value={""}>{""}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
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

export default FormSelect;
