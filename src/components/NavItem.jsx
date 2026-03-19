import React from "react";

export default function NavItem({ icon: Icon, text, isCollapsed, path, currentSideNavSection, onClick }) {
  const isActive = currentSideNavSection === text;

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`
          flex items-center gap-2.5 w-full px-2.5 py-1.5 text-[13px] font-medium rounded-md transition-all duration-150
          ${isCollapsed ? 'justify-center px-0 py-2' : 'justify-start'}
          ${isActive
            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          }
        `}
      >
        <Icon className="text-[15px] shrink-0" />
        {!isCollapsed && (
          <span className="truncate">{text}</span>
        )}
      </button>
      {isCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 bg-popover text-popover-foreground text-xs font-medium rounded-md shadow-md border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
          {text}
        </div>
      )}
    </div>
  );
}
