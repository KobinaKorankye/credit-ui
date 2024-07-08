import {
  faChartSimple,
  faDashboard,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import NavItem from "../components/NavItem";

const navs = [
  {
    text: "Dashboard",
    icon: faChartSimple,
  },
  // {
  //   text: "Applicants",
  //   icon: faUser,
  // },
];

export default function SideNavLayout({ children }) {
  const [selectedNav, setSelectedNav] = useState(navs[0].text);

  return (
    <div className="grid grid-cols-5 h-screen w-full">
      <div className="flex flex-col items-end bg-gradient-to-b from-deepblue to-deeperblue">
        <div className="w-full font-bold text-xl text-center p-5 py-20 text-cyan-300">
          Transflow
        </div>
        <div className="flex-1 flex flex-col gap-5 cursor-pointer w-[70%] font-bold uppercase text-sm">
          {navs.map((nav) => (
            <NavItem
              onClick={() => setSelectedNav(nav.text)}
              selectedNav={selectedNav}
              {...nav}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col col-span-4 p-10 bg-[#EEEFF4]">
        {children}
      </div>
    </div>
  );
}
