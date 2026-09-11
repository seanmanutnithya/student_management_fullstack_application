import { IconButton } from "@/components/ui";
import { useSidebar } from "@/context/SidebarContext";

import { GraduationCap, Menu, Search } from "lucide-react";
import { useRef, useState } from "react";
const MobileTopBar = () => {
  const { overlayRef, closeSidebar, openSidebar } = useSidebar();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      closeSidebar();
    }
  };

  return (
    <div className="mobile-topbar">
      <IconButton
        icon={Menu}
        id="mobileMenuBtn"
        label="Open menu"
        onClick={() => openSidebar()}
      />
      <div className="mobile-brand">
        <GraduationCap />
        <span>ia Academy</span>
      </div>
      <IconButton
        icon={Search}
        id="mobileSearchBtn"
        label="Search"
        onClick={() => setSearchOpen(true)}
      />
    </div>
  );
};

export default MobileTopBar;
