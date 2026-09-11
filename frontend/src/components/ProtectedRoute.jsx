import { Navigate } from "react-router-dom";
import { useAuther } from "@/context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthericated } = useAuther();
  return isAuthericated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
