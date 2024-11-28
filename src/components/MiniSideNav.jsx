import React, { useState } from 'react';

const MiniSideNav = ({selected, setSelected, navItems}) => {

  return (
    <div className="flex flex-col bg-white sticky top-0 w-full border shadow rounded-l overflow-hidden justify-center">
      {navItems.map((item) => (
        <div
          key={item}
          onClick={() => setSelected(item)}
          className={`px-5 py-3 ${
            selected === item
              ? 'bg-surface-light/10 border-2 border-surface-light text-gray-800 font-medium rounded-l'
              : 'text-gray-700'
          } cursor-pointer w-full text-sm`}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default MiniSideNav;