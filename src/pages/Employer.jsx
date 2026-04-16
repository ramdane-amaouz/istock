import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Paper
} from "@mui/material";

import { API_URL } from "../api";


function Employer() {
  const [employes, setEmployes] = useState([]);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [editEmploye, setEditEmploye] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchEmployes = async () => {
    const response = await fetch(`${API_URL}/employes?entreprise_id=${user.entreprise_id}`);
    const data = await response.json();
    setEmployes(data);
  };

  useEffect(() => {
    fetchEmployes();
  }, [user.entreprise_id]);

  const handleDelete = async (ide) => {
    if (!window.confirm("Supprimer cet employé ?")) return;

    const response = await fetch(`${API_URL}/delete-employe/${ide}`, {
      method: "DELETE"
    });

    const data = await response.json();
    if (response.ok) {
      setMessage("✅ Employé supprimé !");
      fetchEmployes();
    } else {
      setMessage(`❌ ${data.message}`);
    }
  };

  const handleEditClick = (employe) => {
    setEditEmploye({ ...employe });
    setOpen(true);
  };

  const handleEditChange = (field, value) => {
    setEditEmploye((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    const response = await fetch(`${API_URL}/update-employe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editEmploye)
    });

    const data = await response.json();
    if (response.ok) {
      setMessage("✅ Employé mis à jour !");
      setOpen(false);
      fetchEmployes();
    } else {
      setMessage(`❌ ${data.message}`);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ padding: 3, marginTop: 3 }}>
        <Typography variant="h5" gutterBottom>
          👥 Gestion des employés
        </Typography>

        {message && (
          <Alert severity={message.startsWith("✅") ? "success" : "error"} sx={{ marginBottom: 2 }}>
            {message}
          </Alert>
        )}

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employes.map((e) => (
              <TableRow key={e.ide}>
                <TableCell>{e.nom}</TableCell>
                <TableCell>{e.prenom}</TableCell>
                <TableCell>{e.email}</TableCell>
                <TableCell>{e.tel}</TableCell>
                <TableCell>{e.role}</TableCell>
                <TableCell>
                  <Button variant="outlined" size="small" onClick={() => handleEditClick(e)}>✏️</Button>{" "}
                  <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(e.ide)}>🗑️</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Dialog édition */}
      {editEmploye && (
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Modifier Employé</DialogTitle>
          <DialogContent>
            <TextField
              label="Nom"
              fullWidth
              value={editEmploye.nom}
              onChange={(e) => handleEditChange("nom", e.target.value)}
              sx={{ marginTop: 2 }}
            />
            <TextField
              label="Prénom"
              fullWidth
              value={editEmploye.prenom}
              onChange={(e) => handleEditChange("prenom", e.target.value)}
              sx={{ marginTop: 2 }}
            />
            <TextField
              label="Email"
              fullWidth
              value={editEmploye.email}
              onChange={(e) => handleEditChange("email", e.target.value)}
              sx={{ marginTop: 2 }}
            />
            <TextField
              label="Téléphone"
              fullWidth
              value={editEmploye.tel}
              onChange={(e) => handleEditChange("tel", e.target.value)}
              sx={{ marginTop: 2 }}
            />
            <TextField
              label="Rôle"
              fullWidth
              value={editEmploye.role}
              onChange={(e) => handleEditChange("role", e.target.value)}
              sx={{ marginTop: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Annuler</Button>
            <Button onClick={handleUpdate} variant="contained">Enregistrer</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
}

export default Employer;
