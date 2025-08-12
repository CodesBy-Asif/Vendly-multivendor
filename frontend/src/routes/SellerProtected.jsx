// components/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";

export default function SellerProtected({ children }) {
  const { seller, isAuthenticated, loading } = useSelector(
    (state) => state.seller
  );
  console.log(isAuthenticated, seller);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
