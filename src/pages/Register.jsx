import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, TextField, Button, Typography, Alert, Paper, Box } from "@mui/material";
import { supabase } from "../supabaseClient";

function Register() {
  const navigate = useNavigate();

  // Auth Supabase
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Données onboarding (entreprise + employé)
  const [entrepriseNom, setEntrepriseNom] = useState("");
  const [localisation, setLocalisation] = useState("");
  const [proprietaire, setProprietaire] = useState("");
  const [employeNom, setEmployeNom] = useState("");
  const [employePrenom, setEmployePrenom] = useState("");
  const [employeTel, setEmployeTel] = useState("");
  const [employeEmail, setEmployeEmail] = useState("");

  const [message, setMessage] = useState("");

  /*const handleRegister = async () => {
    setMessage("");

    try {
      // 1) Créer le user dans Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setMessage(`❌ ${signUpError.message}`);
        return;
      }

      // Si Supabase demande confirmation email, la session peut être null ici
      // On essaie de récupérer la session
      const { data: sessionData } = await supabase.auth.getSession();
      const hasSession = !!sessionData?.session;

      if (!hasSession) {
        setMessage(
          "✅ Compte créé. Vérifie ton email pour confirmer le compte, puis reconnecte-toi."
        );
        // Tu peux aussi rediriger vers login
        navigate("/login");
        return;
      }

      // 2) Appeler la RPC d’onboarding pour créer entreprise/employé/profil (istock.utilisateur)
      const { data: rpcData, error: rpcError } = await supabase.rpc("onboard_company_and_user", {
        p_entreprise_nom: entrepriseNom,
        p_localisation: localisation || null,
        p_proprietaire: proprietaire || null,
        p_employe_nom: employeNom || null,
        p_employe_prenom: employePrenom || null,
        p_employe_tel: employeTel || null,
        p_employe_email: employeEmail || null,
      });

      if (rpcError) {
        // Important : si la RPC échoue, l’utilisateur Supabase existe quand même.
        // Tu peux afficher l’erreur et proposer de réessayer.
        setMessage(`❌ Onboarding DB échoué: ${rpcError.message}`);
        return;
      }

      setMessage("✅ Inscription terminée !");
      navigate("/");
    } catch (e) {
      console.error(e);
      setMessage("❌ Erreur pendant l'inscription.");
    }
  };*/

  // Dans src/pages/Register.jsx
  const handleRegister = async () => {
    try {
      // 1. Inscription dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Si succès, on envoie les détails entreprise/employé à ton FastAPI
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entreprise_nom: entrepriseNom,
          localisation,
          login: email, // Utilise l'email comme login
          nom: employeNom,
          prenom: employePrenom,
          tel: employeTel,
          email: employeEmail,
          password: password, // Ton API devra toujours gérer le hash côté Python
        }),
      });

      if (!res.ok) throw new Error("Échec de la création en base de données");

      setMessage("✅ Compte créé avec succès !");
      navigate("/login");
    } catch (e) {
      setMessage(`❌ Erreur: ${e.message}`);
    }
  };


  ///=========

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Créer un compte iStock
        </Typography>

        <Box noValidate>
          <Typography variant="h6" sx={{ mt: 1 }}>
            Compte (Supabase Auth)
          </Typography>

          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ marginBottom: 2, marginTop: 1 }}
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

          <Typography variant="h6" sx={{ mt: 2 }}>
            Entreprise
          </Typography>

          <TextField
            label="Nom de l'entreprise"
            fullWidth
            value={entrepriseNom}
            onChange={(e) => setEntrepriseNom(e.target.value)}
            required
            sx={{ marginBottom: 2, marginTop: 1 }}
          />
          <TextField
            label="Localisation"
            fullWidth
            value={localisation}
            onChange={(e) => setLocalisation(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Propriétaire"
            fullWidth
            value={proprietaire}
            onChange={(e) => setProprietaire(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <Typography variant="h6" sx={{ mt: 2 }}>
            Employé (optionnel)
          </Typography>

          <TextField
            label="Nom"
            fullWidth
            value={employeNom}
            onChange={(e) => setEmployeNom(e.target.value)}
            sx={{ marginBottom: 2, marginTop: 1 }}
          />
          <TextField
            label="Prénom"
            fullWidth
            value={employePrenom}
            onChange={(e) => setEmployePrenom(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Téléphone"
            fullWidth
            value={employeTel}
            onChange={(e) => setEmployeTel(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Email employé"
            fullWidth
            value={employeEmail}
            onChange={(e) => setEmployeEmail(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <Button variant="contained" fullWidth onClick={handleRegister}>
            Créer le compte
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
            Déjà un compte ? <Link to="/login">Se connecter</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register;
