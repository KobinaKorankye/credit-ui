import React from 'react';
import { useFormikContext } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function FormSelect({
  boxClassName,
  label,
  labelClass,
  icon,
  name,
  options,
  disabled,
}) {
  const {
    handleChange,
    errors,
    touched,
    setFieldTouched,
    values,
  } = useFormikContext();

  return (
    <div className={`mt-3 ${boxClassName}`}>
      <label className={`block text-gray-800 text-xs font-semibold mb-2 ${labelClass}`} htmlFor={name}>
        {label || name}
      </label>
      <div
        className="flex w-full items-center shadow appearance-none rounded border border-slate-300 py-2 px-3 h-[2.5rem] text-white 
                leading-tight"
      >
        {icon && <FontAwesomeIcon
          className="mr-4 ml-1 text-gray-600/80"
          size="md"
          icon={icon}
        />}
        <select
          name={name}
          disabled={disabled}
          onBlur={() => setFieldTouched(name)}
          value={values[name]}
          onChange={handleChange}
          className="w-full focus:outline-none focus:shadow-outline bg-transparent text-gray-900"
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
}
