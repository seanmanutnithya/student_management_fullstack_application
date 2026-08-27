import { navbarAssets } from "./assets";
import Branding from "./Branding";
import { pageLoadAnimation } from "../../animation/pageLoadAnimation";
import { useEffect } from "react";
const Navbar = () => {
  useEffect(() => {
    pageLoadAnimation();
  }, []);
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
                      <i className="chevron">
                        <item.chevron />
                      </i>
                    </button>
                    <div className="nav-submenu">
                      {item.groupItems.map((sub, subIdx) => (
                        <a key={subIdx} className="nav-subitem">
                          {sub.title}
                        </a>
                      ))}
                    </div>
                  </div>
                : <a href="" className="nav-item" key={idx}>
                    <Icon />
                    <span>{Title}</span>
                  </a>;
            })}
          </nav>
        </aside>
      </div>
    </>
  );
};

export default Navbar;
