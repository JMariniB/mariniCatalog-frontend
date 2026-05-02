import React, { useState, useEffect } from "react";
import "./Sidebar.scss";
import { RiProductHuntLine } from "react-icons/ri";
import { HiOutlineChevronLeft } from "react-icons/hi";
import menu from "../../data/sidebar";
import SidebarItem from "./SidebarItem";
import { useNavigate } from "react-router-dom";
import { SidebarContext } from "../../context/SidebarContext";

const MOBILE_BREAKPOINT = 768;

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_BREAKPOINT
  );
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggle = () => {
    if (isMobile) {
      setIsMobileOpen((prev) => !prev);
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  const closeMobile = () => setIsMobileOpen(false);

  const goHome = () => navigate("/");

  const contextValue = { isOpen, isMobileOpen, isMobile, toggle, closeMobile };

  const sidebarClass = [
    "sidebar",
    isMobile
      ? isMobileOpen
        ? "sidebar--mobile-open"
        : "sidebar--mobile-hidden"
      : isOpen
      ? "sidebar--expanded"
      : "sidebar--collapsed",
  ].join(" ");

  const mainClass = [
    "main-content",
    isMobile
      ? "main-content--mobile"
      : isOpen
      ? "main-content--expanded"
      : "main-content--collapsed",
  ].join(" ");

  return (
    <SidebarContext.Provider value={contextValue}>
      <div className="layout">
        {/* Backdrop overlay for mobile */}
        {isMobile && isMobileOpen && (
          <div className="sidebar-backdrop" onClick={closeMobile} />
        )}

        <aside className={sidebarClass}>
          {/* Sidebar top: logo + collapse toggle */}
          <div className="sidebar-header">
            <div className="sidebar-logo" onClick={goHome} title="Ir al inicio">
              <RiProductHuntLine className="sidebar-logo__icon" />
              <span className="sidebar-logo__text">MariniCatalog</span>
            </div>
            {!isMobile && (
              <button
                className={`sidebar-collapse-btn ${!isOpen ? "sidebar-collapse-btn--rotated" : ""}`}
                onClick={toggle}
                title={isOpen ? "Colapsar" : "Expandir"}
              >
                <HiOutlineChevronLeft />
              </button>
            )}
          </div>

          {/* Navigation items */}
          <nav className="sidebar-nav">
            <ul>
              {menu.map((item, index) => (
                <SidebarItem
                  key={index}
                  item={item}
                  isOpen={isOpen || isMobile}
                />
              ))}
            </ul>
          </nav>

          {/* Sidebar footer */}
          <div className="sidebar-footer">
            <span className="sidebar-footer__text">v1.0.0</span>
          </div>
        </aside>

        <main className={mainClass}>{children}</main>
      </div>
    </SidebarContext.Provider>
  );
};

export default Sidebar;
