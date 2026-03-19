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
    <div className={`space-y-2 ${boxClassName}`}>
      <label className="text-sm font-medium leading-none text-foreground" htmlFor={name}>
        {label || name}
      </label>
      <div className="relative">
        <div
          className={`flex w-full items-center rounded border border-input bg-background px-3 py-2 text-foreground shadow-xs transition-colors focus-within:ring-1 focus-within:ring-ring`}
        >
          {icon && (
            <FontAwesomeIcon
              className="mr-3 text-muted-foreground h-4 w-4"
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
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            id={name}
          />
        </div>
      </div>
    </div>
  );
}
