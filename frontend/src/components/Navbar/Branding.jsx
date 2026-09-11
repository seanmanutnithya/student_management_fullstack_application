import { GraduationCap, X } from "lucide-react";
import { IconButton } from "@/components/ui";
import { useSidebar } from "@/context/SidebarContext";

const Branding = () => {
  const { sidebarRef, overlayRef, closeSidebar } = useSidebar();
  return (
    <>
      <div className="sidebar-brand">
        <div className="brand-icon">
          <GraduationCap />
        </div>
        <span className="brand-name">Ia Academy</span>
        <IconButton
          icon={X}
          className="sidebar-close"
          id="sidebarCloseBtn"
          label="Close menu"
          onClick={closeSidebar}
        />
      </div>
    </>
  );
};

export default Branding;
