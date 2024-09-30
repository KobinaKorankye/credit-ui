import { FaChevronRight } from "react-icons/fa";

export default function ViewButton({ text, onClick, className, noIcon, alt }) {

    return (

        <div onClick={onClick} className={` cursor-pointer duration-200 transition-all flex px-[0.4rem] py-[0.1rem] ${className?className:'bg-surface text-white'} text-[0.65rem] gap-1 items-center rounded`}>
            <div className="tracking-wider">{text}</div>
            {!noIcon && <FaChevronRight className="text-[0.6rem]" />}
        </div>

    );
}
