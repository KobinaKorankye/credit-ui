import React, { useState } from 'react';

const TopNav = ({selected, setSelected, navItems}) => {

  return (
    <div className="flex gap-5 w-full justify-center pt-5">
      {navItems.map((item) => (
        <div
          key={item}
          onClick={() => setSelected(item)}
          className={`px-1 py-1 ${
            selected === item
              ? 'border-b-2 border-deepblue text-deeperblue font-bold'
              : 'text-gray-700'
          } cursor-pointer`}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default TopNav;