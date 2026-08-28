import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home/HomePage.jsx";
import AllStudents from "./pages/AllStudnents/AllStudents.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";

const App = () => (
  <BrowserRouter>
    <div className="app-shell">
      <div className="sidebar-overlay" id="sidebarOverlay" />
      <Navbar />

      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/allstudents" element={<AllStudents />} />
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;
