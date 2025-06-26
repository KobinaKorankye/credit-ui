import React from "react";

export default function NavItem({ icon: Icon, text, isCollapsed, path, currentSideNavSection, onClick }) {
  return (
    <div onClick={onClick} className={`flex gap-2 ${isCollapsed ? 'justify-center' : 'px-2'} truncate tracking-wide rounded whitespace-nowrap overflow-hidden text-sm transition-all duration-100 items-center ${currentSideNavSection == text ? 'bg-[#004D81]' : ''} text-white border-b-[1px] border-gray-700 py-2 my-1 rounded-lg`}>
      <Icon className={'text-lg'} />
      {!isCollapsed && `${text}`}
    </div>
  );
}
