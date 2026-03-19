import { FaChevronRight } from "react-icons/fa";

export default function ViewButton({ text, onClick, className, noIcon, alt, variant = 'default', size = 'sm' }) {
    const baseClasses = "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md font-medium transition-all cursor-pointer";

    const variants = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-border bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    };

    const sizes = {
        sm: 'h-7 px-2 py-1 text-xs',
        default: 'h-8 px-3 py-1 text-sm',
    };

    const variantClass = variants[variant] || variants.default;
    const sizeClass = sizes[size] || sizes.sm;

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${variantClass} ${sizeClass} ${className || ''}`}
        >
            <span className="tracking-wider">{text}</span>
            {!noIcon && <FaChevronRight className="h-3 w-3" />}
        </button>
    );
}
