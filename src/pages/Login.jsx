import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Box
} from "@mui/material";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { supabase } from "../supabaseClient";

function Login() {
  const [email, setEmail] = useState("");       // on utilise email pour Supabase
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setMessage("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setMessage(`❌ ${error.message}`);
        return;
      }

      // Ici: session OK. AuthProvider va appeler /me automatiquement.
      setMessage("✅ Connexion réussie");
      navigate("/");
    } catch (e) {
      console.error(e);
      setMessage("❌ Erreur lors de la connexion.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          <i className="fas fa-sign-in-alt"></i> Connexion à iStock
        </Typography>

        <Box noValidate>
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Mot de passe"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
          >
            <i className="fas fa-sign-in-alt"></i> Se connecter
          </Button>

          {message && (
            <Alert
              severity={message.startsWith("✅") ? "success" : "error"}
              sx={{ marginTop: 2 }}
            >
              {message}
            </Alert>
          )}

          <Typography sx={{ marginTop: 2 }} align="center">
            Pas encore de compte ?{" "}
            <Link to="/register">Créer un compte</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
