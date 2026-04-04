import { useAuth } from "./auth/AuthContext";
import Spinner from "./components/Spinner";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;

  if (!user) return <Navigate to="/account/login" replace />;

  return children;
};

export default ProtectedRoute;