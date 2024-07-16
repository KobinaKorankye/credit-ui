import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function NavItem({icon, text, path, selectedNav, onClick}) {
  return (
    <div onClick={onClick} className={`flex gap-5 duration-100 items-center pl-5 ${selectedNav==path?'rounded-l-xl bg-gradient-to-r from-white to-[#EEEFF4] text-gray-600':'text-gray-300'} py-4`}>
      <FontAwesomeIcon size="xl" icon={icon} />
      {text}
    </div>
  );
}
