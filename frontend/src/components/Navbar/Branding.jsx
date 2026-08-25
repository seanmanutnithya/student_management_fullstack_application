import { GraduationCap, X } from "lucide-react";

const Branding = () => {
  return (
    <>
      <div className="sidebar-brand">
        <div className="brand-icon">
          <GraduationCap />
        </div>
        <span className="brand-name">Ia Academy</span>
        <button
          className="icon-btn sidebar-close"
          id="sidebarCloseBtn"
          aria-label="Close menu">
          <X />
        </button>
      </div>
    </>
  );
};

export default Branding;
