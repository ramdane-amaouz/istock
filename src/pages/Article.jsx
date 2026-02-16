import { useState, useEffect } from "react";
import {
  Container, Table, TableHead, TableRow, TableCell,
  TableBody, TextField, Button, Paper, Typography, Alert
} from "@mui/material";



import { API_URL } from "../api";


function Article() {
  const [articles, setArticles] = useState([]);
  const [qteModifs, setQteModifs] = useState({});
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchArticles = async () => {
      const response = await fetch(`https://istock-backend-p2uc.onrender.com/articles?entreprise_id=${user.entreprise_id}`);
      const data = await response.json();
      setArticles(data);
    };
    fetchArticles();
  }, [user.entreprise_id]);

  const handleChange = (idp, value) => {
    setQteModifs((prev) => ({
      ...prev,
      [idp]: value
    }));
  };

  const handleSave = async (idp) => {
    const nouvelleQte = parseInt(qteModifs[idp], 10);
    const response = await fetch("https://istock-backend-p2uc.onrender.com/update-quantity", {
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
      // refresh liste articles
      const updatedArticles = articles.map(a =>
        a.idp === idp ? { ...a, qte: nouvelleQte } : a
      );
      setArticles(updatedArticles);
    } else {
      setMessage(`❌ ${data.message}`);
    }
  };

  return (
    <Container>
      <Paper sx={{ padding: 2, marginTop: 2 }}>
        <Typography variant="h5" gutterBottom>
          📦 Gestion des Articles
        </Typography>
        {message && <Alert severity={message.startsWith("✅") ? "success" : "error"}>{message}</Alert>}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Article</TableCell>
              <TableCell>Description</TableCell>
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
                <TableCell>{a.description}</TableCell>
                <TableCell>{a.prix} €</TableCell>
                <TableCell>{a.qte}</TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={qteModifs[a.idp] || ""}
                    onChange={(e) => handleChange(a.idp, e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => handleSave(a.idp)}>
                    Sauvegarder
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}

export default Article;
