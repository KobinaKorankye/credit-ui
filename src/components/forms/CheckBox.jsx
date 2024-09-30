import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function CheckBox({
  boxClassName,
  label,
  icon,
  name, checked,
  disabled, onChange
}) {

  return (
    <div className={`${boxClassName}`}>
      <div
        className="flex items-center px-1 text-gray-700"
      >
        {icon && <FontAwesomeIcon
          className="text-gray-600/80"
          size="lg"
          icon={icon}
        />}
        <input
          name={name}
          type={'checkbox'}
          disabled={disabled}
          checked={checked}
          onChange={onChange}
          className="cursor-pointer focus:outline-none focus:shadow-outline bg-transparent text-gray-800 w-4 h-4 accent-black"
          id={name}
        />
      </div>
    </div>
  );
}
