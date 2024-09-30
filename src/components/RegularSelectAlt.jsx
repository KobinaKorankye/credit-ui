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
  alt
}) => {
  return (
    <div className={`${boxClassName}`}>
      <label className={`block text-[0.7rem] font-[600] tracking-wider mb-1 text-tblue`} htmlFor={name}>
        {label || name}
      </label>
      <div
        className={`flex w-full items-center shadow appearance-none rounded border ${alt ? 'border-slate-300' : 'border-accent'} px-[0.5rem] py-[0.6rem] text-gray-900 
        leading-tight`}
      >
        {Icon && <Icon />}
        <select
          name={name}
          disabled={disabled}
          onBlur={onBlur}
          value={value}
          onChange={onChange}
          className="w-full focus:outline-none dark:text-zinc-400 focus:shadow-outline bg-transparent text-[0.8rem] font-[500]"
          id={name}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RegularSelectAlt;
