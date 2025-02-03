import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const PrivateRoute = ({ element, adminOnly = false }) => {
  const { user, authLoading } = useContext(AuthContext);

  if (authLoading) {
    // Render a loader (or null) while authentication status is being determined.
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/admin" />;
  }

  return element;
};

export default PrivateRoute;
