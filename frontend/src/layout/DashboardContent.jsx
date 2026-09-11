import MobileTopBar from "@/components/layout/MobileTopBar";
import Navbar from "@/components/layout/Navbar";
import { useSidebar } from "@/context/SidebarContext";
import React from "react";

const DashboardContent = ({ children }) => {
  const { overlayRef, closeSidebar } = useSidebar();
  return (
    <>
      <MobileTopBar />
      <div className="app-shell">
        <div
          className="sidebar-overlay"
          id="sidebarOverlay"
          ref={overlayRef}
          onClick={closeSidebar}
        />
        <Navbar />
        {children}
      </div>
    </>
  );
};

export default DashboardContent;
