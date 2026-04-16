import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  Paper,
  Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { API_URL } from "../api";



function AjouterArticle() {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [qte, setQte] = useState("");
  const [message, setMessage] = useState("");
  const [categorie,setCategorie] = useState("");

  const navigate = useNavigate();

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setMessage("❌ Vous devez être connecté.");
      navigate("/login");
      return;
    }

    const entrepriseId = user.entreprise_id;
    const employerId = user.employer_id;

    try {
      const response = await fetch(`${API_URL}/add-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom,
          description,
          prix: parseFloat(prix),
          qte: parseInt(qte, 10),
          entreprise_id: entrepriseId,
          employer_id: employerId,
          categorie
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ Article ajouté avec succès (idp = ${data.idp})`);
        setNom("");
        setDescription("");
        setPrix("");
        setQte("");
        setCategorie("");
      } else {
        setMessage(`❌ ${data.detail ?? data.message ?? "Erreur"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de la connexion à l'API.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          📦 Ajouter un article
        </Typography>

        <Box component="form" onSubmit={handleAddProduct} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nom de l'article"
                fullWidth
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Catégorie"
                fullWidth
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
                required
              />
            </Grid>
            

            <Grid item xs={12} sm={6}>
              <TextField
                label="Prix unitaire (€)"
                fullWidth
                type="number"
                inputProps={{ step: "0.01", min: "0" }}
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantité"
                fullWidth
                type="number"
                inputProps={{ min: "0" }}
                value={qte}
                onChange={(e) => setQte(e.target.value)}
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
            ➕ Ajouter l'article
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

export default AjouterArticle;
