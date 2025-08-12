// components/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function SellerProtected({ children }) {
  const { isAuthenticated, loading } = useSelector((state) => state.seller);

  if (loading) {
    return <div className="p-4 text-center">Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
