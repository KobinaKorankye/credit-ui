import React from 'react';

const MiniSideNav = ({selected, setSelected, navItems}) => {
  return (
    <div className="flex flex-col bg-card border border-border shadow-sm rounded-xl overflow-hidden min-w-[200px] lg:min-w-[240px]">
      {navItems.map((item, index) => (
        <button
          key={item}
          onClick={() => setSelected(item)}
          className={`px-4 lg:px-6 py-3 lg:py-4 text-left transition-all duration-200 ${
            selected === item
              ? 'bg-primary text-primary-foreground font-medium shadow-sm border-r-2 border-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          } ${index === 0 ? 'rounded-t-xl' : ''} ${index === navItems.length - 1 ? 'rounded-b-xl' : ''} text-sm lg:text-base`}
        >
          <span className="truncate">{item}</span>
        </button>
      ))}
    </div>
  );
};

export default MiniSideNav;