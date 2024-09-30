import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function RegularInputAlt({
  boxClassName = '',
  label,
  icon,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onBlur,
  alt,
  disabled = false
}) {
  return (
    <div className={`mt-3 ${boxClassName}`}>
      <label className={`block text-[0.7rem] font-semibold tracking-wider mb-1 text-gray-600`} htmlFor={name}>
        {label || name}
      </label>
      <div
        className={`flex w-full items-center appearance-none rounded border ${alt ? 'border-slate-300' : 'border-accent'} w-full px-[0.5rem] py-[0.6rem] text-gray-900 
                leading-tight`}
      >
        {icon && (
          <FontAwesomeIcon
            className="mr-4 ml-1 text-gray-600/80"
            size="md"
            icon={icon}
          />
        )}
        <input
          name={name}
          type={type}
          disabled={disabled}
          onBlur={onBlur}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full focus:outline-none focus:shadow-outline bg-transparent text-[0.8rem] text-gray-900"
          id={name}
        />
      </div>
    </div>
  );
}
