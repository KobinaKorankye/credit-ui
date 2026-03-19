import React from 'react';

const RegularSelectAlt = ({
  boxClassName = '',
  label,
  icon: Icon,
  name,
  value,
  options,
  onChange,
  onBlur,
  disabled = false,
  error,
  required,
  ...props
}) => {
  return (
    <div className={`space-y-2 ${boxClassName}`}>
      {label && (
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
          htmlFor={name}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <select
          name={name}
          disabled={disabled}
          onBlur={onBlur}
          value={value}
          onChange={onChange}
          required={required}
          className={`
            flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm
            shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1
            focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50
            ${Icon ? 'pl-9' : ''}
            ${error ? 'border-destructive focus-visible:ring-destructive' : ''}
          `}
          id={name}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

export default RegularSelectAlt;
