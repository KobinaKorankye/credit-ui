import React, { useState } from 'react';

export default function ObjSelect({
  boxClassName = '',
  label,
  icon: Icon,
  name,
  options,
  value,
  onChange,
  disabled,
  sameValue,
  noEmpty
}) {

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
          value={value}
          onChange={onChange}
          className="w-full focus:outline-none focus:shadow-outline bg-transparent text-sm"
          id={name}
        >
          {!noEmpty && <option key={0} value={" "}>{" "}</option>}
          {options && Object.entries(options).map(([key, value], index) => (
            <option key={index + 1} value={sameValue?value:key}>{value}</option>
          ))}
        </select>
      </div>
    </div>
  );
};