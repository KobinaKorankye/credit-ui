import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function RegularInput({
  boxClassName,
  label,
  icon,
  name,
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  disabled,
  error,
  ...props
}) {
  return (
    <div className={`space-y-2 ${boxClassName || ''}`}>
      {label && (
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <FontAwesomeIcon
              className="h-4 w-4 sm:h-4 sm:w-4"
              icon={icon}
            />
          </div>
        )}
        <input
          name={name}
          type={type || 'text'}
          disabled={disabled}
          onBlur={onBlur}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`
            flex h-10 sm:h-9 w-full rounded-md border border-input bg-background px-3 py-2 sm:py-1 text-base sm:text-sm
            shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium
            placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1
            focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 touch-target
            ${icon ? 'pl-10 sm:pl-9' : ''}
            ${error ? 'border-destructive focus-visible:ring-destructive' : ''}
          `}
          id={name}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
