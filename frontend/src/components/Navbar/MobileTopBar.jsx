import { usePageLoadAnimation } from "@/animation/usePageLoadAnimation";
import { GraduationCap, Menu, Search } from "lucide-react";
import React from "react";

const MobileTopBar = () => {
  return (
    <div className="mobile-topbar">
      <button className="icon-btn" id="mobileMenuBtn" aria-label="Open menu">
        <Menu />
      </button>
      <div className="mobile-brand">
        <GraduationCap />
        <span>ia Academy</span>
      </div>
      <button className="icon-btn" id="mobileSearchBtn" aria-label="Search">
        <Search />
      </button>
    </div>
  );
};

export default MobileTopBar;
