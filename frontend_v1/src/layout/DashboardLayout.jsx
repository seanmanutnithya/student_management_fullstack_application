import { SidebarProvider } from "@/context/SidebarContext";
import React from "react";
import DashboardContent from "./DashboardContent";

const DashboardLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
};

export default DashboardLayout;
