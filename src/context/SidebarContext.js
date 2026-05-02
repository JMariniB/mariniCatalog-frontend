import { createContext, useContext } from "react";

export const SidebarContext = createContext({
  isOpen: true,
  isMobileOpen: false,
  isMobile: false,
  toggle: () => {},
  closeMobile: () => {},
});

export const useSidebar = () => useContext(SidebarContext);
