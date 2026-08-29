import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home/HomePage.jsx";
import AllStudents from "./pages/AllStudnents/AllStudents.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import MobileTopBar from "./components/layout/MobileTopBar.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <MobileTopBar />
      <div className="app-shell">
        <div className="sidebar-overlay" id="sidebarOverlay" />
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/allstudents" element={<AllStudents />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
