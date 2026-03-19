import React from "react";
import { useFormikContext } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function RegularSelect({
  boxClassName,
  options,
  label,
  labelClass,
  icon,
  name,
  value,
  onChange,
  onBlur,
  disabled,
  labelsMap={},
  error,
  placeholder = "Select an option...",
  ...props
}) {
  return (
    <div className={`space-y-2 ${boxClassName || ''}`}>
      {label && (
        <label
          className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground ${labelClass || ''}`}
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10">
            <FontAwesomeIcon
              className="h-4 w-4"
              icon={icon}
            />
          </div>
        )}
        <select
          name={name}
          disabled={disabled}
          onBlur={onBlur}
          value={value}
          onChange={onChange}
          className={`
            flex h-10 sm:h-9 w-full rounded-md border border-input bg-background px-3 py-2 sm:py-1 text-base sm:text-sm
            shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1
            focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 touch-target
            ${icon ? 'pl-10 sm:pl-9' : ''}
            ${error ? 'border-destructive focus-visible:ring-destructive' : ''}
          `}
          id={name}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options?.map((option) => (
            <option key={option} value={option}>
              {labelsMap[option] || option}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
