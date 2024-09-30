import React from "react";

export default function NavItem({ icon: Icon, text, isCollapsed, path, currentSideNavSection, onClick }) {
  return (
    <div onClick={onClick} className={`flex rounded-xl gap-2 ${isCollapsed ? 'justify-center' : 'px-5'} truncate tracking-wide rounded whitespace-nowrap overflow-hidden text-sm transition-all duration-100 items-center ${currentSideNavSection == text ? 'bg-white text-primary' : 'text-white'} py-3`}>
      <Icon className={'text-xl'} />
      {!isCollapsed && `${text}`}
    </div>
  );
}
