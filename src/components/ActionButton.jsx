import React from "react";
import { BiPlus } from "react-icons/bi";

export default function ActionButton({
  text,
  className,
  onClick,
  icon: Icon,
  noIcon,
  variant = 'default',
  size = 'default',
  disabled = false
}) {
    const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

    const variants = {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive: 'bg-destructive text-primary-foreground shadow-xs hover:bg-destructive/90',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        outline: 'border border-border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
    };

    const sizes = {
        default: 'h-10 sm:h-9 px-4 py-2 text-sm touch-target',
        sm: 'h-9 sm:h-8 px-3 py-1 text-sm touch-target',
        lg: 'h-11 sm:h-10 px-6 py-2 text-sm touch-target',
    };

    const variantClass = variants[variant] || variants.default;
    const sizeClass = sizes[size] || sizes.default;

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClass} ${sizeClass} ${className || ''}`}
        >
            {!noIcon && (Icon ? <Icon className="h-4 w-4" /> : <BiPlus className="h-4 w-4" />)}
            <span>{text}</span>
        </button>
    );
}
