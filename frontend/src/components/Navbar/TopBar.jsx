import { Bell, ChevronDown, MessageSquare, Search } from "lucide-react";
const TopBar = () => {
  return (
    <div>
      <header className="topbar">
        <div className="search-field">
          <Search />
          <input
            type="text"
            placeholder="What do you want to find?"
            aria-label="Search"
          />
        </div>
        <div className="topbar-actions">
          <button className="icon-btn" aria-label="Notifications">
            <Bell />
            <span className="dot-badge"></span>
          </button>
          <button className="icon-btn" aria-label="Messages">
            <MessageSquare />
          </button>
          <button className="user-chip" aria-label="Account menu">
            <img
              src="https://i.pravatar.cc/64?img=47"
              alt=""
              className="user-avatar"
            />
            <span className="user-meta">
              <span className="user-name">Priscilla Lily</span>
              <span className="user-role">Admin</span>
            </span>
            <ChevronDown />
          </button>
        </div>
      </header>
    </div>
  );
};

export default TopBar;
