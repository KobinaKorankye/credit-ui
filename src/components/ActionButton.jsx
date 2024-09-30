import React from "react";
import { BiPlus } from "react-icons/bi";

export default function ActionButton({ text, className, onClick, icon: Icon, noIcon }) {
    return (
        <div onClick={onClick} className={`flex gap-1 justify-center items-center px-4 py-2 ${className || 'bg-surface-light text-white'} cursor-pointer rounded-lg`}>
            {!noIcon && (Icon ? <Icon className="text-xl" /> : <BiPlus className="text-xl" />)}
            <div className="text-sm">{text}</div>
        </div>
    );
}
