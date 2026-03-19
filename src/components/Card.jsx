import React from "react";
import ViewButton from "./ViewButton";

export default function Card({ children, onClick, title, titleClassName, alt, className, containerClassName, showView, viewBtnClassName, onViewClick }) {
    return (
        <div
            onClick={onClick}
            className={`
                bg-card text-card-foreground border border-border rounded-xl shadow-sm transition-all duration-200
                ${onClick ? 'cursor-pointer hover:shadow-md' : ''}
                ${className || ''}
            `}
        >
            <div className={`w-full h-full py-4 px-2 lg:p-6 flex flex-col gap-3 lg:gap-4 ${containerClassName || ''}`}>
                {title && (
                    <div className="flex items-center justify-between">
                        <h3 className={`font-semibold leading-none ${titleClassName || 'text-card-foreground'}`}>
                            {title}
                        </h3>
                        {showView && (
                            <ViewButton
                                className={viewBtnClassName}
                                text="View"
                                onClick={onViewClick}
                            />
                        )}
                    </div>
                )}
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}
