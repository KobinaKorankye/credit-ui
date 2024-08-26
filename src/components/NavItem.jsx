import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function NavItem({icon, text, path, selectedNav, onClick}) {
  return (
    <div onClick={onClick} className={`flex gap-5 px-5 truncate rounded-full text-xs duration-100 items-center ${selectedNav==path?'bg-gradient-to-r from-white to-[#EEEFF4] text-sky-700':'text-white'} py-3`}>
      <FontAwesomeIcon icon={icon} />
      {text}
    </div>
  );
}
