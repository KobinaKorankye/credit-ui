export default function AppInput({
  icon: Icon,
  placeholder,
  widthClass,
  className,
  value,
  onChange,
  type,
  name,
  disabled = false,
  ...props
}) {
    return (
        <div className={`relative flex items-center ${widthClass || className || ''}`}>
            {Icon && (
                <div className="absolute left-3 z-10 text-muted-foreground">
                    <Icon className="h-4 w-4" />
                </div>
            )}
            <input
                type={type || "text"}
                name={name}
                placeholder={placeholder || "Type here..."}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`
                    flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm
                    shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium
                    placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1
                    focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50
                    ${Icon ? 'pl-9' : ''}
                `}
                {...props}
            />
        </div>
    )
}