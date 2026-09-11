import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { StudentProvider } from "./context/StudentContext.jsx";
import DashboardLayout from "./layout/DashboardLayout.jsx";
import HomePage from "./pages/Home/HomePage.jsx";
import AllStudents from "./pages/students/AllStudents.jsx";
import StudentDetail from "./pages/StudentDetails/StudentDetail.jsx";
import AuthPage from "./pages/auth/AuthPage.jsx";
import { ToastProvider } from "./components/ui";

const App = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <StudentProvider>
            <Routes>
              <Route path="/login" element={<AuthPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <HomePage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/allstudents"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <AllStudents />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/allstudents/studentdetail/:id"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <AllStudents />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/studentDetail"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <StudentDetail />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </StudentProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
