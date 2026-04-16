import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

function PrivateRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  // Pendant le chargement du user depuis /me
  if (loading) {
    return null; // ou un spinner
  }

  // Pas connecté
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Pas admin
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  if (loading) {
  return <div style={{ padding: 20 }}>Chargement session...</div>;
}


  return children;
}

export default PrivateRoute;
