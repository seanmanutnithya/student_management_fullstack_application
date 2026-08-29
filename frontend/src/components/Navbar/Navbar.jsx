import { navbarAssets } from "./assets";
import Branding from "./Branding";
import { NavLink } from "react-router-dom";
const Navbar = () => {
  return (
    <>
      <div className="app-shell">
        {/* <!-- Sidebar  (Home active) --> */}
        <aside className="sidebar" id="sidebar">
          <Branding />
          <nav className="sidebar-nav">
            {navbarAssets.map((item, idx) => {
              const Icon = item.icon;
              const Title = item.title;
              return item.isGroup ?
                  <div className="nav-group" key={idx}>
                    <button
                      className="nav-item nav-parent"
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
      </div>
    </>
  );
};

export default Navbar;
