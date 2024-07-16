import {
  faArrowLeft,
  faChartGantt,
  faChartSimple,
  faDashboard,
  faGreaterThan,
  faLessThan,
  faUser,
  faUsers,
  faUsersRays,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import NavItem from "../components/NavItem";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleNavbar } from "../store/navSlice";

const navs = [
  {
    text: "Dashboard",
    icon: faChartSimple,
    path: "/",
  },
  {
    text: "Applicants",
    icon: faUsers,
    path: "/applicants",
  },
  // {
  //   text: "Applicants",
  //   icon: faUser,
  // },
];

export default function SideNavLayout({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const isCollapsed = useSelector((state) => state.nav.collapsed);

  const toggle = () => {
    dispatch(toggleNavbar());
  };

  return (
    <div className="flex h-screen w-full">
      <div
        className={`flex flex-col duration-300 ${
          isCollapsed ? "w-[5%]" : "w-[20%]"
        } items-end bg-sky-900`}
      >
        <div
          onClick={toggle}
          className="w-full relative flex justify-center items-center font-bold text-xl gap-3 px-5 py-20 text-cyan-100"
        >
          {!isCollapsed && <span>Credit Analytics</span>}
          <FontAwesomeIcon size="lg" icon={faChartGantt} />
          <div className="absolute flex justify-end items-center w-full h-full">
            <div className="p-2 bg-white rounded-l-lg text-cyan-800">
            <FontAwesomeIcon size="sm" icon={isCollapsed?faGreaterThan:faLessThan} />
            </div>
          </div>
        </div>
        <div
          className={`flex-1 flex flex-col gap-5 cursor-pointer w-[70%] font-bold uppercase text-sm`}
        >
          {navs.map((nav) => (
            <NavItem
              onClick={() => {
                navigate(nav.path);
              }}
              selectedNav={pathname}
              {...nav}
            />
          ))}
        </div>
      </div>
      <div
        className={`flex flex-col ${
          isCollapsed ? "w-[95%]" : "w-[80%]"
        } h-screen overflow-y-scroll p-10 bg-[#EEEFF4]`}
      >
        {children}
      </div>
    </div>
  );
}
