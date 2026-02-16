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


import { API_URL } from "../api";



function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ Connexion réussie, rôle : ${data.role}`);
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/");
      } else {
        const err = data?.detail || data?.message || "Erreur inconnue";
        setMessage(`❌ ${err}`);
      }

    } catch (error) {
      console.error(error);
      setMessage("Erreur de connexion à l'API.");
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
            label="Login"
            fullWidth
            value={login}
            onChange={(e) => setLogin(e.target.value)}
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
            <Link to="/register">
              Créer un compte
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
