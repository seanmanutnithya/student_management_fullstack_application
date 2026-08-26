import Navbar from "../components/Navbar/Navbar.jsx";
import HomePage from "../pages/Home/HomePage.jsx";
const UserInterface = () => {
  return (
    <div className="app-shell">
      <div className="sidebar-overlay" id="sidebarOverlay"></div>
      <Navbar />
      <HomePage />
    </div>
  );
};

export default UserInterface;
