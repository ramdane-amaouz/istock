import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent
} from "@mui/material";

import { API_URL } from "../api";


function Home() {
  const [stats, setStats] = useState({ nb_produits: 0, nb_employes: 0 });
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch(`${API_URL}/stats?entreprise_id=${user.entreprise_id}`);
      const data = await response.json();
      setStats(data);
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  return (
    <Container maxWidth="md">
      <Paper sx={{ padding: 4, marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          🚀 Bienvenue sur iStock
        </Typography>

        <Typography variant="h6" color="text.secondary">
          Bonjour {user?.role === "admin" ? "Administrateur" : user?.login} !
        </Typography>

        <Typography sx={{ marginTop: 2, marginBottom: 3 }}>
          Voici un aperçu rapide de vos données :
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ backgroundColor: "#1976d2", color: "white" }}>
              <CardContent>
                <Typography variant="h6">📦 Produits</Typography>
                <Typography variant="h4">{stats.nb_produits}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ backgroundColor: "#d32f2f", color: "white" }}>
              <CardContent>
                <Typography variant="h6">👥 Employés</Typography>
                <Typography variant="h4">{stats.nb_employes}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default Home;
 