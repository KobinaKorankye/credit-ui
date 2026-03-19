import {
  faArrowLeft,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { BsPeople } from "react-icons/bs";
import { TbAnalyze } from "react-icons/tb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import NavItem from "../components/NavItem";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentSideNavSection, toggleNavbar } from "../store/navSlice";
import { BiCog, BiLogOut, BiMoneyWithdraw, BiPackage } from "react-icons/bi";
import { HiViewGrid } from "react-icons/hi";

const sidenavs = [
  {
    text: "Dashboard",
    icon: HiViewGrid,
    path: "/dashboard",
  },
  {
    text: "Applicants",
    icon: BsPeople,
    path: "/applicants",
  },
  {
    text: "Loans",
    icon: BiMoneyWithdraw,
    path: "/loans",
  },
  {
    text: "Products",
    icon: BiPackage,
    path: "/products",
  },
];

const othernavs = [
  {
    text: "Loanee Analysis",
    path: "/analysis",
  },
  {
    text: "Applicant Analysis",
    path: "/applicant-analysis",
  },
];

export default function SideNavLayout({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { user, setUser } = useContext(UserContext);
  const currentSideNavSection = useSelector((state) => state.nav.currentSideNavSection);
  const isCollapsed = useSelector((state) => state.nav.collapsed);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggle = () => {
    dispatch(toggleNavbar());
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const logout = () => {
    localStorage.removeItem('credit-ui-user');
    setUser(null);
  };

  useEffect(() => {
    sidenavs.forEach((sidenav) => {
      if (sidenav.path === pathname) {
        dispatch(setCurrentSideNavSection(sidenav.text))
      }
    })
  }, [pathname])

  // Close mobile menu when route changes
  useEffect(() => {
    closeMobileMenu();
  }, [pathname]);

  return (
    <div className="flex h-screen w-full p-2">
      <div className="flex h-full w-full bg-background">
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeMobileMenu}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
          flex flex-col bg-sidebar text-sidebar-foreground rounded-xl border-r border-sidebar-border transition-all duration-300 z-50
          ${isCollapsed ? "w-14" : "w-52"}
          lg:relative lg:translate-x-0
          ${isMobileMenuOpen ? "fixed inset-y-0 left-0 translate-x-0" : "fixed inset-y-0 left-0 -translate-x-full lg:translate-x-0"}
        `}
        >
          {/* Header */}
          <div
            onClick={toggle}
            className="flex items-center gap-2.5 px-3 py-3 border-b border-sidebar-border cursor-pointer hover:bg-sidebar-accent/10 transition-colors"
          >
            <div className="flex items-center justify-center w-7 h-7 bg-sidebar-primary rounded-md shrink-0">
              <TbAnalyze className="text-base text-sidebar-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <div className="text-sm font-semibold text-sidebar-foreground truncate">Credit Analytics</div>
                <div className="text-[10px] text-sidebar-foreground/60 leading-tight">Dashboard</div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex-1 flex flex-col px-2 py-3">
            {!isCollapsed && (
              <div className="text-[10px] uppercase tracking-wider font-semibold text-sidebar-foreground/50 px-2 pb-2">
                Main
              </div>
            )}
            <nav className="space-y-0.5">
              {sidenavs.map((nav, index) => (
                <NavItem
                  key={index}
                  isCollapsed={isCollapsed}
                  onClick={() => {
                    navigate(nav.path);
                    closeMobileMenu();
                  }}
                  currentSideNavSection={currentSideNavSection}
                  {...nav}
                />
              ))}
            </nav>

            {/* Settings section */}
            <div className="mt-auto pt-4">
              {!isCollapsed && (
                <div className="text-[10px] uppercase tracking-wider font-semibold text-sidebar-foreground/50 px-2 pb-2">
                  System
                </div>
              )}
              <NavItem
                isCollapsed={isCollapsed}
                onClick={() => {
                  navigate("/settings");
                  closeMobileMenu();
                }}
                currentSideNavSection={currentSideNavSection}
                text="Settings"
                icon={BiCog}
              />
            </div>
          </div>

          {/* User Profile & Logout */}
          <div className="border-t border-sidebar-border px-2 py-2.5 space-y-1">
            {/* User info */}
            <div className={`relative group flex items-center gap-2.5 px-2.5 py-1.5 rounded-md ${isCollapsed ? 'justify-center px-0' : ''}`}>
              <div className="w-7 h-7 rounded-full bg-sidebar-primary flex items-center justify-center text-[11px] font-semibold text-sidebar-primary-foreground shrink-0 uppercase">
                {(user?.name || user?.email || 'U').charAt(0)}
              </div>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-[13px] font-medium text-sidebar-foreground truncate">
                    {user?.name || user?.email?.split('@')[0] || 'User'}
                  </span>
                  <span className="text-[10px] text-sidebar-foreground/50 truncate capitalize">
                    {user?.role || 'Member'}
                  </span>
                </div>
              )}
              {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 bg-popover text-popover-foreground text-xs font-medium rounded-md shadow-md border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  {user?.name || user?.email?.split('@')[0] || 'User'}
                </div>
              )}
            </div>

            {/* Logout button */}
            <div className="relative group">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className={`
                  flex items-center gap-2.5 w-full px-2.5 py-1.5 text-[13px] font-medium rounded-md transition-all duration-150
                  text-sidebar-foreground/50 hover:bg-destructive/10 hover:text-destructive
                  ${isCollapsed ? 'justify-center px-0 py-2' : 'justify-start'}
                `}
              >
                <BiLogOut className="text-[15px] shrink-0" />
                {!isCollapsed && <span>Sign out</span>}
              </button>
              {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1 bg-popover text-popover-foreground text-xs font-medium rounded-md shadow-md border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  Sign out
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Logout Confirmation Dialog */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowLogoutConfirm(false)} />
            <div className="relative bg-card border border-border rounded-xl shadow-lg p-6 w-full max-w-sm mx-4">
              <h3 className="text-lg font-semibold text-foreground">Sign out</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Are you sure you want to sign out? You will need to log in again to access your account.
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-md transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 lg:px-6 py-3 border-b border-border">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors touch-target"
              aria-label="Toggle mobile menu"
            >
              <FontAwesomeIcon
                icon={isMobileMenuOpen ? faTimes : faBars}
                className="text-lg text-foreground"
              />
            </button>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {[...othernavs].find((nav) => nav.path === pathname) && (
                <button
                  onClick={() => navigate(-1)}
                  className="p-1 hover:bg-muted rounded-md transition-colors mr-1"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
                </button>
              )}
              <span>Pages</span>
              {[...othernavs].find((nav) => nav.path === pathname) && (
                <>
                  <span>/</span>
                  <span>{currentSideNavSection}</span>
                </>
              )}
              <span>/</span>
              <span className="text-foreground font-medium">
                {[...sidenavs, ...othernavs].find((nav) => nav.path === pathname)?.text}
              </span>
            </div>
          </div>

          {/* Page Title */}
          <div className="px-4 lg:px-6 pt-4 lg:pt-6 pb-2 lg:pb-4">
            <h1 className="text-xl lg:text-2xl font-bold text-foreground">
              {[...sidenavs, ...othernavs].find((nav) => nav.path === pathname)?.text}
            </h1>
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto px-4 lg:px-6 pt-0 bg-background">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
