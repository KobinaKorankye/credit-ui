import React from "react";
import ViewButton from "./ViewButton";

export default function Card({ children, onClick, title, titleClassName, alt, className, containerClassName, showView, viewBtnClassName, onViewClick }) {
    return (
        <div onClick={onClick} className={`${className} bg-white shadow ${alt ? 'rounded' : 'rounded-3xl'}`}>
            <div className={`w-full h-full ${containerClassName} px-4 py-3 flex flex-col ${alt ? 'rounded' : 'rounded-3xl'}`}>
                <div className="text-sm font-semibold text-dark w-full flex items-center">
                    {title && <div className={`${titleClassName ? titleClassName : 'text-gray-700'}`}>{title}</div>}
                    {showView && <div className="ml-auto"><ViewButton className={viewBtnClassName} text={"View"} onClick={onViewClick} /></div>}
                </div>
                {children}
            </div>
        </div>
    );
}
