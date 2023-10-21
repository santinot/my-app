import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Grid, Avatar, CardHeader, AppBar, Toolbar } from "@mui/material";

const style = {
  position: "absolute",
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 300,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const addContact = () => {
    
    };

export default function BasicCard() {
  return (
    <Card sx={style}>
      <CardHeader
        sx={{ bgcolor: "#009be5", height: "30px" }}
        title={
          <Typography variant="h6" component="div" sx={{ color: "white" }}>
            Inserisci le informazioni del contatto
          </Typography>
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={3} align="center">
            <Avatar
              src="/img/addcontact.png"
              variant="square"
              sx={{ width: 56, height: 56 }}
            />
          </Grid>
          <Grid item xs={9}>
            <TextField
              id="contact-name"
              label="Nome Contatto"
              type="search"
              variant="filled"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="contact-email"
              label="Indirizzo Email"
              type="search"
              variant="filled"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="contact-whatsapp"
              label="Numero di Cellulare"
              type="search"
              variant="filled"
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button size="large" variant="contained" sx={{mt:-1}} onClick={addContact()}>Aggiungi</Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
