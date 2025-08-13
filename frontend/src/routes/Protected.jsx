// components/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
