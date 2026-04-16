import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../auth/AuthContext.jsx";

function Menu() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav>
      <span>
        {user ? `👋 Bonjour ${user?.login || ""}` : ""}
      </span>

      <button><Link className="home" to="/">Home</Link></button>
      <button><Link className="article" to="/article">Article</Link></button>
      <button><Link className="ajout" to="/ajouter-article">Ajouter un article</Link></button>

      {isAdmin && (
        <button><Link to="/employer">Employer</Link></button>
      )}
      {isAdmin && (
        <button><Link to="/ajouter-employe">Ajouter Employé</Link></button>
      )}

      <button><Link className="contact" to="/contact">Contact</Link></button>

      {user && (
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "8px 12px",
            borderRadius: "4px"
          }}
        >
          Se déconnecter
        </button>
      )}
    </nav>
  );
}

export default Menu;
