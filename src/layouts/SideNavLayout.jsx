import {
  faArrowLeft,
  faChartGantt,
  faChartSimple,
  faDashboard,
  faGreaterThan,
  faLessThan,
  faPerson,
  faUser,
  faUsers,
  faUsersRays,
} from "@fortawesome/free-solid-svg-icons";
import { BsFillBellFill, BsPeople, BsPerson } from "react-icons/bs";
import { TbAnalyze, TbDashboard, TbSettingsFilled } from "react-icons/tb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import NavItem from "../components/NavItem";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentSideNavSection, toggleNavbar } from "../store/navSlice";
import { BiPackage, BiSearch } from "react-icons/bi";
import { HiViewGrid } from "react-icons/hi";
import AppInput from "../components/AppInput";

const sidenavs = [
  {
    text: "Dashboard",
    icon: HiViewGrid,
    path: "/",
  },
  {
    text: "Applicants",
    icon: BsPeople,
    path: "/applicants",
  },
  {
    text: "Products",
    icon: BiPackage,
    path: "/products",
  },
];

const othernavs = [
  {
    text: "Applicant Analysis",
    path: "/analysis",
  },
];

export default function SideNavLayout({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const currentSideNavSection = useSelector((state) => state.nav.currentSideNavSection);
  const isCollapsed = useSelector((state) => state.nav.collapsed);

  const toggle = () => {
    dispatch(toggleNavbar());
  };

  useEffect(() => {
    sidenavs.forEach((sidenav) => {
      if (sidenav.path === pathname) {
        dispatch(setCurrentSideNavSection(sidenav.text))
      }
    })
  }, [pathname])

  return (
    <div className="flex h-screen w-full font-sans">
      <div
        className={`flex flex-col duration-300 ${isCollapsed ? "w-[5%]" : "w-[15%]"
          } items-end bg-accent`}
      >
        <div
          onClick={toggle}
          className="w-full bg-white relative flex justify-start text-lg font-bold items-center text-sm gap-2 font-serif px-5 py-7 text-gray-700"
        >
          <TbAnalyze className="text-4xl" />
          {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">Credit Analytics</span>}

        </div>
        <div
          className={`flex-1 flex flex-col px-5 gap-2 mt-5 cursor-pointer w-full font-bold text-sm`}
        >
          {sidenavs.map((nav, index) => (
            <NavItem
              key={index}
              isCollapsed={isCollapsed}
              onClick={() => {
                navigate(nav.path);
              }}
              currentSideNavSection={currentSideNavSection}
              {...nav}
            />
          ))}

          <div className="mt-auto mx-2 mb-1 flex flex-col gap-2">
            <div className="underline text-surface" onClick={() => navigate("/german")}>{isCollapsed ? 'P' : "Public"}</div>
            <div className="underline text-surface" onClick={() => navigate("/adehyeman")}>{isCollapsed ? 'L' : "Local"}</div>
          </div>
        </div>
      </div>
      <div
        className={`flex flex-col ${isCollapsed ? "w-[95%]" : "w-[85%]"
          } h-screen overflow-y-auto p-10 bg-[#EEEFF4]`}
      >
        <div className="flex w-full items-center text-xs">
          {[...sidenavs].find((nav) => nav.path === pathname) && <div className="flex text-dark w-full items-center font-medium gap-1">
            <div className="text-gray-400">Pages</div>
            <div>/</div>
            <div>{[...sidenavs].find((nav) => nav.path === pathname)?.text}</div>
            <div className="flex gap-7 items-center ml-auto">
              <AppInput icon={BiSearch} placeholder="Type here..." />

              <div className="flex gap-2 items-center font-semibold text-gray-600 text-sm">
                <BsPerson className="text-lg" />
                <div>Ebo</div>
              </div>

              <div className="flex gap-4 text-lg items-center text-gray-600 text-base">
                <TbSettingsFilled />
                <BsFillBellFill />
              </div>

            </div>
          </div>}
          {[...othernavs].find((nav) => nav.path === pathname) && <div className="flex items-center text-dark font-medium gap-1">
            <FontAwesomeIcon
              onClick={() => navigate(-1)}
              className="cursor-pointer mr-3 text-base"
              icon={faArrowLeft}
            />
            <div className="text-gray-400">Pages</div>
            <div>/</div>
            <div>{currentSideNavSection}</div>
            <div>/</div>
            <div>{[...othernavs].find((nav) => nav.path === pathname)?.text}</div>
          </div>}
        </div>
        <div className="flex w-full items-center font-serif text-xl mt-3 mb-7 text-dark font-bold">
          {[...sidenavs, ...othernavs].find((nav) => nav.path === pathname)?.text}
        </div>
        {children}
      </div>
    </div>
  );
}
