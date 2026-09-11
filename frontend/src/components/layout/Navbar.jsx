import { navLinks } from "@/assets/data/navLinks";

import Branding from "../Navbar/Branding";
import { NavLink, useLocation } from "react-router-dom";
import { useSidebar } from "@/context/SidebarContext";
const Navbar = () => {
  const { pathname } = useLocation();
  const { sidebarRef } = useSidebar();
  return (
    <>
      {/* <!-- Sidebar  (Home active) --> */}
      <aside className="sidebar" id="sidebar" ref={sidebarRef}>
        <Branding />
        <nav className="sidebar-nav">
          {navLinks.map((item, idx) => {
            const Icon = item.icon;
            const Title = item.title;
            const isGroupActive =
              item.isGroup &&
              item.groupItems.some((sub) => pathname === sub.to);
            return item.isGroup ?
                <div className="nav-group" key={idx}>
                  <button
                    className={`nav-item nav-parent ${isGroupActive ? "is-active" : ""}`}
                    aria-expanded="false">
                    <Icon />
                    <span>{Title}</span>
                    <item.chevron />
                  </button>
                  <div className="nav-submenu">
                    {item.groupItems.map((sub, subIdx) => (
                      <NavLink
                        to={sub.to}
                        key={subIdx}
                        className={({ isActive }) =>
                          `nav-subitem ${isActive ? "is-active" : ""}`
                        }>
                        {sub.title}
                      </NavLink>
                    ))}
                  </div>
                </div>
              : <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "is-active" : ""} `
                  }
                  key={idx}>
                  <Icon />
                  <span>{Title}</span>
                </NavLink>;
          })}
        </nav>
      </aside>
    </>
  );
};

export default Navbar;
