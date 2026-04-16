import { useState, useEffect } from "react";
import {
  Container, Table, TableHead, TableRow, TableCell,
  TableBody, TextField, Button, Paper, Typography, Alert,
  FormControl, InputLabel, Select, MenuItem, Box
} from "@mui/material";

import { API_URL } from "../api";

function Article() {
  const [articles, setArticles] = useState([]);
  const [qteModifs, setQteModifs] = useState({});
  const [message, setMessage] = useState("");

  const [categories, setCategories] = useState([]);
  const [categorieSelectionnee, setCategorieSelectionnee] = useState(""); // "" = toutes

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?.entreprise_id) return;

    const controller = new AbortController();

    const load = async () => {
      try {
        // 1) Categories (1 fois à l'init)
        const resCat = await fetch(
          `${API_URL}/categories?entreprise_id=${user.entreprise_id}`,
          { signal: controller.signal }
        );
        const dataCat = await resCat.json();
        if (resCat.ok) setCategories(dataCat);
        else setMessage(`❌ ${dataCat.detail ?? dataCat.message ?? "Erreur catégories"}`);

        // 2) Articles (avec filtre optionnel)
        const params = new URLSearchParams({ entreprise_id: String(user.entreprise_id) });
        if (categorieSelectionnee) params.append("categorie", categorieSelectionnee);

        const resArt = await fetch(`${API_URL}/articles?${params.toString()}`, {
          signal: controller.signal
        });
        const dataArt = await resArt.json();
        if (resArt.ok) setArticles(dataArt);
        else setMessage(`❌ ${dataArt.detail ?? dataArt.message ?? "Erreur articles"}`);

      } catch (e) {
        // Si AbortError => normal quand on change de page / re-render
        if (e.name !== "AbortError") {
          console.error(e);
          setMessage("❌ Erreur réseau.");
        }
      }
    };

    load();

    return () => controller.abort();
  }, [user?.entreprise_id, categorieSelectionnee]); // dépendances stables

  const handleChangeQte = (idp, value) => {
    setQteModifs((prev) => ({ ...prev, [idp]: value }));
  };

  const handleSave = async (idp) => {
    const nouvelleQte = parseInt(qteModifs[idp], 10);
    if (Number.isNaN(nouvelleQte)) {
      setMessage("❌ Quantité invalide.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/update-quantity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idp,
          nouvelle_qte: nouvelleQte,
          employer_id: user.employer_id
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Quantité mise à jour !");
        setArticles((prev) =>
          prev.map((a) => (a.idp === idp ? { ...a, qte: nouvelleQte } : a))
        );
      } else {
        setMessage(`❌ ${data.detail ?? data.message ?? "Erreur mise à jour"}`);
      }
    } catch (e) {
      console.error(e);
      setMessage("❌ Erreur réseau.");
    }
  };

  return (
    <Container>
      <Paper sx={{ padding: 2, marginTop: 2 }}>
        <Typography variant="h5" gutterBottom>
          📦 Gestion des Articles
        </Typography>

        {message && (
          <Alert sx={{ mb: 2 }} severity={message.startsWith("✅") ? "success" : "error"}>
            {message}
          </Alert>
        )}

        {/* Filtre catégorie */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel>Catégorie</InputLabel>
            <Select
              label="Catégorie"
              value={categorieSelectionnee}
              onChange={(e) => setCategorieSelectionnee(e.target.value)}
            >
              <MenuItem value="">Toutes</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="outlined" onClick={() => setCategorieSelectionnee("")}>
            Tout afficher
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Article</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Prix</TableCell>
              <TableCell>Quantité actuelle</TableCell>
              <TableCell>Nouvelle quantité</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.map((a) => (
              <TableRow key={a.idp}>
                <TableCell>{a.nom}</TableCell>
                <TableCell>{a.categorie}</TableCell>
                <TableCell>{a.prix} €</TableCell>
                <TableCell>{a.qte}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={qteModifs[a.idp] ?? ""}
                    onChange={(e) => handleChangeQte(a.idp, e.target.value)}
                    inputProps={{ min: 0 }}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => handleSave(a.idp)}>
                    Sauvegarder
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {articles.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>Aucun article.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}

export default Article;
