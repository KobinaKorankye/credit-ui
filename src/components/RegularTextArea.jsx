import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function RegularTextArea({
    boxClassName,
    label,
    icon,
    name,
    placeholder,
    value,
    onChange,
    onBlur,
    disabled,
    rows = 4,
}) {
    return (
        <div className={`mt-3 ${boxClassName}`}>
            <label className="block text-xs font-semibold mb-1 text-gray-600" htmlFor={name}>
                {label || name}
            </label>
            <div
                className="flex w-full items-start appearance-none rounded border border-gray-400 w-full py-2 px-3 text-gray-900 
                leading-tight"
            >
                {icon && (
                    <FontAwesomeIcon
                        className="mr-4 ml-1 text-gray-600/80"
                        size="md"
                        icon={icon}
                    />
                )}
                <textarea
                    name={name}
                    disabled={disabled}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="w-full focus:outline-none focus:shadow-outline bg-transparent text-gray-900 resize-none"
                    id={name}
                    rows={rows}
                />
            </div>
        </div>
    );
}
