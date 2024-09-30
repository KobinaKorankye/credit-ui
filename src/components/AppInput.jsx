export default function AppInput({ icon: Icon, placeholder, widthClass }) {
    return (
        <div className={`flex gap-2 items-center rounded-2xl text-base h-[2.47rem] bg-white text-dark dark:bg-darkinputbg dark:text-darkinputtext px-[0.71rem] ${widthClass}`}>
            {Icon && <Icon />}
            <input placeholder={placeholder || "Type here..."} className="text-dark dark:bg-darkinputbg focus:outline-none text-xs placeholder-disabled" />
        </div>
    )
}