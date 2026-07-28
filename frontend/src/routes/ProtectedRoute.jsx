import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  // Wait until localStorage is checked
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading...</h3>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;