import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  Box,
  Paper,
  Autocomplete
} from "@mui/material";
import "@fortawesome/fontawesome-free/css/all.min.css";


import { API_URL } from "../api";


function Register() {
  const [entrepriseNom, setEntrepriseNom] = useState("");
  const [localisation, setLocalisation] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [localisationOptions, setLocalisationOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  if (localisation.length < 3) {
    setLocalisationOptions([]);
    return;
  }

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(localisation)}&limit=5`
      );
      const data = await response.json();
      const labels = data.features?.map(
        (feature) => feature.properties.label
      ) || [];
      setLocalisationOptions(labels);
    } catch (error) {
      console.error(error);
    }
  };

  fetchData();
}, [localisation]);


  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("❌ Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entreprise_nom: entrepriseNom,
          localisation,
          nom,
          prenom,
          tel,
          email,
          login,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Compte créé avec succès !");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(`❌ ${data.message}`);
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
          <i className="fas fa-user-plus"></i> Créer un compte Admin
        </Typography>

        <Box component="form" onSubmit={handleRegister} noValidate>
          <Typography variant="h6" gutterBottom color="primary">
            <i className="fas fa-building"></i> Entreprise
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nom entreprise"
                fullWidth
                value={entrepriseNom}
                onChange={(e) => setEntrepriseNom(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                options={localisationOptions}
                value={localisation}
                fullWidth
                onInputChange={(event, newValue) => {
                  setLocalisation(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Localisation"
                    fullWidth
                    required
                  />
                )}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom color="primary" sx={{ marginTop: 3 }}>
            <i className="fas fa-user-tie"></i> Employé Admin
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nom"
                fullWidth
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Prénom"
                fullWidth
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Téléphone"
                fullWidth
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom color="primary" sx={{ marginTop: 3 }}>
            <i className="fas fa-lock"></i> Compte
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Login"
                fullWidth
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Mot de passe"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Confirmer mot de passe"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Grid>
          </Grid>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ marginTop: 3 }}
          >
            <i className="fas fa-user-plus"></i> Créer le compte
          </Button>

          {message && (
            <Alert
              severity={message.startsWith("✅") ? "success" : "error"}
              sx={{ marginTop: 2 }}
            >
              {message}
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;
