import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { StudentProvider } from "./context/StudentContext.jsx";
import { TeacherProvider } from "./context/TeacherContext.jsx";
import { LibraryProvider } from "./context/LibraryContext.jsx";
import { AttendanceProvider } from "./context/AttendanceContext.jsx";
import { SubjectProvider } from "./context/SubjectContext.jsx";
import { ClassProvider } from "./context/ClassContext.jsx";
import { RoutineProvider } from "./context/RoutineContext.jsx";
import DashboardLayout from "./layout/DashboardLayout.jsx";
import HomePage from "./pages/Home/HomePage.jsx";
import AllStudents from "./pages/students/AllStudents.jsx";
import AllTeachers from "./pages/teachers/AllTeachers.jsx";
import Library from "./pages/Library/Library.jsx";
import Account from "./pages/account/Account.jsx";
import Attendance from "./pages/Attendance/Attendance.jsx";
import Subject from "./pages/Subject/Subject.jsx";
import Class from "./pages/Class/Class.jsx";
import Routine from "./pages/Routine/Routine.jsx";
import StudentDetail from "./pages/StudentDetails/StudentDetail.jsx";
import AuthPage from "./pages/auth/AuthPage.jsx";
import { ToastProvider } from "./components/ui";

const App = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <StudentProvider>
            <TeacherProvider>
              <LibraryProvider>
                <AttendanceProvider>
                  <SubjectProvider>
                    <ClassProvider>
                      <RoutineProvider>
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
                          <Route
                            path="/allteachers"
                            element={
                              <ProtectedRoute>
                                <DashboardLayout>
                                  <AllTeachers />
                                </DashboardLayout>
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/allteachers/teacherdetail/:id"
                            element={
                              <ProtectedRoute>
                                <DashboardLayout>
                                  <AllTeachers />
                                </DashboardLayout>
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/library"
                            element={
                              <ProtectedRoute>
                                <DashboardLayout>
                                  <Library />
                                </DashboardLayout>
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/account"
                            element={
                              <ProtectedRoute>
                                <DashboardLayout>
                                  <Account />
                                </DashboardLayout>
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/attendance"
                            element={
                              <ProtectedRoute>
                                <DashboardLayout>
                                  <Attendance />
                                </DashboardLayout>
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/subject"
                            element={
                              <ProtectedRoute>
                                <DashboardLayout>
                                  <Subject />
                                </DashboardLayout>
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/class"
                            element={
                              <ProtectedRoute>
                                <DashboardLayout>
                                  <Class />
                                </DashboardLayout>
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/routine"
                            element={
                              <ProtectedRoute>
                                <DashboardLayout>
                                  <Routine />
                                </DashboardLayout>
                              </ProtectedRoute>
                            }
                          />
                        </Routes>
                      </RoutineProvider>
                    </ClassProvider>
                  </SubjectProvider>
                </AttendanceProvider>
              </LibraryProvider>
            </TeacherProvider>
          </StudentProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
