import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();

  // ⏳ WAIT
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  // 🔐 NOT LOGGED IN
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 ROLE BLOCK
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;