import React from "react";

export default function NavItem({ icon: Icon, text, isCollapsed, path, currentSideNavSection, onClick }) {
  return (
    <div onClick={onClick} className={`flex font-serif gap-2 ${isCollapsed ? 'justify-center' : 'px-5'} truncate tracking-wide rounded whitespace-nowrap overflow-hidden text-xs transition-all duration-100 items-center ${currentSideNavSection == text ? 'text-teal-500 bg-[#404040]' : 'text-gray-300'} border-b-[1px] border-gray-700 py-5`}>
      <Icon className={'text-xl'} />
      {!isCollapsed && `${text}`}
    </div>
  );
}
